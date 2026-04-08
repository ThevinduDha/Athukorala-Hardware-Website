package com.athukorala.inventory_system.dto;

import lombok.Data;

@Data
public class SupplierLinkRequest {
    private Long productId;
    private Long supplierId;
    private Double supplierPrice;
}
