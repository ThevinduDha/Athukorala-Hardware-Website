package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.dto.InventoryReportDTO;
import com.athukorala.inventory_system.entity.Product;
import com.athukorala.inventory_system.entity.Order; // Added import
import com.athukorala.inventory_system.repository.ProductRepository;
import com.athukorala.inventory_system.repository.OrderRepository; // Added import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // Added import
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory/report")
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository; // Added for Revenue analysis

    @GetMapping("/summary")
    public InventoryReportDTO getSummary() {
        List<Product> products = productRepository.findAll();
        List<Order> orders = orderRepository.findAll(); // Fetch all order logs
        InventoryReportDTO report = new InventoryReportDTO();

        // 1. Total Assets Count
        report.setTotalProductCount(products.size());

        // 2. Total Financial Value (Price * Stock)
        double totalValue = products.stream()
                .mapToDouble(p -> p.getPrice() * p.getStockQuantity())
                .sum();
        report.setTotalInventoryValue(totalValue);

        // 3. Count Low Stock Items
        long lowStock = products.stream()
                .filter(p -> p.getStockQuantity() <= p.getReorderLevel())
                .count();
        report.setLowStockAlertCount(lowStock);

        // 4. Category Breakdown
        report.setCategoryDistribution(
                products.stream().collect(Collectors.groupingBy(Product::getCategory, Collectors.counting()))
        );

        // 5. NEW: Daily Revenue Distribution (Last 7 Days Logic)
        Map<String, Double> dailyRev = orders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().toLocalDate().toString(),
                        Collectors.summingDouble(Order::getTotalAmount)
                ));
        report.setDailyRevenue(dailyRev);

        return report;
    }
}