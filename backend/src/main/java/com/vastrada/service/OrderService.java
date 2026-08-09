package com.vastrada.service;

import com.vastrada.dto.CheckoutRequest;
import com.vastrada.dto.OrderDTO;
import com.vastrada.dto.OrderStatusUpdateRequest;
import com.vastrada.entity.*;
import com.vastrada.exception.BadRequestException;
import com.vastrada.exception.ResourceNotFoundException;
import com.vastrada.repository.AddressRepository;
import com.vastrada.repository.OrderItemRepository;
import com.vastrada.repository.OrderRepository;
import com.vastrada.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private CartService cartService;

    @Autowired
    private InventoryService inventoryService;

    @Transactional
    public OrderDTO placeOrder(CheckoutRequest request) {
        User currentUser = authService.getCurrentUser();
        Cart cart = cartService.getOrCreateCartForUser(currentUser);

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty. Add products to place an order.");
        }

        // Format shipping address string
        String formattedAddress;
        if (request.getAddressId() != null) {
            Address address = addressRepository.findById(request.getAddressId())
                    .orElseThrow(() -> new ResourceNotFoundException("Address not found: " + request.getAddressId()));
            formattedAddress = String.format("%s, %s, %s, %s - %s, %s. Phone: %s",
                    address.getFullName(),
                    address.getAddressLine1(),
                    address.getAddressLine2() != null ? address.getAddressLine2() : "",
                    address.getCity(),
                    address.getPostalCode(),
                    address.getState(),
                    address.getPhone());
        } else {
            formattedAddress = String.format("%s, %s, %s, %s - %s, %s. Phone: %s",
                    request.getFullName(),
                    request.getAddressLine1(),
                    request.getAddressLine2() != null ? request.getAddressLine2() : "",
                    request.getCity(),
                    request.getPostalCode(),
                    request.getState(),
                    request.getPhone());
        }

        // Calculate Subtotal authoritatively
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getItems()) {
            BigDecimal lineTotal = cartItem.getUnitPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(lineTotal);
        }

        // Calculate Tax (5% GST for fashion apparel)
        BigDecimal taxAmount = subtotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);

        // Calculate Shipping Fee (Free above ₹1999)
        BigDecimal shippingFee = subtotal.compareTo(new BigDecimal("1999.00")) >= 0 ? BigDecimal.ZERO : new BigDecimal("150.00");

        BigDecimal totalAmount = subtotal.add(taxAmount).add(shippingFee);

        // Generate Order Number
        String orderNumber = "VST-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" +
                UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(currentUser);
        order.setSubtotal(subtotal);
        order.setTaxAmount(taxAmount);
        order.setShippingFee(shippingFee);
        order.setTotalAmount(totalAmount);
        order.setShippingAddress(formattedAddress);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setCustomerNotes(request.getCustomerNotes());
        order.setStatus(Order.OrderStatus.CONFIRMED);

        if ("COD".equalsIgnoreCase(request.getPaymentMethod())) {
            order.setPaymentStatus(Order.PaymentStatus.PENDING);
        } else {
            order.setPaymentStatus(Order.PaymentStatus.COMPLETED);
        }

        Order savedOrder = orderRepository.save(order);

        // Process items & deduct stock
        for (CartItem cartItem : cart.getItems()) {
            ProductVariant variant = cartItem.getVariant();

            inventoryService.deductStockForOrder(variant.getId(), cartItem.getQuantity());

            OrderItem orderItem = new OrderItem(
                    savedOrder,
                    variant,
                    variant.getProduct() != null ? variant.getProduct().getName() : "VASTRADA Product",
                    variant.getSku(),
                    variant.getSize(),
                    variant.getColor(),
                    cartItem.getQuantity(),
                    cartItem.getUnitPrice()
            );

            savedOrder.getItems().add(orderItem);
            orderItemRepository.save(orderItem);
        }

        // Save Payment record
        Payment payment = new Payment(
                savedOrder,
                "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                request.getPaymentMethod(),
                savedOrder.getPaymentStatus().name(),
                totalAmount
        );
        paymentRepository.save(payment);
        savedOrder.setPayment(payment);

        // Clear user cart
        cartService.clearCart(cart);

        return new OrderDTO(orderRepository.save(savedOrder));
    }

    public List<OrderDTO> getCustomerOrders() {
        User currentUser = authService.getCurrentUser();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId()).stream()
                .map(OrderDTO::new)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderDetails(Long orderId) {
        User currentUser = authService.getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (!order.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new BadRequestException("Unauthorized access to order");
        }

        return new OrderDTO(order);
    }

    public OrderDTO getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with order number: " + orderNumber));
        return new OrderDTO(order);
    }

    @Transactional
    public OrderDTO cancelOrder(Long orderId) {
        User currentUser = authService.getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (!order.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new BadRequestException("Unauthorized access to order");
        }

        if (order.getStatus() == Order.OrderStatus.DELIVERED || order.getStatus() == Order.OrderStatus.SHIPPED || order.getStatus() == Order.OrderStatus.OUT_FOR_DELIVERY) {
            throw new BadRequestException("Order cannot be cancelled as it is already " + order.getStatus());
        }

        order.setStatus(Order.OrderStatus.CANCELLED);

        // Restore inventory stock
        for (OrderItem item : order.getItems()) {
            if (item.getVariant() != null) {
                inventoryService.restoreStockForCancelledOrder(item.getVariant().getId(), item.getQuantity());
            }
        }

        return new OrderDTO(orderRepository.save(order));
    }

    // ADMIN ORDER MANAGEMENT
    public Page<OrderDTO> getAllOrdersAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable).map(OrderDTO::new);
    }

    @Transactional
    public OrderDTO updateOrderStatusAdmin(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        order.setStatus(request.getStatus());

        if (request.getTrackingNumber() != null && !request.getTrackingNumber().trim().isEmpty()) {
            order.setTrackingNumber(request.getTrackingNumber());
        }

        if (request.getStatus() == Order.OrderStatus.DELIVERED) {
            order.setPaymentStatus(Order.PaymentStatus.COMPLETED);
        } else if (request.getStatus() == Order.OrderStatus.CANCELLED) {
            for (OrderItem item : order.getItems()) {
                if (item.getVariant() != null) {
                    inventoryService.restoreStockForCancelledOrder(item.getVariant().getId(), item.getQuantity());
                }
            }
        }

        return new OrderDTO(orderRepository.save(order));
    }
}
