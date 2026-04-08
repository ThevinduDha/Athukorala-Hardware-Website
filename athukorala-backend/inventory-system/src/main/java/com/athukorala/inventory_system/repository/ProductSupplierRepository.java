package com.athukorala.inventory_system.repository;

import com.athukorala.inventory_system.entity.ProductSupplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductSupplierRepository extends JpaRepository<ProductSupplier, Long> {
    List<ProductSupplier> findByProductId(Long productId);
    List<ProductSupplier> findBySupplierId(Long supplierId);
    Optional<ProductSupplier> findByProductIdAndSupplierId(Long productId, Long supplierId);
    boolean existsBySupplierId(Long supplierId);
}
