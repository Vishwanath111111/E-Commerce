package com.vastrada.controller;

import com.vastrada.dto.*;
import com.vastrada.entity.Inventory;
import com.vastrada.entity.Review;
import com.vastrada.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ReviewService reviewService;

    // DASHBOARD & ANALYTICS
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        DashboardStatsDTO stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }

    // PRODUCT MANAGEMENT
    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(@Valid @RequestBody ProductDTO dto) {
        ProductDTO product = productService.createProduct(dto);
        return ResponseEntity.ok(ApiResponse.success("Product created successfully", product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(@PathVariable Long id, @RequestBody ProductDTO dto) {
        ProductDTO product = productService.updateProduct(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted", null));
    }

    // CATEGORY MANAGEMENT
    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@Valid @RequestBody CategoryDTO dto) {
        CategoryDTO category = categoryService.createCategory(dto);
        return ResponseEntity.ok(ApiResponse.success("Category created", category));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(@PathVariable Long id, @RequestBody CategoryDTO dto) {
        CategoryDTO category = categoryService.updateCategory(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Category updated", category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted", null));
    }

    // INVENTORY MANAGEMENT
    @GetMapping("/inventory")
    public ResponseEntity<ApiResponse<java.util.List<Inventory>>> getAllInventory() {
        return ResponseEntity.ok(ApiResponse.success("Inventory list", inventoryService.getAllInventory()));
    }

    @GetMapping("/inventory/low-stock")
    public ResponseEntity<ApiResponse<java.util.List<Inventory>>> getLowStockInventory() {
        return ResponseEntity.ok(ApiResponse.success("Low stock inventory", inventoryService.getLowStockInventory()));
    }

    @PutMapping("/inventory/{variantId}/stock")
    public ResponseEntity<ApiResponse<Inventory>> updateStock(
            @PathVariable Long variantId,
            @RequestParam int quantity,
            @RequestParam(required = false) Integer lowStockThreshold
    ) {
        Inventory inventory = inventoryService.updateStock(variantId, quantity, lowStockThreshold);
        return ResponseEntity.ok(ApiResponse.success("Inventory updated", inventory));
    }

    // ORDER MANAGEMENT
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<OrderDTO> orders = orderService.getAllOrdersAdmin(page, size);
        return ResponseEntity.ok(ApiResponse.success("Orders list retrieved", orders));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request
    ) {
        OrderDTO order = orderService.updateOrderStatusAdmin(id, request);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", order));
    }

    // CUSTOMER MANAGEMENT
    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<Page<UserDTO>>> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<UserDTO> customers = adminService.getAllCustomers(page, size);
        return ResponseEntity.ok(ApiResponse.success("Customers list retrieved", customers));
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getCustomerById(@PathVariable Long id) {
        UserDTO customer = adminService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success("Customer details", customer));
    }

    // REVIEW MODERATION
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<Page<ReviewDTO>>> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<ReviewDTO> reviews = reviewService.getAllReviewsAdmin(page, size);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", reviews));
    }

    @PatchMapping("/reviews/{id}/status")
    public ResponseEntity<ApiResponse<ReviewDTO>> updateReviewStatus(
            @PathVariable Long id,
            @RequestParam Review.ReviewStatus status
    ) {
        ReviewDTO review = reviewService.updateReviewStatusAdmin(id, status);
        return ResponseEntity.ok(ApiResponse.success("Review status updated", review));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReviewAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted", null));
    }
}
