package com.ecommerce.ecommercebackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.ecommercebackend.entity.Cart;
import com.ecommerce.ecommercebackend.entity.Product;
import com.ecommerce.ecommercebackend.entity.User;

public interface CartRepository extends JpaRepository<Cart, Long> {

    // User ke saare cart items
    List<Cart> findByUser(User user);

    // Check karo user ke cart me ye product already hai ya nahi
    Optional<Cart> findByUserAndProduct(User user, Product product);

    // Product delete hone se pehle uske cart rows hatane ke liye
    void deleteByProduct(Product product);
}
