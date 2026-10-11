package com.ecommerce.ecommercebackend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommercebackend.entity.Product;
import com.ecommerce.ecommercebackend.repository.ProductRepository;
import com.ecommerce.ecommercebackend.service.CurrentUserService;
import com.ecommerce.ecommercebackend.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final ProductService productService;
    private final CurrentUserService currentUserService;

    public ProductController(
            ProductRepository productRepository,
            ProductService productService,
            CurrentUserService currentUserService) {
        this.productRepository = productRepository;
        this.productService = productService;
        this.currentUserService = currentUserService;
    }

    // Get All Products (public)
    @GetMapping
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    // Get Product By ID (public)
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    // Add Product (ADMIN only)
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        currentUserService.requireAdmin();
        product.setId(null);
        return productRepository.save(product);
    }

    // Bulk add (ADMIN panel ka "Import sample products" isko use karta hai)
    @PostMapping("/bulk")
    public List<Product> addProducts(@RequestBody List<Product> products) {
        currentUserService.requireAdmin();
        products.forEach(p -> p.setId(null));
        return productRepository.saveAll(products);
    }

    // Update Product (saare fields)
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        currentUserService.requireAdmin();

        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        existing.setName(product.getName());
        existing.setBrand(product.getBrand());
        existing.setCategory(product.getCategory());
        existing.setSubCategory(product.getSubCategory());
        existing.setPrice(product.getPrice());
        existing.setMrp(product.getMrp());
        existing.setDiscount(product.getDiscount());
        existing.setRating(product.getRating());
        existing.setReviews(product.getReviews());
        existing.setDescription(product.getDescription());
        existing.setImage(product.getImage());
        existing.setStock(product.getStock());
        existing.setDeal(product.isDeal());
        existing.setFeatured(product.isFeatured());
        existing.setNewArrival(product.isNewArrival());

        return productRepository.save(existing);
    }

    // Delete Product
    @DeleteMapping("/{id}")
    public Map<String, String> deleteProduct(@PathVariable Long id) {
        currentUserService.requireAdmin();
        productService.delete(id);
        return Map.of("message", "Product deleted successfully");
    }
}
