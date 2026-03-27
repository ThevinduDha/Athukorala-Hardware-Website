package com.athukorala.inventory_system.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;

    // --- NEW: STORES THE ACTUAL PRICE AT TIME OF ADDING ---
    private Double appliedPrice;
}