package com.vastrada.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class DashboardStatsDTO {
    private BigDecimal totalSales;
    private Long totalOrders;
    private Long totalCustomers;
    private Long totalProducts;
    private Long lowStockProductsCount;
    private Long pendingOrdersCount;
    private List<OrderDTO> recentOrders = new ArrayList<>();
    private List<ProductDTO> bestSellingProducts = new ArrayList<>();

    public DashboardStatsDTO() {}

    public BigDecimal getTotalSales() { return totalSales; }
    public void setTotalSales(BigDecimal totalSales) { this.totalSales = totalSales; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public Long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; }

    public Long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }

    public Long getLowStockProductsCount() { return lowStockProductsCount; }
    public void setLowStockProductsCount(Long lowStockProductsCount) { this.lowStockProductsCount = lowStockProductsCount; }

    public Long getPendingOrdersCount() { return pendingOrdersCount; }
    public void setPendingOrdersCount(Long pendingOrdersCount) { this.pendingOrdersCount = pendingOrdersCount; }

    public List<OrderDTO> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderDTO> recentOrders) { this.recentOrders = recentOrders; }

    public List<ProductDTO> getBestSellingProducts() { return bestSellingProducts; }
    public void setBestSellingProducts(List<ProductDTO> bestSellingProducts) { this.bestSellingProducts = bestSellingProducts; }
}
