package com.ecommerce.ecommercebackend.dto;

import java.util.ArrayList;
import java.util.List;

import com.ecommerce.ecommercebackend.entity.OrderItem;

import lombok.Data;

/** Order place karne ki request (client se sirf itna hi liya jata hai; price/user server decide karta hai). */
@Data
public class OrderRequest {
    private String orderNumber;
    private String payment;               // COD / UPI / Credit / Debit Card / Net Banking
    private PaymentDetails paymentDetails;
    private String customerName;
    private String customerCity;
    private List<OrderItem> items = new ArrayList<>();
}
