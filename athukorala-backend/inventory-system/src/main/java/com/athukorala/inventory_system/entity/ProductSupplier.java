package com.athukorala.inventory_system.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "product_supplier",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"product_id", "supplier_id"})
        }
)
@Data
public class ProductSupplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "supplier"})
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "products"})
    private Supplier supplier;

    private Double supplierPrice;

    private LocalDateTime linkedAt;

    @PrePersist
    public void prePersist() {
        if (linkedAt == null) {
            linkedAt = LocalDateTime.now();
        }
    }
}
