package com.athukorala.inventory_system.dto;

import lombok.Data;

@Data
public class InventoryQuantityRequest {
    private Long productId;
    private Integer quantity;
    private String reason;
    private String note;
    private String referenceCode;
}
