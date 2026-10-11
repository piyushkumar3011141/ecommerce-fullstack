package com.ecommerce.ecommercebackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ecommerce.ecommercebackend.entity.Order;
import com.ecommerce.ecommercebackend.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Naye orders pehle
    List<Order> findByUserOrderByIdDesc(User user);

    List<Order> findAllByOrderByIdDesc();

    // "Verified purchase" badge ke liye: user ne ye product (cancel kiye bina) kharida hai?
    @Query("select count(o) from Order o join o.items i "
            + "where o.user = :user and i.productId = :productId and o.status <> 'Cancelled'")
    long countPurchases(@Param("user") User user, @Param("productId") Long productId);
}
