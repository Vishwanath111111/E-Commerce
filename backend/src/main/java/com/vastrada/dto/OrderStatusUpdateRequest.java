package com.vastrada.dto;

import com.vastrada.entity.Order;
import jakarta.validation.constraints.NotNull;

public class OrderStatusUpdateRequest {

    @NotNull(message = "Order status is required")
    private Order.OrderStatus status;

    private String trackingNumber;

    public OrderStatusUpdateRequest() {}

    public OrderStatusUpdateRequest(Order.OrderStatus status, String trackingNumber) {
        this.status = status;
        this.trackingNumber = trackingNumber;
    }

    public Order.OrderStatus getStatus() { return status; }
    public void setStatus(Order.OrderStatus status) { this.status = status; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
}
