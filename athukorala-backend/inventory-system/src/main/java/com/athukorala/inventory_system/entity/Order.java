package com.athukorala.inventory_system.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 USER
    @Column(nullable = false)
    private Long userId;

    // 🔹 TOTAL AMOUNT (IMPORTANT FOR PAYHERE)
    @Column(nullable = false)
    private Double totalAmount;

    // 🔹 SHIPPING
    @Column(nullable = false)
    private String shippingAddress;

    @Column(nullable = false)
    private String contactNumber;

    // 🔹 STATUS (PENDING / PAID / CANCELLED)
    @Column(nullable = false)
    private String status = "PENDING";

    // 🔹 DATE
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(nullable = false)
    private LocalDateTime orderDate = LocalDateTime.now();

    // 🔹 ORDER ITEMS
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    private List<OrderItem> orderItems;
}