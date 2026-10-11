package com.ecommerce.ecommercebackend.service;

import java.time.Instant;
import java.time.YearMonth;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommercebackend.dto.PaymentDetails;
import com.ecommerce.ecommercebackend.entity.Order;
import com.ecommerce.ecommercebackend.entity.Payment;
import com.ecommerce.ecommercebackend.entity.User;
import com.ecommerce.ecommercebackend.repository.PaymentRepository;

/**
 * Payment processing.
 *
 * NOTE: Ye ek SIMULATED gateway hai (demo/portfolio ke liye), koi asli paisa nahi katta.
 * Asli gateway (Razorpay / Stripe) lagana ho to sirf charge() method badalna padega.
 *
 * Test cards:
 *   - Koi bhi valid card number (Luhn pass), e.g. 4111 1111 1111 1111  -> success
 *   - 4000 0000 0000 0002                                              -> declined
 *   - UPI "fail@upi"                                                   -> declined
 *
 * Card number aur CVV kabhi save nahi hote, sirf last 4 digits.
 */
@Service
public class PaymentService {

    private static final Pattern UPI_PATTERN = Pattern.compile("^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$");

    public record PaymentResult(String method, String label, String status, String transactionId, String cardLast4) {}

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // Payment karo (ya COD me pending mark karo). Fail hone par exception -> order rollback.
    public PaymentResult charge(String methodName, PaymentDetails details, double amount) {

        String method = normalizeMethod(methodName);

        if (amount <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order amount");
        }

        switch (method) {
            case "COD":
                return new PaymentResult("COD", "Cash on Delivery", "PENDING", newTxnId("COD"), null);

            case "UPI": {
                String upi = details == null || details.getUpiId() == null ? "" : details.getUpiId().trim();

                if (!UPI_PATTERN.matcher(upi).matches()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid UPI ID (e.g. name@bank)");
                }
                if (upi.toLowerCase(Locale.ROOT).startsWith("fail@")) {
                    throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "Payment declined by UPI app");
                }
                return new PaymentResult("UPI", "UPI", "PAID", newTxnId("UPI"), null);
            }

            case "CARD": {
                if (details == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Card details are required");
                }

                String number = details.getCardNumber() == null ? "" : details.getCardNumber().replaceAll("[\\s-]", "");

                if (!number.matches("\\d{13,19}") || !passesLuhn(number)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid card number");
                }
                if (details.getCardName() == null || details.getCardName().isBlank()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name on card is required");
                }
                if (!isExpiryValid(details.getExpiry())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Card expiry is invalid or expired (use MM/YY)");
                }
                if (details.getCvv() == null || !details.getCvv().matches("\\d{3,4}")) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid CVV");
                }
                if (number.endsWith("0002")) {
                    throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "Card declined by the bank");
                }

                String last4 = number.substring(number.length() - 4);
                return new PaymentResult("CARD", "Credit / Debit Card", "PAID", newTxnId("CARD"), last4);
            }

            case "NETBANKING": {
                if (details == null || details.getBank() == null || details.getBank().isBlank()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please select your bank");
                }
                return new PaymentResult("NETBANKING", "Net Banking", "PAID", newTxnId("NB"), null);
            }

            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported payment method");
        }
    }

    // Order save hone ke baad payment record banao
    public Payment record(User user, Order order, PaymentResult result) {
        Payment payment = new Payment();
        payment.setOrderId(order.getId());
        payment.setOrderNumber(order.getOrderNumber());
        payment.setUser(user);
        payment.setMethod(result.method());
        payment.setAmount(order.getTotal());
        payment.setStatus(result.status());
        payment.setTransactionId(result.transactionId());
        payment.setCardLast4(result.cardLast4());
        payment.setCreatedAt(Instant.now().toString());
        return paymentRepository.save(payment);
    }

    // Order ke payment ka status badlo (COD delivered -> PAID, cancel -> REFUNDED / CANCELLED)
    public void updateStatus(Long orderId, String status) {
        paymentRepository.findFirstByOrderId(orderId).ifPresent(p -> {
            p.setStatus(status);
            paymentRepository.save(p);
        });
    }

    // ---------- helpers ----------

    private String normalizeMethod(String name) {
        String m = name == null ? "" : name.toLowerCase(Locale.ROOT);

        if (m.contains("cod") || m.contains("cash")) return "COD";
        if (m.contains("upi")) return "UPI";
        if (m.contains("card")) return "CARD";
        if (m.contains("net")) return "NETBANKING";
        return "";
    }

    private String newTxnId(String prefix) {
        return prefix + "-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase(Locale.ROOT);
    }

    // Luhn checksum (card number ka standard check)
    static boolean passesLuhn(String number) {
        int sum = 0;
        boolean alternate = false;

        for (int i = number.length() - 1; i >= 0; i--) {
            int digit = number.charAt(i) - '0';

            if (alternate) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            alternate = !alternate;
        }
        return sum % 10 == 0;
    }

    private boolean isExpiryValid(String expiry) {
        if (expiry == null || !expiry.matches("(0[1-9]|1[0-2])/\\d{2}")) {
            return false;
        }

        int month = Integer.parseInt(expiry.substring(0, 2));
        int year = 2000 + Integer.parseInt(expiry.substring(3));

        return !YearMonth.of(year, month).isBefore(YearMonth.now());
    }
}
