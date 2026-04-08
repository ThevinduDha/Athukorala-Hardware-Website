package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.dto.SupplierLinkRequest;
import com.athukorala.inventory_system.entity.ProductSupplier;
import com.athukorala.inventory_system.entity.Supplier;
import com.athukorala.inventory_system.service.SupplierManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:5173")
public class SupplierController {

    private final SupplierManagementService supplierManagementService;

    @Autowired
    public SupplierController(SupplierManagementService supplierManagementService) {
        this.supplierManagementService = supplierManagementService;
    }

    @PostMapping
    public ResponseEntity<?> addSupplier(@RequestBody Supplier supplier) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(supplierManagementService.createSupplier(supplier));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierManagementService.getAllSuppliers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSupplier(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(supplierManagementService.getSupplier(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/by-product/{productId}")
    public List<ProductSupplier> getSuppliersByProduct(@PathVariable Long productId) {
        return supplierManagementService.getSuppliersByProduct(productId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id, @RequestBody Supplier data) {
        try {
            return ResponseEntity.ok(supplierManagementService.updateSupplier(id, data));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/link")
    public ResponseEntity<?> linkSupplierToProduct(@RequestBody SupplierLinkRequest request) {
        try {
            return ResponseEntity.ok(supplierManagementService.linkSupplierToProduct(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/unlink")
    public ResponseEntity<?> unlinkSupplierFromProduct(@RequestParam Long productId, @RequestParam Long supplierId) {
        try {
            supplierManagementService.unlinkSupplierFromProduct(productId, supplierId);
            return ResponseEntity.ok(Map.of("message", "Supplier unlinked from product successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        try {
            supplierManagementService.deleteSupplier(id);
            return ResponseEntity.ok(Map.of("message", "Supplier deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
