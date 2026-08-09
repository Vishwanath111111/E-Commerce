package com.vastrada.service;

import com.vastrada.dto.ReviewCreateRequest;
import com.vastrada.dto.ReviewDTO;
import com.vastrada.entity.Product;
import com.vastrada.entity.Review;
import com.vastrada.entity.User;
import com.vastrada.exception.BadRequestException;
import com.vastrada.exception.ResourceNotFoundException;
import com.vastrada.repository.OrderRepository;
import com.vastrada.repository.ProductRepository;
import com.vastrada.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AuthService authService;

    public List<ReviewDTO> getApprovedReviewsForProduct(Long productId) {
        return reviewRepository.findByProductIdAndStatusOrderByCreatedAtDesc(productId, Review.ReviewStatus.APPROVED)
                .stream().map(ReviewDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO createReview(ReviewCreateRequest request) {
        User currentUser = authService.getCurrentUser();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + request.getProductId()));

        Long deliveredCount = orderRepository.countDeliveredOrdersForProduct(currentUser.getId(), product.getId());
        Boolean isVerified = deliveredCount != null && deliveredCount > 0;

        Review review = new Review(
                product,
                currentUser,
                request.getRating(),
                request.getTitle(),
                request.getComment(),
                isVerified
        );

        Review savedReview = reviewRepository.save(review);
        updateProductRatingStats(product.getId());

        return new ReviewDTO(savedReview);
    }

    @Transactional
    public void updateProductRatingStats(Long productId) {
        Double avgRating = reviewRepository.calculateAverageRatingForProduct(productId);
        Integer count = reviewRepository.countApprovedReviewsForProduct(productId);

        Product product = productRepository.findById(productId).orElse(null);
        if (product != null) {
            product.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
            product.setReviewCount(count != null ? count : 0);
            productRepository.save(product);
        }
    }

    // ADMIN MODERATION
    public Page<ReviewDTO> getAllReviewsAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reviewRepository.findAllByOrderByCreatedAtDesc(pageable).map(ReviewDTO::new);
    }

    @Transactional
    public ReviewDTO updateReviewStatusAdmin(Long reviewId, Review.ReviewStatus status) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));

        review.setStatus(status);
        Review saved = reviewRepository.save(review);
        updateProductRatingStats(saved.getProduct().getId());

        return new ReviewDTO(saved);
    }

    @Transactional
    public void deleteReviewAdmin(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));
        Long productId = review.getProduct().getId();
        reviewRepository.delete(review);
        updateProductRatingStats(productId);
    }
}
