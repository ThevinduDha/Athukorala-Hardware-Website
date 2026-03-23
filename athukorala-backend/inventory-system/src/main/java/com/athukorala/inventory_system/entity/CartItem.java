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
    private User user; // Links to the customer [cite: 823]

    @ManyToOne
    private Product product; // Links to the hardware asset [cite: 824]

    private int quantity; // Must be > 0 and <= available stock [cite: 713, 714]
}