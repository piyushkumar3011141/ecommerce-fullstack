package com.ecommerce.ecommercebackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.ecommercebackend.entity.Product;

public interface ProductRepository extends JpaRepository<Product , Long> {

}
