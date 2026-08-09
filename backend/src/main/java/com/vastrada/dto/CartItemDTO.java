package com.vastrada.dto;

import com.vastrada.entity.CartItem;
import java.math.BigDecimal;

public class CartItemDTO {
    private Long id;
    private Long variantId;
    private String sku;
    private Long productId;
    private String productName;
    private String productSlug;
    private String imageUrl;
    private String size;
    private String color;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private Integer availableStock;

    public CartItemDTO() {}

    public CartItemDTO(CartItem item) {
        if (item != null) {
            this.id = item.getId();
            if (item.getVariant() != null) {
                this.variantId = item.getVariant().getId();
                this.sku = item.getVariant().getSku();
                this.size = item.getVariant().getSize();
                this.color = item.getVariant().getColor();
                if (item.getVariant().getProduct() != null) {
                    this.productId = item.getVariant().getProduct().getId();
                    this.productName = item.getVariant().getProduct().getName();
                    this.productSlug = item.getVariant().getProduct().getSlug();
                    if (item.getVariant().getProduct().getImages() != null && !item.getVariant().getProduct().getImages().isEmpty()) {
                        this.imageUrl = item.getVariant().getProduct().getImages().get(0).getImageUrl();
                    }
                }
                if (item.getVariant().getInventory() != null) {
                    this.availableStock = item.getVariant().getInventory().getAvailableQuantity();
                }
            }
            this.quantity = item.getQuantity();
            this.unitPrice = item.getUnitPrice();
            this.totalPrice = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getVariantId() { return variantId; }
    public void setVariantId(Long variantId) { this.variantId = variantId; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductSlug() { return productSlug; }
    public void setProductSlug(String productSlug) { this.productSlug = productSlug; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public Integer getAvailableStock() { return availableStock; }
    public void setAvailableStock(Integer availableStock) { this.availableStock = availableStock; }
}
