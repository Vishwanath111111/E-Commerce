package com.vastrada.dto;

import com.vastrada.entity.Cart;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CartDTO {
    private Long id;
    private List<CartItemDTO> items = new ArrayList<>();
    private Integer totalItems = 0;
    private BigDecimal subtotal = BigDecimal.ZERO;
    private BigDecimal deliveryFee = BigDecimal.ZERO;
    private BigDecimal grandTotal = BigDecimal.ZERO;

    public CartDTO() {}

    public CartDTO(Cart cart) {
        if (cart != null) {
            this.id = cart.getId();
            if (cart.getItems() != null && !cart.getItems().isEmpty()) {
                this.items = cart.getItems().stream()
                        .map(CartItemDTO::new)
                        .collect(Collectors.toList());
                
                this.totalItems = this.items.stream()
                        .mapToInt(CartItemDTO::getQuantity)
                        .sum();

                this.subtotal = this.items.stream()
                        .map(CartItemDTO::getTotalPrice)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Delivery charge: Free above ₹1999, otherwise ₹150
                if (this.subtotal.compareTo(new BigDecimal("1999")) >= 0 || this.totalItems == 0) {
                    this.deliveryFee = BigDecimal.ZERO;
                } else {
                    this.deliveryFee = new BigDecimal("150.00");
                }

                this.grandTotal = this.subtotal.add(this.deliveryFee);
            }
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<CartItemDTO> getItems() { return items; }
    public void setItems(List<CartItemDTO> items) { this.items = items; }

    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }

    public BigDecimal getGrandTotal() { return grandTotal; }
    public void setGrandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; }
}
