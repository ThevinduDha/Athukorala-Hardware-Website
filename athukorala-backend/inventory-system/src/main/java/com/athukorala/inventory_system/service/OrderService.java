package com.athukorala.inventory_system.service;

import com.athukorala.inventory_system.entity.*;
import com.athukorala.inventory_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private CartItemRepository cartRepository;

    @Transactional
    public Order finalizeOrder(Long userId, String address, String phone, Double total) {

        // 🔥 GET CART ITEMS
        List<CartItem> cartItems = cartRepository.findByUserId(userId);

        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty. Please add items before checkout.");
        }

        // 🔥 CREATE ORDER ITEMS (NO STOCK CHANGE HERE)
        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {

            Product product = cartItem.getProduct();

            if (product == null) {
                throw new RuntimeException("Product missing in cart");
            }

            // CHECK STOCK ONLY (DO NOT REDUCE)
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(cartItem.getQuantity());

            // 🔥 USE DISCOUNTED PRICE
            orderItem.setPrice(cartItem.getAppliedPrice());

            return orderItem;

        }).collect(Collectors.toList());

        // 🔥 CALCULATE TOTAL FROM CART (NOT FROM FRONTEND)
        double calculatedTotal = cartItems.stream()
                .mapToDouble(item -> item.getAppliedPrice() * item.getQuantity())
                .sum();

        // 🔥 CREATE ORDER (PENDING)
        Order order = new Order();
        order.setUserId(userId);
        order.setShippingAddress(address);
        order.setContactNumber(phone);
        order.setTotalAmount(calculatedTotal);
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());
        order.setOrderItems(orderItems);

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus.toUpperCase());
        return orderRepository.save(order);
    }
}