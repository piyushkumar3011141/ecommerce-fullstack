package com.ecommerce.ecommercebackend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.ecommercebackend.dto.ReviewRequest;
import com.ecommerce.ecommercebackend.dto.ReviewResponse;
import com.ecommerce.ecommercebackend.service.CurrentUserService;
import com.ecommerce.ecommercebackend.service.ReviewService;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;
    private final CurrentUserService currentUserService;

    public ReviewController(ReviewService reviewService, CurrentUserService currentUserService) {
        this.reviewService = reviewService;
        this.currentUserService = currentUserService;
    }

    // Reviews dekhna public hai (GET /api/products/** SecurityConfig me permit hai)
    @GetMapping("/products/{productId}/reviews")
    public List<ReviewResponse> getReviews(@PathVariable Long productId) {
        return reviewService.list(productId);
    }

    // Review likhna / update karna (login required)
    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long productId,
            @RequestBody ReviewRequest request) {

        ReviewResponse saved = reviewService.addOrUpdate(currentUserService.requireUser(), productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Apna review delete (admin kisi ka bhi)
    @DeleteMapping("/reviews/{id}")
    public Map<String, String> deleteReview(@PathVariable Long id) {
        reviewService.delete(currentUserService.requireUser(), id);
        return Map.of("message", "Review deleted");
    }
}
