package com.athukorala.inventory_system.dto;

import lombok.Data;
import java.util.Map;

@Data
public class InventoryReportDTO {
    private long totalProductCount;
    private double totalInventoryValue;
    private long lowStockAlertCount;
    private Map<String, Long> categoryDistribution;
    private Map<String, Double> dailyRevenue;
}