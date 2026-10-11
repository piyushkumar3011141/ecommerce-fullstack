package com.ecommerce.ecommercebackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** About, Privacy, Returns jaise static content pages. */
@Entity
@Table(name = "site_pages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SitePage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String slug;

    private String title;

    @Column(length = 5000)
    private String content;
}
