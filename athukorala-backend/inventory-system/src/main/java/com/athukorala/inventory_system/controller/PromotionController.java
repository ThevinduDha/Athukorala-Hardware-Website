package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Promotion;
import com.athukorala.inventory_system.entity.AuditLog;
import com.athukorala.inventory_system.repository.PromotionRepository;
import com.athukorala.inventory_system.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "http://localhost:5173")
public class PromotionController {

    private final PromotionRepository promotionRepository;
    private final AuditLogRepository auditLogRepository;

    @Autowired
    public PromotionController(PromotionRepository promotionRepository,
                               AuditLogRepository auditLogRepository) {
        this.promotionRepository = promotionRepository;
        this.auditLogRepository = auditLogRepository;
    }

    // --- DEPLOYMENT PROTOCOL: CREATE ---
    @PostMapping("/create")
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        Promotion savedPromotion = promotionRepository.save(promotion);

        // Log the deployment
        logAdministrativeAction("PROMOTION_DEPLOYED",
                "Authorized new protocol: " + promotion.getTitle() + " for " + promotion.getTargetType());

        return new ResponseEntity<>(savedPromotion, HttpStatus.CREATED);
    }

    // --- MODIFICATION PROTOCOL: UPDATE ---
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePromotion(@PathVariable Long id, @RequestBody Promotion details) {
        return promotionRepository.findById(id).map(promo -> {
            promo.setTitle(details.getTitle());
            promo.setDescription(details.getDescription());
            promo.setType(details.getType());
            promo.setValue(details.getValue());
            promo.setStartDate(details.getStartDate());
            promo.setEndDate(details.getEndDate());
            promo.setTargetType(details.getTargetType());
            promo.setTargetId(details.getTargetId());
            promo.setTargetCategory(details.getTargetCategory());
            promo.setEnabled(details.isEnabled());

            Promotion updated = promotionRepository.save(promo);

            // Log the modification
            logAdministrativeAction("PROMOTION_MODIFIED",
                    "Updated protocol ID: " + id + " [" + updated.getTitle() + "]");

            return ResponseEntity.ok(updated);
        }).orElseGet(() -> {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        });
    }

    // --- RETRIEVAL PROTOCOLS ---
    @GetMapping("/all")
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        return ResponseEntity.ok(promotionRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable Long id) {
        return promotionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- TERMINATION PROTOCOL: DELETE ---
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromotion(@PathVariable Long id) {
        return promotionRepository.findById(id).map(promo -> {
            promotionRepository.deleteById(id);
            logAdministrativeAction("PROMOTION_PURGED", "Terminated protocol ID: " + id);
            return ResponseEntity.ok().body(Map.of("message", "PROTOCOL TERMINATED SUCCESSFULLY"));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Internal Security Logging helper
     */
    private void logAdministrativeAction(String action, String details) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setPerformedBy("ADMIN");
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }
}