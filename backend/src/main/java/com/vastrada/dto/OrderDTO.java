package com.vastrada.dto;

import com.vastrada.entity.Order;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class OrderDTO {
    private Long id;
    private String orderNumber;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private String paymentMethod;
    private Order.PaymentStatus paymentStatus;
    private String shippingAddress;
    private String trackingNumber;
    private String customerNotes;
    private List<OrderItemDTO> items = new ArrayList<>();
    private ZonedDateTime createdAt;

    public OrderDTO() {}

    public OrderDTO(Order order) {
        if (order != null) {
            this.id = order.getId();
            this.orderNumber = order.getOrderNumber();
            if (order.getUser() != null) {
                this.userId = order.getUser().getId();
                this.customerName = order.getUser().getFullName();
                this.customerEmail = order.getUser().getEmail();
            }
            this.subtotal = order.getSubtotal();
            this.taxAmount = order.getTaxAmount();
            this.shippingFee = order.getShippingFee();
            this.discountAmount = order.getDiscountAmount();
            this.totalAmount = order.getTotalAmount();
            this.status = order.getStatus();
            this.paymentMethod = order.getPaymentMethod();
            this.paymentStatus = order.getPaymentStatus();
            this.shippingAddress = order.getShippingAddress();
            this.trackingNumber = order.getTrackingNumber();
            this.customerNotes = order.getCustomerNotes();
            if (order.getItems() != null) {
                this.items = order.getItems().stream()
                        .map(OrderItemDTO::new)
                        .collect(Collectors.toList());
            }
            this.createdAt = order.getCreatedAt();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public BigDecimal getShippingFee() { return shippingFee; }
    public void setShippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public Order.OrderStatus getStatus() { return status; }
    public void setStatus(Order.OrderStatus status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Order.PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(Order.PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getCustomerNotes() { return customerNotes; }
    public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }

    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}
