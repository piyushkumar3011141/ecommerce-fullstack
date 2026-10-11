package com.ecommerce.ecommercebackend.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommercebackend.entity.Product;
import com.ecommerce.ecommercebackend.repository.CartRepository;
import com.ecommerce.ecommercebackend.repository.ProductRepository;
import com.ecommerce.ecommercebackend.repository.ReviewRepository;
import com.ecommerce.ecommercebackend.repository.WishlistRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final WishlistRepository wishlistRepository;
    private final ReviewRepository reviewRepository;

    public ProductService(
            ProductRepository productRepository,
            CartRepository cartRepository,
            WishlistRepository wishlistRepository,
            ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.wishlistRepository = wishlistRepository;
        this.reviewRepository = reviewRepository;
    }

    // Product delete karne se pehle cart / wishlist ki rows hatani padti hain (foreign key)
    @Transactional
    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        cartRepository.deleteByProduct(product);
        wishlistRepository.deleteByProduct(product);
        reviewRepository.deleteByProduct(product);
        productRepository.delete(product);
    }
}
