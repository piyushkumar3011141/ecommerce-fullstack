package com.ecommerce.ecommercebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String brand;
    private String category;
    private String subCategory;
    private double price;
    private double mrp;
    private double discount;
    private double rating;
    private int reviews;

    @Column(length = 1000)
    private String description;

    @Column(length = 1000)
    private String image;

    private int stock;
    private boolean deal;
    private boolean featured;
    private boolean newArrival;

    // Pehle review se pehle ki (seed) rating/reviews. Real reviews isme mix hoke rating nikalti hai.
    @JsonIgnore
    private Double baseRating;

    @JsonIgnore
    private Integer baseReviews;
}
