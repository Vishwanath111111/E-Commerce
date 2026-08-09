package com.vastrada.dto;

import com.vastrada.entity.WishlistItem;
import java.time.ZonedDateTime;

public class WishlistItemDTO {
    private Long id;
    private ProductDTO product;
    private ZonedDateTime createdAt;

    public WishlistItemDTO() {}

    public WishlistItemDTO(WishlistItem item) {
        if (item != null) {
            this.id = item.getId();
            if (item.getProduct() != null) {
                this.product = new ProductDTO(item.getProduct());
            }
            this.createdAt = item.getCreatedAt();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProductDTO getProduct() { return product; }
    public void setProduct(ProductDTO product) { this.product = product; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}
