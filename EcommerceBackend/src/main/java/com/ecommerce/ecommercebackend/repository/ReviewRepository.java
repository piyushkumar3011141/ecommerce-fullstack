package com.ecommerce.ecommercebackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.ecommercebackend.entity.Product;
import com.ecommerce.ecommercebackend.entity.Review;
import com.ecommerce.ecommercebackend.entity.User;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductOrderByIdDesc(Product product);

    Optional<Review> findByUserAndProduct(User user, Product product);

    void deleteByProduct(Product product);
}
