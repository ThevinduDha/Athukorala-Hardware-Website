package com.athukorala.inventory_system.service;

import com.athukorala.inventory_system.dto.*;
import com.athukorala.inventory_system.entity.Product;
import com.athukorala.inventory_system.entity.StockMovement;
import com.athukorala.inventory_system.repository.ProductRepository;
import com.athukorala.inventory_system.repository.StockMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;

    @Autowired
    public InventoryService(ProductRepository productRepository,
                            StockMovementRepository stockMovementRepository) {
        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    public List<Product> getAllInventory() {
        return productRepository.findAll();
    }

    public Product getInventoryByProductId(Long productId) {
        return findProduct(productId);
    }

    public List<StockMovement> getMovementHistory(Long productId) {
        return stockMovementRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public List<Product> getLowStockItems() {
        return productRepository.findAll().stream()
                .filter(p -> p.getStockQuantity() != null && p.getStockQuantity() <= p.getReorderLevel())
                .toList();
    }

    public List<Product> getReorderList() {
        return getLowStockItems().stream()
                .filter(p -> p.getReorderQty() != null && p.getReorderQty() > 0)
                .toList();
    }

    @Transactional
    public Product stockIn(StockInRequest request) {
        validatePositive(request.getQuantity(), "Stock-in quantity must be greater than 0");
        Product product = findProduct(request.getProductId());
        int before = safeQty(product);
        int after = before + request.getQuantity();
        product.setStockQuantity(after);
        Product saved = productRepository.save(product);
        createMovement(saved, "IN", request.getQuantity(), "STOCK_IN", request.getNote(), before, after, request.getReferenceCode());
        return saved;
    }

    @Transactional
    public Product stockOut(StockOutRequest request) {
        validatePositive(request.getQuantity(), "Stock-out quantity must be greater than 0");
        Product product = findProduct(request.getProductId());
        int before = safeQty(product);
        int after = before - request.getQuantity();
        if (after < 0) throw new RuntimeException("Insufficient stock for stock-out operation");
        product.setStockQuantity(after);
        Product saved = productRepository.save(product);
        createMovement(saved, "OUT", request.getQuantity(), defaultText(request.getReason(), "SALE"), request.getNote(), before, after, request.getReferenceCode());
        return saved;
    }

    @Transactional
    public Product adjustStock(AdjustStockRequest request) {
        if (request.getQuantityChange() == null || request.getQuantityChange() == 0) {
            throw new RuntimeException("Adjustment quantityChange cannot be 0");
        }
        Product product = findProduct(request.getProductId());
        int before = safeQty(product);
        int after = before + request.getQuantityChange();
        if (after < 0) throw new RuntimeException("Adjustment makes stock negative");
        product.setStockQuantity(after);
        Product saved = productRepository.save(product);
        createMovement(saved, "ADJUST", request.getQuantityChange(), defaultText(request.getReason(), "CORRECTION"), request.getNote(), before, after, request.getReferenceCode());
        return saved;
    }

    @Transactional
    public Product updateReorderSettings(Long productId, ReorderSettingsRequest request) {
        Product product = findProduct(productId);
        if (request.getReorderLevel() != null && request.getReorderLevel() >= 0) {
            product.setReorderLevel(request.getReorderLevel());
        }
        if (request.getReorderQty() != null && request.getReorderQty() >= 0) {
            product.setReorderQty(request.getReorderQty());
        }
        return productRepository.save(product);
    }

    @Transactional
    public Product deductFromOrder(InventoryQuantityRequest request) {
        StockOutRequest stockOutRequest = new StockOutRequest();
        stockOutRequest.setProductId(request.getProductId());
        stockOutRequest.setQuantity(request.getQuantity());
        stockOutRequest.setReason(defaultText(request.getReason(), "ORDER_CONFIRMED"));
        stockOutRequest.setNote(request.getNote());
        stockOutRequest.setReferenceCode(request.getReferenceCode());
        return stockOut(stockOutRequest);
    }

    @Transactional
    public Product restoreStock(InventoryQuantityRequest request) {
        StockInRequest stockInRequest = new StockInRequest();
        stockInRequest.setProductId(request.getProductId());
        stockInRequest.setQuantity(request.getQuantity());
        stockInRequest.setNote(defaultText(request.getNote(), "Stock restored after cancel/refund"));
        stockInRequest.setReferenceCode(request.getReferenceCode());
        return stockIn(stockInRequest);
    }

    @Transactional
    public void deleteMovementAndRevert(Long movementId) {
        StockMovement movement = stockMovementRepository.findById(movementId)
                .orElseThrow(() -> new RuntimeException("Stock movement not found: " + movementId));

        Product product = findProduct(movement.getProduct().getId());
        int current = safeQty(product);
        int reverted;

        switch (movement.getMovementType()) {
            case "IN" -> reverted = current - movement.getQuantity();
            case "OUT" -> reverted = current + movement.getQuantity();
            case "ADJUST" -> reverted = current - movement.getQuantity();
            default -> throw new RuntimeException("Unsupported movement type: " + movement.getMovementType());
        }

        if (reverted < 0) {
            throw new RuntimeException("Cannot delete movement because stock would become negative");
        }

        product.setStockQuantity(reverted);
        productRepository.save(product);
        stockMovementRepository.delete(movement);
    }

    private Product findProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
    }

    private int safeQty(Product product) {
        return product.getStockQuantity() == null ? 0 : product.getStockQuantity();
    }

    private void validatePositive(Integer value, String message) {
        if (value == null || value <= 0) throw new RuntimeException(message);
    }

    private String defaultText(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private void createMovement(Product product, String movementType, Integer qty, String reason,
                                String note, Integer before, Integer after, String referenceCode) {
        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setMovementType(movementType);
        movement.setQuantity(qty);
        movement.setReason(reason);
        movement.setNote(note);
        movement.setStockBefore(before);
        movement.setStockAfter(after);
        movement.setReferenceCode(referenceCode);
        stockMovementRepository.save(movement);
    }
}
