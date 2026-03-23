package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Product;
import com.athukorala.inventory_system.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductRepository productRepository;

    @Autowired
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // --- ADDED MISSING ENDPOINT FOR DASHBOARD ---
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found in registry"));
    }

    @GetMapping("/low-stock")
    public List<Product> getLowStockProducts() {
        return productRepository.findAll().stream()
                .filter(product -> {
                    Integer stock = product.getStockQuantity();
                    return stock != null && stock <= product.getReorderLevel();
                })
                .collect(Collectors.toList());
    }
    @PatchMapping("/{id}/adjust-stock")
    public Product adjustStock(@PathVariable Long id, @RequestBody java.util.Map<String, Integer> adjustment) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        int amount = adjustment.get("amount");
        product.setStockQuantity(product.getStockQuantity() + amount);

        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }
}