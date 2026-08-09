package com.vastrada.dto;

import com.vastrada.entity.ProductVariant;
import java.math.BigDecimal;

public class ProductVariantDTO {
    private Long id;
    private String sku;
    private String size;
    private String color;
    private String colorHex;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Boolean isActive;
    private Integer availableQuantity;
    private Boolean inStock;

    public ProductVariantDTO() {}

    public ProductVariantDTO(ProductVariant variant) {
        if (variant != null) {
            this.id = variant.getId();
            this.sku = variant.getSku();
            this.size = variant.getSize();
            this.color = variant.getColor();
            this.colorHex = variant.getColorHex();
            this.price = variant.getPrice();
            this.discountPrice = variant.getDiscountPrice();
            this.isActive = variant.getIsActive();
            if (variant.getInventory() != null) {
                this.availableQuantity = variant.getInventory().getAvailableQuantity();
                this.inStock = this.availableQuantity > 0;
            } else {
                this.availableQuantity = 0;
                this.inStock = false;
            }
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getColorHex() { return colorHex; }
    public void setColorHex(String colorHex) { this.colorHex = colorHex; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getDiscountPrice() { return discountPrice; }
    public void setDiscountPrice(BigDecimal discountPrice) { this.discountPrice = discountPrice; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Integer getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(Integer availableQuantity) { this.availableQuantity = availableQuantity; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }
}
