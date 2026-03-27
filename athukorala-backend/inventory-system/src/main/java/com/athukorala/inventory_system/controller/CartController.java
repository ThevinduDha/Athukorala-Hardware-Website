package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.dto.CartRequest;
import com.athukorala.inventory_system.entity.CartItem;
import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.entity.Product;
import com.athukorala.inventory_system.repository.CartItemRepository;
import com.athukorala.inventory_system.repository.UserRepository;
import com.athukorala.inventory_system.repository.ProductRepository;
import com.athukorala.inventory_system.service.PromotionService; // Added
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartItemRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PromotionService promotionService; // Added

    @Autowired
    public CartController(CartItemRepository cartRepository,
                          UserRepository userRepository,
                          ProductRepository productRepository,
                          PromotionService promotionService) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.promotionService = promotionService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStockQuantity() < request.getQuantity()) {
            return ResponseEntity.badRequest().body("Inadequate stock for this asset.");
        }

        // --- PROTOCOL SYNC: CALCULATE PRICE AT TIME OF ENTRY ---
        Double protocolPrice = promotionService.calculateDiscountedPrice(product);

        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setQuantity(request.getQuantity());
        cartItem.setAppliedPrice(protocolPrice); // Sync with Promotion Engine

        cartRepository.save(cartItem);
        return ResponseEntity.ok("Asset successfully registered in cart at protocol price: " + protocolPrice);
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCartByUserIdDirect(@PathVariable Long userId) {
        return cartRepository.findByUserId(userId);
    }

    @GetMapping("/user/{userId}")
    public List<CartItem> getCartByUserId(@PathVariable Long userId) {
        List<CartItem> items = cartRepository.findByUserId(userId);
        // Sync discountedPrice field for the UI before sending
        items.forEach(item -> {
            if(item.getProduct() != null) {
                item.getProduct().setDiscountedPrice(promotionService.calculateDiscountedPrice(item.getProduct()));
            }
        });
        return items;
    }

    @PatchMapping("/update-quantity/{id}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long id, @RequestParam int quantity) {
        CartItem item = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        if (item.getProduct() != null && item.getProduct().getStockQuantity() < quantity) {
            return ResponseEntity.badRequest().body("INSUFFICIENT WAREHOUSE STOCK");
        }

        item.setQuantity(quantity);
        cartRepository.save(item);
        return ResponseEntity.ok("Registry Updated");
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id) {
        try {
            if (cartRepository.existsById(id)) {
                cartRepository.deleteById(id);
                return ResponseEntity.ok("Asset removed from registry.");
            } else {
                return ResponseEntity.status(404).body("Asset not found in registry.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Registry Error.");
        }
    }
}