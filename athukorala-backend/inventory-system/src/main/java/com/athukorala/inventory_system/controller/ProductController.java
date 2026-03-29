package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Product;
import com.athukorala.inventory_system.entity.AuditLog;
import com.athukorala.inventory_system.repository.ProductRepository;
import com.athukorala.inventory_system.repository.AuditLogRepository;
import com.athukorala.inventory_system.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductRepository productRepository;
    private final AuditLogRepository auditLogRepository;
    private final PromotionService promotionService;

    @Autowired
    public ProductController(ProductRepository productRepository,
                             AuditLogRepository auditLogRepository,
                             PromotionService promotionService) {
        this.productRepository = productRepository;
        this.auditLogRepository = auditLogRepository;
        this.promotionService = promotionService;
    }

    // --- UPDATED: FULL UPDATE PROTOCOL ---
    @PutMapping("/update/{id}") // Standardized endpoint for your React Frontend
    @Transactional
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found for update: ID " + id));

        // Registry Data Synchronization
        product.setName(productDetails.getName());
        product.setCategory(productDetails.getCategory());
        product.setPrice(productDetails.getPrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setDescription(productDetails.getDescription());
        product.setImageUrl(productDetails.getImageUrl());

        // Ensure reorder level is maintained or updated
        if(productDetails.getReorderLevel() > 0) {
            product.setReorderLevel(productDetails.getReorderLevel());
        }

        Product updatedProduct = productRepository.save(product);

        // Security Protocol Logging
        AuditLog log = new AuditLog();
        log.setAction("INVENTORY_MODIFICATION");
        log.setPerformedBy("ADMIN");
        log.setDetails("MODIFIED ASSET: " + product.getName() + " [ID: " + id + "]");
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        return ResponseEntity.ok(updatedProduct);
    }

    // --- CREATE PROTOCOL ---
    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        if (product.getReorderLevel() <= 0) {
            product.setReorderLevel(5);
        }
        Product savedProduct = productRepository.save(product);

        AuditLog log = new AuditLog();
        log.setAction("PRODUCT_CREATION");
        log.setPerformedBy("ADMIN");
        log.setDetails("AUTHORIZED NEW ASSET: " + product.getName() + " [CAT: " + product.getCategory() + "]");
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    // --- RETRIEVAL PROTOCOLS ---
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        // Sync Real-time Discount Valuations
        products.forEach(p -> p.setDiscountedPrice(promotionService.calculateDiscountedPrice(p)));
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset ID " + id + " not found in registry"));
        product.setDiscountedPrice(promotionService.calculateDiscountedPrice(product));
        return ResponseEntity.ok(product);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        List<Product> lowStock = productRepository.findAll().stream()
                .filter(product -> product.getStockQuantity() != null && product.getStockQuantity() <= product.getReorderLevel())
                .collect(Collectors.toList());
        return ResponseEntity.ok(lowStock);
    }

    @PatchMapping("/{id}/adjust-stock")
    @Transactional
    public ResponseEntity<Product> adjustStock(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Asset not found"));

        int amount = Integer.parseInt(payload.get("amount").toString());
        String adminName = payload.getOrDefault("adminName", "System Admin").toString();

        product.setStockQuantity(product.getStockQuantity() + amount);
        Product savedProduct = productRepository.save(product);

        AuditLog log = new AuditLog();
        log.setAction("STOCK_ADJUSTMENT");
        log.setPerformedBy(adminName);
        log.setDetails("STOCK MODIFIED: " + product.getName() + " | ADJUST: " + amount + " | TOTAL: " + product.getStockQuantity());
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        return ResponseEntity.ok(savedProduct);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Asset not found"));

        AuditLog log = new AuditLog();
        log.setAction("PRODUCT_DELETION");
        log.setPerformedBy("ADMIN");
        log.setDetails("PERMANENT PURGE: " + product.getName() + " [ID: " + id + "]");
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}