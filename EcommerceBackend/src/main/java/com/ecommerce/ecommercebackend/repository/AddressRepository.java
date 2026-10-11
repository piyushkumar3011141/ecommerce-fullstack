package com.ecommerce.ecommercebackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.ecommercebackend.entity.Address;
import com.ecommerce.ecommercebackend.entity.User;

public interface AddressRepository
        extends JpaRepository<Address, Long> {

    List<Address> findByUser(User user);
}