package com.ecommerce.ecommercebackend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.ecommercebackend.entity.SitePage;

public interface SitePageRepository extends JpaRepository<SitePage, Long> {

    Optional<SitePage> findBySlug(String slug);
}
