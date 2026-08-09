package com.vastrada.dto;

import com.vastrada.entity.OrderItem;
import java.math.BigDecimal;

public class OrderItemDTO {
    private Long id;
    private Long variantId;
    private String productName;
    private String variantSku;
    private String size;
    private String color;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private String imageUrl;

    public OrderItemDTO() {}

    public OrderItemDTO(OrderItem item) {
        if (item != null) {
            this.id = item.getId();
            if (item.getVariant() != null) {
                this.variantId = item.getVariant().getId();
                if (item.getVariant().getProduct() != null && item.getVariant().getProduct().getImages() != null && !item.getVariant().getProduct().getImages().isEmpty()) {
                    this.imageUrl = item.getVariant().getProduct().getImages().get(0).getImageUrl();
                }
            }
            this.productName = item.getProductName();
            this.variantSku = item.getVariantSku();
            this.size = item.getSize();
            this.color = item.getColor();
            this.quantity = item.getQuantity();
            this.unitPrice = item.getUnitPrice();
            this.totalPrice = item.getTotalPrice();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getVariantId() { return variantId; }
    public void setVariantId(Long variantId) { this.variantId = variantId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getVariantSku() { return variantSku; }
    public void setVariantSku(String variantSku) { this.variantSku = variantSku; }

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

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
