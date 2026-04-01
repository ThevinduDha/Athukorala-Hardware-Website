package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Order;
import com.athukorala.inventory_system.repository.OrderRepository;
import com.athukorala.inventory_system.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @Autowired
    public OrderController(OrderService orderService, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> processCheckout(@RequestBody Map<String, Object> payload) {
        try {
            // Robust parsing of payload to prevent ClassCastExceptions
            Long userId = Long.valueOf(payload.get("userId").toString());
            String address = payload.get("address").toString();
            String phone = payload.get("phone").toString();
            Double total = Double.valueOf(payload.get("total").toString());

            Order order = orderService.finalizeOrder(userId, address, phone, total);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            // This returns the "Inventory Shortage" or "Cart Empty" message to React
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Internal Protocol Error"));
        }
    }

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