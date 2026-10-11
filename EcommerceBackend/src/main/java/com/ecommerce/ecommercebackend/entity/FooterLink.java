package com.ecommerce.ecommercebackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Footer ka ek link. Footer poora database se banta hai. */
@Entity
@Table(name = "footer_links")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FooterLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String section;
    private int sectionOrder;
    private int sortOrder;
    private String label;
    private String path;     // "/page/about-us" jaisa internal ya "https://..." external
    private String icon;     // optional Font Awesome class
}
