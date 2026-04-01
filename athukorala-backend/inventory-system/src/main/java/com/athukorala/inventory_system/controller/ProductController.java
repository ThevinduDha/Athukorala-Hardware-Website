package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Product;
import com.athukorala.inventory_system.entity.AuditLog;
import com.athukorala.inventory_system.repository.ProductRepository;
import com.athukorala.inventory_system.repository.AuditLogRepository;
import com.athukorala.inventory_system.service.ProductService;
import com.athukorala.inventory_system.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
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
    private final ProductService productService;

    @Autowired
    public ProductController(ProductRepository productRepository,
                             AuditLogRepository auditLogRepository,
                             PromotionService promotionService,
                             ProductService productService) {
        this.productRepository = productRepository;
        this.auditLogRepository = auditLogRepository;
        this.promotionService = promotionService;
        this.productService = productService;
    }

    // --- ADMINISTRATIVE PROTOCOLS: UPDATE ---
    @PutMapping("/update/{id}")
    @Transactional
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found for update: ID " + id));

        product.setName(productDetails.getName());
        product.setCategory(productDetails.getCategory());
        product.setPrice(productDetails.getPrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setDescription(productDetails.getDescription());
        product.setImageUrl(productDetails.getImageUrl());

        if(productDetails.getReorderLevel() > 0) {
            product.setReorderLevel(productDetails.getReorderLevel());
        }

        Product updatedProduct = productRepository.save(product);

        AuditLog log = new AuditLog();
        log.setAction("INVENTORY_MODIFICATION");
        log.setPerformedBy("ADMIN");
        log.setDetails("MODIFIED ASSET: " + product.getName() + " [ID: " + id + "]");
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        return ResponseEntity.ok(updatedProduct);
    }

    // --- ADMINISTRATIVE PROTOCOLS: CREATE ---
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

    // --- OPERATIONAL SYNC: CONSOLIDATED ADJUST STOCK (Audit-Ready) ---
    @PatchMapping("/{id}/adjust-stock")
    @Transactional
    public ResponseEntity<?> adjustStock(
            @PathVariable Long id,
            @RequestParam int delta,
            @RequestParam(defaultValue = "OPERATOR") String staffName) {
        try {
            Product updatedProduct = productService.adjustStock(id, delta);

            AuditLog log = new AuditLog();
            log.setAction("STOCK_SYNC");
            log.setPerformedBy(staffName);

            String adjustmentType = delta > 0 ? "+" : "";
            log.setDetails(String.format("STOCK ADJUSTMENT: %s | DELTA: %s%d | NEW TOTAL: %d",
                    updatedProduct.getName(), adjustmentType, delta, updatedProduct.getStockQuantity()));

            log.setTimestamp(LocalDateTime.now());
            auditLogRepository.save(log);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("newQuantity", updatedProduct.getStockQuantity());
            response.put("message", "REGISTRY SYNCHRONIZED & LOGGED");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // --- ADMINISTRATIVE PROTOCOLS: DELETE (HANDLING CONSTRAINTS) ---
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Asset not found"));

            // Log the attempt before deletion
            AuditLog log = new AuditLog();
            log.setAction("PRODUCT_DELETION");
            log.setPerformedBy("ADMIN");
            log.setDetails("PERMANENT PURGE ATTEMPTED: " + product.getName() + " [ID: " + id + "]");
            log.setTimestamp(LocalDateTime.now());
            auditLogRepository.save(log);

            productRepository.deleteById(id);

            return ResponseEntity.ok().body(Map.of("message", "ASSET PURGED FROM REGISTRY"));

        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // This catches the foreign key error if the product is in an order
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "INTEGRITY ERROR: Product is linked to existing transactions/orders and cannot be purged."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "SYSTEM ERROR: Deletion protocol failed."));
        }
    }

}