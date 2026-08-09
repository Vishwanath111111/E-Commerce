package com.vastrada.controller;

import com.vastrada.dto.ApiResponse;
import com.vastrada.dto.ReviewCreateRequest;
import com.vastrada.dto.ReviewDTO;
import com.vastrada.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getProductReviews(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getApprovedReviewsForProduct(productId);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", reviews));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewDTO>> createReview(@Valid @RequestBody ReviewCreateRequest request) {
        ReviewDTO review = reviewService.createReview(request);
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", review));
    }
}
