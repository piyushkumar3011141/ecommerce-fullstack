package com.ecommerce.ecommercebackend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommercebackend.entity.Product;
import com.ecommerce.ecommercebackend.entity.User;
import com.ecommerce.ecommercebackend.entity.WishlistItem;
import com.ecommerce.ecommercebackend.repository.ProductRepository;
import com.ecommerce.ecommercebackend.repository.WishlistRepository;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistRepository wishlistRepository, ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
    }

    // User ki wishlist ke products
    public List<Product> getWishlist(User user) {
        return wishlistRepository.findByUser(user)
                .stream()
                .map(WishlistItem::getProduct)
                .toList();
    }

    // Add (pehle se ho to kuch nahi hota)
    @Transactional
    public void add(User user, Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        if (wishlistRepository.findByUserAndProduct(user, product).isPresent()) {
            return;
        }

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);
        wishlistRepository.save(item);
    }

    // Remove (ho hi na to bhi theek)
    @Transactional
    public void remove(User user, Long productId) {
        productRepository.findById(productId).ifPresent(product ->
                wishlistRepository.findByUserAndProduct(user, product)
                        .ifPresent(wishlistRepository::delete));
    }
}
