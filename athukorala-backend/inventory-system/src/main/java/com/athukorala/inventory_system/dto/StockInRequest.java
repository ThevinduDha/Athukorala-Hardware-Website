package com.athukorala.inventory_system.dto;

import lombok.Data;

@Data
public class StockInRequest {
    private Long productId;
    private Integer quantity;
    private String note;
    private String referenceCode;
}
