package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Supplier;
import com.athukorala.inventory_system.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:5173")
public class SupplierController {

    private final SupplierRepository supplierRepository;

    @Autowired
    public SupplierController(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @GetMapping("/all")
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @PostMapping("/add")
    public Supplier addSupplier(@RequestBody Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    // --- UPDATED: FIXES THE INCOMPATIBLE TYPES ERROR ---
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id, @RequestBody Supplier data) {
        Optional<Supplier> supplierOptional = supplierRepository.findById(id);

        if (supplierOptional.isPresent()) {
            Supplier s = supplierOptional.get();
            s.setName(data.getName());
            s.setContactPerson(data.getContactPerson());
            s.setEmail(data.getEmail());
            s.setPhoneNumber(data.getPhoneNumber());
            s.setCategory(data.getCategory());

            Supplier updated = supplierRepository.save(s);
            return ResponseEntity.ok(updated);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Supplier Not Found in Master Registry");
            return ResponseEntity.status(404).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("message", "Supplier Not Found"));
        }
        supplierRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Supplier Purged Successfully"));
    }
}