package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Order;
import com.athukorala.inventory_system.repository.OrderRepository;
import com.athukorala.inventory_system.service.OrderService;
import com.athukorala.inventory_system.service.PayHereService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final PayHereService payHereService;

    @Autowired
    public OrderController(OrderService orderService,
                           OrderRepository orderRepository,
                           PayHereService payHereService) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
        this.payHereService = payHereService;
    }

    // 🔥 UPDATED CHECKOUT
    @PostMapping("/checkout")
    public ResponseEntity<?> processCheckout(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            String address = payload.get("address").toString();
            String phone = payload.get("phone").toString();
            Double total = Double.valueOf(payload.get("total").toString());

            // Create order
            Order order = orderService.finalizeOrder(userId, address, phone, total);

            // 🔥 IMPORTANT: use correct field name
            String amount = String.valueOf(order.getTotalAmount());

            // Generate hash
            String hash = payHereService.generateHash(
                    order.getId().toString(),
                    amount,
                    "LKR"
            );

            // Response
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.getId());
            response.put("hash", hash);
            response.put("amount", amount);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Internal Protocol Error"));
        }
    }

    // KEEP YOUR EXISTING METHODS

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable Long userId) {
        return orderService.getOrdersByUserId(userId);
    }

    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/history/{userId}")
    public List<Order> getOrderHistory(@PathVariable Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @PatchMapping("/update-status/{id}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status.toUpperCase());
            Order updatedOrder = orderRepository.save(order);
            return ResponseEntity.ok(updatedOrder);
        }).orElse(ResponseEntity.notFound().build());
    }
}