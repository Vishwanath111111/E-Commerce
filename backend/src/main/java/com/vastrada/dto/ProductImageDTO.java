package com.vastrada.dto;

import com.vastrada.entity.ProductImage;

public class ProductImageDTO {
    private Long id;
    private String imageUrl;
    private Boolean isPrimary;
    private Integer displayOrder;

    public ProductImageDTO() {}

    public ProductImageDTO(ProductImage image) {
        if (image != null) {
            this.id = image.getId();
            this.imageUrl = image.getImageUrl();
            this.isPrimary = image.getIsPrimary();
            this.displayOrder = image.getDisplayOrder();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
