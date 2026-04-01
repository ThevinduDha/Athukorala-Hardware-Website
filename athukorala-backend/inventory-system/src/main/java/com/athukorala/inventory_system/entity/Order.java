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

    private Long userId;
    private Double totalAmount; // Field name must match Frontend
    private String shippingAddress;
    private String contactNumber;
    private String status;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") // Ensures JS can parse this
    private LocalDateTime orderDate;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    private List<OrderItem> orderItems;
}