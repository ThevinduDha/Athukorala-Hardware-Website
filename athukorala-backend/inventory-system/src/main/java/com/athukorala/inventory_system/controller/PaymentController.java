package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Order;
import com.athukorala.inventory_system.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final OrderRepository orderRepository;

    @Autowired
    public PaymentController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping("/notify")
    public String handlePayment(HttpServletRequest request) {

        String orderId = request.getParameter("order_id");
        String status = request.getParameter("status_code");

        try {
            if ("2".equals(status)) { // SUCCESS
                Order order = orderRepository.findById(Long.parseLong(orderId)).orElse(null);

                if (order != null) {
                    order.setStatus("PAID");
                    orderRepository.save(order);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "OK";
    }
}