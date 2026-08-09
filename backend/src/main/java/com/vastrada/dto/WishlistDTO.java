package com.vastrada.dto;

import com.vastrada.entity.Wishlist;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class WishlistDTO {
    private Long id;
    private List<WishlistItemDTO> items = new ArrayList<>();

    public WishlistDTO() {}

    public WishlistDTO(Wishlist wishlist) {
        if (wishlist != null) {
            this.id = wishlist.getId();
            if (wishlist.getItems() != null) {
                this.items = wishlist.getItems().stream()
                        .map(WishlistItemDTO::new)
                        .collect(Collectors.toList());
            }
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<WishlistItemDTO> getItems() { return items; }
    public void setItems(List<WishlistItemDTO> items) { this.items = items; }
}
