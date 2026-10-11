package com.ecommerce.ecommercebackend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.ecommercebackend.entity.Cart;
import com.ecommerce.ecommercebackend.service.CartService;
import com.ecommerce.ecommercebackend.service.CurrentUserService;

/**
 * Cart hamesha logged-in user (JWT) ka hota hai, isliye URL me userId nahi aati.
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final CurrentUserService currentUserService;

    public CartController(CartService cartService, CurrentUserService currentUserService) {
        this.cartService = cartService;
        this.currentUserService = currentUserService;
    }

    // GET MY CART
    @GetMapping
    public List<Cart> getMyCart() {
        return cartService.getUserCart(currentUserService.requireUser());
    }

    // ADD TO CART
    @PostMapping
    public Cart addToCart(
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") int quantity) {
        return cartService.addToCart(currentUserService.requireUser(), productId, quantity);
    }

    // UPDATE QUANTITY
    @PutMapping("/{cartId}")
    public Cart updateQuantity(@PathVariable Long cartId, @RequestParam int quantity) {
        return cartService.updateQuantity(currentUserService.requireUser(), cartId, quantity);
    }

    // REMOVE ONE ITEM
    @DeleteMapping("/{cartId}")
    public Map<String, String> removeCartItem(@PathVariable Long cartId) {
        cartService.removeCartItem(currentUserService.requireUser(), cartId);
        return Map.of("message", "Cart item removed successfully");
    }

    // CLEAR CART
    @DeleteMapping
    public Map<String, String> clearCart() {
        cartService.clearCart(currentUserService.requireUser());
        return Map.of("message", "Cart cleared successfully");
    }
}
