package com.vastrada.controller;

import com.vastrada.dto.ApiResponse;
import com.vastrada.dto.CheckoutRequest;
import com.vastrada.dto.OrderDTO;
import com.vastrada.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderDTO>> placeOrder(@Valid @RequestBody CheckoutRequest request) {
        OrderDTO order = orderService.placeOrder(request);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getCustomerOrders() {
        List<OrderDTO> orders = orderService.getCustomerOrders();
        return ResponseEntity.ok(ApiResponse.success("Customer orders retrieved", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderDetails(@PathVariable Long id) {
        OrderDTO order = orderService.getOrderDetails(id);
        return ResponseEntity.ok(ApiResponse.success("Order details retrieved", order));
    }

    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderDTO>> trackOrderByNumber(@PathVariable String orderNumber) {
        OrderDTO order = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success("Order status retrieved", order));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderDTO>> cancelOrder(@PathVariable Long id) {
        OrderDTO order = orderService.cancelOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", order));
    }
}
