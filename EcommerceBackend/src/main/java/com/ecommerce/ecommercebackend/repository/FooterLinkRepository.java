package com.ecommerce.ecommercebackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.ecommercebackend.entity.FooterLink;

public interface FooterLinkRepository extends JpaRepository<FooterLink, Long> {

    List<FooterLink> findAllByOrderBySectionOrderAscSortOrderAsc();
}
