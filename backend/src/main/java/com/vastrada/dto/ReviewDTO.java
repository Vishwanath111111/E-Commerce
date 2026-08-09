package com.vastrada.dto;

import com.vastrada.entity.Review;
import java.time.ZonedDateTime;

public class ReviewDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Long userId;
    private String customerName;
    private Integer rating;
    private String title;
    private String comment;
    private Boolean isVerifiedPurchase;
    private Review.ReviewStatus status;
    private ZonedDateTime createdAt;

    public ReviewDTO() {}

    public ReviewDTO(Review review) {
        if (review != null) {
            this.id = review.getId();
            if (review.getProduct() != null) {
                this.productId = review.getProduct().getId();
                this.productName = review.getProduct().getName();
            }
            if (review.getUser() != null) {
                this.userId = review.getUser().getId();
                this.customerName = review.getUser().getFullName();
            }
            this.rating = review.getRating();
            this.title = review.getTitle();
            this.comment = review.getComment();
            this.isVerifiedPurchase = review.getIsVerifiedPurchase();
            this.status = review.getStatus();
            this.createdAt = review.getCreatedAt();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Boolean getIsVerifiedPurchase() { return isVerifiedPurchase; }
    public void setIsVerifiedPurchase(Boolean isVerifiedPurchase) { this.isVerifiedPurchase = isVerifiedPurchase; }

    public Review.ReviewStatus getStatus() { return status; }
    public void setStatus(Review.ReviewStatus status) { this.status = status; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}
