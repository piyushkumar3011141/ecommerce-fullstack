package com.ecommerce.ecommercebackend.service;

import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommercebackend.dto.ReviewRequest;
import com.ecommerce.ecommercebackend.dto.ReviewResponse;
import com.ecommerce.ecommercebackend.entity.Product;
import com.ecommerce.ecommercebackend.entity.Review;
import com.ecommerce.ecommercebackend.entity.User;
import com.ecommerce.ecommercebackend.repository.OrderRepository;
import com.ecommerce.ecommercebackend.repository.ProductRepository;
import com.ecommerce.ecommercebackend.repository.ReviewRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    // Product ke saare reviews (naye pehle)
    public List<ReviewResponse> list(Long productId) {
        Product product = findProduct(productId);

        return reviewRepository.findByProductOrderByIdDesc(product)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Review add karo; user ka review pehle se hai to update ho jata hai (ek user = ek review)
    @Transactional
    public ReviewResponse addOrUpdate(User user, Long productId, ReviewRequest request) {

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
        }

        String comment = request.getComment() == null ? "" : request.getComment().trim();

        if (comment.length() > 1000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Review is too long (max 1000 characters)");
        }

        Product product = findProduct(productId);

        Review review = reviewRepository.findByUserAndProduct(user, product).orElseGet(() -> {
            Review r = new Review();
            r.setUser(user);
            r.setProduct(product);
            return r;
        });

        review.setRating(request.getRating());
        review.setComment(comment);
        review.setCreatedAt(Instant.now().toString());

        Review saved = reviewRepository.save(review);
        recalculateRating(product);

        return toResponse(saved);
    }

    // Review delete: apna ya admin
    @Transactional
    public void delete(User user, Long reviewId) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        boolean owner = review.getUser() != null && review.getUser().getId().equals(user.getId());

        if (!owner && !user.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own review");
        }

        Product product = review.getProduct();
        reviewRepository.delete(review);
        reviewRepository.flush();

        recalculateRating(product);
    }

    // Product ki rating = (seed rating x seed reviews + real reviews ka sum) / total.
    // Seed values pehli baar yaad rakh li jati hain, isliye delete par rating wapas sahi ho jati hai.
    private void recalculateRating(Product product) {

        if (product.getBaseReviews() == null || product.getBaseRating() == null) {
            product.setBaseReviews(product.getReviews());
            product.setBaseRating(product.getRating());
        }

        List<Review> reviews = reviewRepository.findByProductOrderByIdDesc(product);

        int sum = reviews.stream().mapToInt(Review::getRating).sum();
        int totalCount = product.getBaseReviews() + reviews.size();

        double rating = totalCount == 0
                ? 0
                : (product.getBaseRating() * product.getBaseReviews() + sum) / totalCount;

        product.setReviews(totalCount);
        product.setRating(Math.round(rating * 10.0) / 10.0);

        productRepository.save(product);
    }

    private ReviewResponse toResponse(Review review) {
        boolean verified = review.getUser() != null
                && orderRepository.countPurchases(review.getUser(), review.getProduct().getId()) > 0;

        return new ReviewResponse(
                review.getId(),
                review.getUser() == null ? null : review.getUser().getId(),
                review.getUser() == null ? "Customer" : review.getUser().getName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt(),
                verified);
    }

    private Product findProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }
}
