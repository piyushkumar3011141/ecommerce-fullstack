package com.ecommerce.ecommercebackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.ecommercebackend.entity.Subscriber;

public interface SubscriberRepository extends JpaRepository<Subscriber, Long> {

    boolean existsByEmailIgnoreCase(String email);
}
