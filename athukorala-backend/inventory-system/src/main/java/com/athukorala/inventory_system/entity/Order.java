package com.athukorala.inventory_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Double totalAmount;
    private String shippingAddress;
    private String contactNumber;
    private String status; // e.g., "PENDING", "DISPATCHED"
    private LocalDateTime orderDate;
}