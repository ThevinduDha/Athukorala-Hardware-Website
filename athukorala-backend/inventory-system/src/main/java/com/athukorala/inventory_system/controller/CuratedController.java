package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.CuratedItem;
import com.athukorala.inventory_system.entity.Product;
import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.repository.CuratedItemRepository;
import com.athukorala.inventory_system.repository.ProductRepository;
import com.athukorala.inventory_system.repository.UserRepository;
import com.athukorala.inventory_system.service.PromotionService; // IMPORTED
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/curated")
@CrossOrigin(origins = "http://localhost:5173")
public class CuratedController {

    private final CuratedItemRepository curatedRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PromotionService promotionService; // ADDED SERVICE

    @Autowired
    public CuratedController(CuratedItemRepository curatedRepository,
                             UserRepository userRepository,
                             ProductRepository productRepository,
                             PromotionService promotionService) { // INJECTED SERVICE
        this.curatedRepository = curatedRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.promotionService = promotionService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCurated(@RequestParam Long userId, @RequestParam Long productId) {
        boolean alreadyCurated = curatedRepository.existsByUserIdAndProductId(userId, productId);

        if (alreadyCurated) {
            return ResponseEntity.badRequest().body("Asset already exists in user's curated registry.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CuratedItem item = new CuratedItem();
        item.setUser(user);
        item.setProduct(product);
        curatedRepository.save(item);

        return ResponseEntity.ok("Asset Curated Successfully");
    }

    @GetMapping("/user/{userId}")
    public List<CuratedItem> getCuratedList(@PathVariable Long userId) {
        List<CuratedItem> items = curatedRepository.findByUserId(userId);

        // --- BUG FIX: DYNAMIC PROMOTION SYNC ---
        // We loop through each curated item and calculate the real-time discount for the attached product
        items.forEach(item -> {
            if (item.getProduct() != null) {
                double discountedPrice = promotionService.calculateDiscountedPrice(item.getProduct());
                item.getProduct().setDiscountedPrice(discountedPrice);
            }
        });

        return items;
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id) {
        if (curatedRepository.existsById(id)) {
            curatedRepository.deleteById(id);
            return ResponseEntity.ok("Asset Removed from Curated List");
        }
        return ResponseEntity.status(404).body("Asset not found in registry");
    }

    @DeleteMapping("/remove-link")
    public ResponseEntity<?> removeLink(@RequestParam Long userId, @RequestParam Long productId) {
        List<CuratedItem> items = curatedRepository.findByUserId(userId);
        CuratedItem target = items.stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (target != null) {
            curatedRepository.deleteById(target.getId());
            return ResponseEntity.ok("Link severed successfully");
        }
        return ResponseEntity.status(404).body("No such link found");
    }
}