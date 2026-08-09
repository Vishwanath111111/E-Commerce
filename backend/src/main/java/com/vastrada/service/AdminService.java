package com.vastrada.service;

import com.vastrada.dto.DashboardStatsDTO;
import com.vastrada.dto.OrderDTO;
import com.vastrada.dto.ProductDTO;
import com.vastrada.dto.UserDTO;
import com.vastrada.entity.Role;
import com.vastrada.entity.User;
import com.vastrada.exception.ResourceNotFoundException;
import com.vastrada.repository.InventoryRepository;
import com.vastrada.repository.OrderRepository;
import com.vastrada.repository.ProductRepository;
import com.vastrada.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        BigDecimal totalSales = orderRepository.calculateTotalRevenue();
        stats.setTotalSales(totalSales != null ? totalSales : BigDecimal.ZERO);

        stats.setTotalOrders(orderRepository.count());
        stats.setTotalCustomers(userRepository.count());
        stats.setTotalProducts(productRepository.count());

        long lowStockCount = inventoryRepository.findLowStockItems().size();
        stats.setLowStockProductsCount(lowStockCount);

        Long pendingOrders = orderRepository.countPendingOrders();
        stats.setPendingOrdersCount(pendingOrders != null ? pendingOrders : 0L);

        List<OrderDTO> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(OrderDTO::new)
                .collect(Collectors.toList());
        stats.setRecentOrders(recentOrders);

        List<ProductDTO> bestSellers = productRepository.findByIsBestSellerTrueAndIsActiveTrue().stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
        stats.setBestSellingProducts(bestSellers);

        return stats;
    }

    public Page<UserDTO> getAllCustomers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable).map(UserDTO::new);
    }

    public UserDTO getCustomerById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        return new UserDTO(user);
    }
}
