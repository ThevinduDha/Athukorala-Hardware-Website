package com.athukorala.inventory_system.repository;

import com.athukorala.inventory_system.entity.CuratedItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CuratedItemRepository extends JpaRepository<CuratedItem, Long> {

    // Standard retrieval for the Curated List page
    List<CuratedItem> findByUserId(Long userId);

    // Protocol: Check if asset is already archived to prevent duplicates
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    /**
     * UNTOGGLE PROTOCOL:
     * Sever the link between a user and a product directly.
     * @Transactional is required to authorize the database modification.
     * @Modifying tells JPA this is an execution, not just a selection.
     */
    @Transactional
    @Modifying
    void deleteByUserIdAndProductId(Long userId, Long productId);
}