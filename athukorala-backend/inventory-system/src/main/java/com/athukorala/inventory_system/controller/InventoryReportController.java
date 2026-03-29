package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Product;
import com.athukorala.inventory_system.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryReportController {

    private final ProductRepository productRepository;

    @Autowired
    public InventoryReportController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getInventorySummary() {
        List<Product> allProducts = productRepository.findAll();

        // 1. Calculate Total Stock Value (Price * Quantity)
        double totalValue = allProducts.stream()
                .mapToDouble(p -> p.getPrice() * p.getStockQuantity())
                .sum();

        // 2. Count total units across all items
        int totalUnits = allProducts.stream()
                .mapToInt(Product::getStockQuantity)
                .sum();

        // 3. Group valuation by Category
        Map<String, Double> categoryValuation = allProducts.stream()
                .collect(Collectors.groupingBy(
                        Product::getCategory,
                        Collectors.summingDouble(p -> p.getPrice() * p.getStockQuantity())
                ));

        // 4. Group unit counts by Category
        Map<String, Long> categoryUnitCount = allProducts.stream()
                .collect(Collectors.groupingBy(
                        Product::getCategory,
                        Collectors.counting()
                ));

        // Package the payload for the React Frontend
        Map<String, Object> report = new HashMap<>();
        report.put("totalStockValue", totalValue);
        report.put("totalUnitsStored", totalUnits);
        report.put("categoryValuations", categoryValuation);
        report.put("itemsByCategory", categoryUnitCount);
        report.put("timestamp", java.time.LocalDateTime.now());

        return ResponseEntity.ok(report);
    }
}