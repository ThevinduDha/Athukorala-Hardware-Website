package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.dto.*;
import com.athukorala.inventory_system.entity.Product;
import com.athukorala.inventory_system.entity.StockMovement;
import com.athukorala.inventory_system.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryCrudController {

    private final InventoryService inventoryService;

    @Autowired
    public InventoryCrudController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/stock-in")
    public ResponseEntity<?> stockIn(@RequestBody StockInRequest request) {
        return handleProductResponse(() -> inventoryService.stockIn(request), HttpStatus.CREATED, "Stock added successfully");
    }

    @GetMapping
    public List<Product> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    @GetMapping("/{productId}")
    public ResponseEntity<?> getInventoryByProductId(@PathVariable Long productId) {
        try {
            return ResponseEntity.ok(inventoryService.getInventoryByProductId(productId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{productId}/movements")
    public List<StockMovement> getMovementHistory(@PathVariable Long productId) {
        return inventoryService.getMovementHistory(productId);
    }

    @GetMapping("/low-stock")
    public List<Product> getLowStockItems() {
        return inventoryService.getLowStockItems();
    }

    @GetMapping("/reorder-list")
    public List<Product> getReorderList() {
        return inventoryService.getReorderList();
    }

    @PostMapping("/stock-out")
    public ResponseEntity<?> stockOut(@RequestBody StockOutRequest request) {
        return handleProductResponse(() -> inventoryService.stockOut(request), HttpStatus.OK, "Stock reduced successfully");
    }

    @PostMapping("/adjust")
    public ResponseEntity<?> adjustStock(@RequestBody AdjustStockRequest request) {
        return handleProductResponse(() -> inventoryService.adjustStock(request), HttpStatus.OK, "Stock adjusted successfully");
    }

    @PutMapping("/{productId}/reorder")
    public ResponseEntity<?> updateReorderSettings(@PathVariable Long productId, @RequestBody ReorderSettingsRequest request) {
        return handleProductResponse(() -> inventoryService.updateReorderSettings(productId, request), HttpStatus.OK, "Reorder settings updated");
    }

    @PostMapping("/deduct")
    public ResponseEntity<?> deduct(@RequestBody InventoryQuantityRequest request) {
        return handleProductResponse(() -> inventoryService.deductFromOrder(request), HttpStatus.OK, "Stock deducted after order confirmation");
    }

    @PostMapping("/restore")
    public ResponseEntity<?> restore(@RequestBody InventoryQuantityRequest request) {
        return handleProductResponse(() -> inventoryService.restoreStock(request), HttpStatus.OK, "Stock restored successfully");
    }

    @DeleteMapping("/movements/{movementId}")
    public ResponseEntity<?> deleteMovement(@PathVariable Long movementId) {
        try {
            inventoryService.deleteMovementAndRevert(movementId);
            return ResponseEntity.ok(Map.of("message", "Stock movement deleted and stock reverted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private ResponseEntity<?> handleProductResponse(ProductSupplierAction action, HttpStatus status, String message) {
        try {
            Product product = action.execute();
            Map<String, Object> response = new HashMap<>();
            response.put("message", message);
            response.put("product", product);
            return ResponseEntity.status(status).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @FunctionalInterface
    private interface ProductSupplierAction {
        Product execute();
    }
}
