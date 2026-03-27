package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Promotion;
import com.athukorala.inventory_system.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "http://localhost:5173")
public class PromotionController {

    @Autowired
    private PromotionRepository promotionRepository;

    @PostMapping("/create")
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        // Business Rule: New promotions default to enabled
        promotion.setEnabled(true);
        Promotion savedPromotion = promotionRepository.save(promotion);
        return ResponseEntity.ok(savedPromotion);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        return ResponseEntity.ok(promotionRepository.findAll());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePromotion(@PathVariable Long id) {
        if (!promotionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        promotionRepository.deleteById(id);
        return ResponseEntity.ok("Protocol Terminated Successfully");
    }
}