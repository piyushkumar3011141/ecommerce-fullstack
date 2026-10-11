package com.ecommerce.ecommercebackend.dto;

import lombok.Data;

/** Checkout par user ki payment details. Card number / CVV kabhi database me save nahi hote. */
@Data
public class PaymentDetails {
    private String cardNumber;
    private String cardName;
    private String expiry;   // MM/YY
    private String cvv;
    private String upiId;
    private String bank;
}
