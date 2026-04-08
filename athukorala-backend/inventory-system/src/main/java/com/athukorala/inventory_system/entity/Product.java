package com.athukorala.inventory_system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private Double price;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer stockQuantity;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    @Min(value = 0, message = "Reorder level cannot be negative")
    private int reorderLevel;

    @Min(value = 0, message = "Reorder quantity cannot be negative")
    private Integer reorderQty;

    // --- CRITICAL SYNC FIELD ---
    @Transient
    private Double discountedPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    @JsonIgnore
    private Supplier supplier;
}