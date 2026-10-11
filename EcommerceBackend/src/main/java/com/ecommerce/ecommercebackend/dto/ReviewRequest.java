package com.ecommerce.ecommercebackend.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private int rating;      // 1 se 5
    private String comment;
}
