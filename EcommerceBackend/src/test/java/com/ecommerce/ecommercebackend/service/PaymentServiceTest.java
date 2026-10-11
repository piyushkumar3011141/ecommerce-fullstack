package com.ecommerce.ecommercebackend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommercebackend.dto.PaymentDetails;

/** Pure unit tests (database ki zarurat nahi). */
class PaymentServiceTest {

    // charge() repository use nahi karta, isliye null chalega
    private final PaymentService service = new PaymentService(null);

    private PaymentDetails card(String number) {
        PaymentDetails d = new PaymentDetails();
        d.setCardNumber(number);
        d.setCardName("Test User");
        d.setExpiry("12/99");
        d.setCvv("123");
        return d;
    }

    @Test
    void luhnAcceptsValidAndRejectsInvalidNumbers() {
        assertTrue(PaymentService.passesLuhn("4111111111111111"));
        assertFalse(PaymentService.passesLuhn("4111111111111112"));
    }

    @Test
    void codIsPendingUntilDelivery() {
        PaymentService.PaymentResult result = service.charge("COD", null, 499);
        assertEquals("PENDING", result.status());
    }

    @Test
    void validCardIsPaidAndOnlyLastFourDigitsAreKept() {
        PaymentService.PaymentResult result = service.charge("Credit / Debit Card", card("4111 1111 1111 1111"), 999);
        assertEquals("PAID", result.status());
        assertEquals("1111", result.cardLast4());
    }

    @Test
    void testDeclineCardReturnsPaymentRequired() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.charge("Credit / Debit Card", card("4000 0000 0000 0002"), 999));
        assertEquals(HttpStatus.PAYMENT_REQUIRED, ex.getStatusCode());
    }

    @Test
    void invalidUpiIdIsRejected() {
        PaymentDetails d = new PaymentDetails();
        d.setUpiId("not-a-upi");
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.charge("UPI", d, 100));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void expiredCardIsRejected() {
        PaymentDetails d = card("4111111111111111");
        d.setExpiry("01/20");
        assertThrows(ResponseStatusException.class, () -> service.charge("Credit / Debit Card", d, 100));
    }
}
