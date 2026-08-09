package com.vastrada.dto;

import com.vastrada.entity.Product;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ProductDTO {
    private Long id;
    private String name;
    private String slug;
    private String brand;
    private String description;
    private String specifications;
    private String material;
    private String careInstructions;
    private String deliveryInfo;
    private BigDecimal basePrice;
    private BigDecimal discountPrice;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private List<ProductImageDTO> images = new ArrayList<>();
    private List<ProductVariantDTO> variants = new ArrayList<>();
    private Boolean isFeatured;
    private Boolean isNewArrival;
    private Boolean isBestSeller;
    private Boolean isTrending;
    private Boolean isActive;
    private Double averageRating;
    private Integer reviewCount;
    private ZonedDateTime createdAt;

    public ProductDTO() {}

    public ProductDTO(Product product) {
        if (product != null) {
            this.id = product.getId();
            this.name = product.getName();
            this.slug = product.getSlug();
            this.brand = product.getBrand();
            this.description = product.getDescription();
            this.specifications = product.getSpecifications();
            this.material = product.getMaterial();
            this.careInstructions = product.getCareInstructions();
            this.deliveryInfo = product.getDeliveryInfo();
            this.basePrice = product.getBasePrice();
            this.discountPrice = product.getDiscountPrice();
            if (product.getCategory() != null) {
                this.categoryId = product.getCategory().getId();
                this.categoryName = product.getCategory().getName();
                this.categorySlug = product.getCategory().getSlug();
            }
            if (product.getImages() != null) {
                this.images = product.getImages().stream()
                        .map(ProductImageDTO::new)
                        .collect(Collectors.toList());
            }
            if (product.getVariants() != null) {
                this.variants = product.getVariants().stream()
                        .map(ProductVariantDTO::new)
                        .collect(Collectors.toList());
            }
            this.isFeatured = product.getIsFeatured();
            this.isNewArrival = product.getIsNewArrival();
            this.isBestSeller = product.getIsBestSeller();
            this.isTrending = product.getIsTrending();
            this.isActive = product.getIsActive();
            this.averageRating = product.getAverageRating();
            this.reviewCount = product.getReviewCount();
            this.createdAt = product.getCreatedAt();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSpecifications() { return specifications; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }

    public String getCareInstructions() { return careInstructions; }
    public void setCareInstructions(String careInstructions) { this.careInstructions = careInstructions; }

    public String getDeliveryInfo() { return deliveryInfo; }
    public void setDeliveryInfo(String deliveryInfo) { this.deliveryInfo = deliveryInfo; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public BigDecimal getDiscountPrice() { return discountPrice; }
    public void setDiscountPrice(BigDecimal discountPrice) { this.discountPrice = discountPrice; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategorySlug() { return categorySlug; }
    public void setCategorySlug(String categorySlug) { this.categorySlug = categorySlug; }

    public List<ProductImageDTO> getImages() { return images; }
    public void setImages(List<ProductImageDTO> images) { this.images = images; }

    public List<ProductVariantDTO> getVariants() { return variants; }
    public void setVariants(List<ProductVariantDTO> variants) { this.variants = variants; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getIsNewArrival() { return isNewArrival; }
    public void setIsNewArrival(Boolean isNewArrival) { this.isNewArrival = isNewArrival; }

    public Boolean getIsBestSeller() { return isBestSeller; }
    public void setIsBestSeller(Boolean isBestSeller) { this.isBestSeller = isBestSeller; }

    public Boolean getIsTrending() { return isTrending; }
    public void setIsTrending(Boolean isTrending) { this.isTrending = isTrending; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}
