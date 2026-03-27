package com.athukorala.inventory_system.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CuratedItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Product product;
}