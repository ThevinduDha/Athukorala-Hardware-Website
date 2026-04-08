package com.athukorala.inventory_system.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Data
public class StockMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "supplier"})
    private Product product;

    @Column(nullable = false, length = 20)
    private String movementType; // IN / OUT / ADJUST

    @Column(nullable = false)
    private Integer quantity;

    private String reason;

    @Column(columnDefinition = "TEXT")
    private String note;

    private Integer stockBefore;

    private Integer stockAfter;

    private String referenceCode;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
