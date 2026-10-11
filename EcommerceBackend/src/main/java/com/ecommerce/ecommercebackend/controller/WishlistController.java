package com.ecommerce.ecommercebackend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.ecommercebackend.entity.Product;
import com.ecommerce.ecommercebackend.service.CurrentUserService;
import com.ecommerce.ecommercebackend.service.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final CurrentUserService currentUserService;

    public WishlistController(WishlistService wishlistService, CurrentUserService currentUserService) {
        this.wishlistService = wishlistService;
        this.currentUserService = currentUserService;
    }

    // MY WISHLIST (products ki list)
    @GetMapping
    public List<Product> getMyWishlist() {
        return wishlistService.getWishlist(currentUserService.requireUser());
    }

    // ADD
    @PostMapping("/{productId}")
    public Map<String, String> add(@PathVariable Long productId) {
        wishlistService.add(currentUserService.requireUser(), productId);
        return Map.of("message", "Added to wishlist");
    }

    // REMOVE
    @DeleteMapping("/{productId}")
    public Map<String, String> remove(@PathVariable Long productId) {
        wishlistService.remove(currentUserService.requireUser(), productId);
        return Map.of("message", "Removed from wishlist");
    }
}
