package com.athukorala.inventory_system.service;

import com.athukorala.inventory_system.dto.SupplierLinkRequest;
import com.athukorala.inventory_system.entity.Product;
import com.athukorala.inventory_system.entity.ProductSupplier;
import com.athukorala.inventory_system.entity.Supplier;
import com.athukorala.inventory_system.repository.ProductRepository;
import com.athukorala.inventory_system.repository.ProductSupplierRepository;
import com.athukorala.inventory_system.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierManagementService {

    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final ProductSupplierRepository productSupplierRepository;

    @Autowired
    public SupplierManagementService(SupplierRepository supplierRepository,
                                     ProductRepository productRepository,
                                     ProductSupplierRepository productSupplierRepository) {
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.productSupplierRepository = productSupplierRepository;
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplier(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found: " + id));
    }

    public List<ProductSupplier> getSuppliersByProduct(Long productId) {
        return productSupplierRepository.findByProductId(productId);
    }

    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier data) {
        Supplier supplier = getSupplier(id);
        supplier.setName(data.getName());
        supplier.setContactPerson(data.getContactPerson());
        supplier.setEmail(data.getEmail());
        supplier.setPhoneNumber(data.getPhoneNumber());
        supplier.setCategory(data.getCategory());
        return supplierRepository.save(supplier);
    }

    @Transactional
    public ProductSupplier linkSupplierToProduct(SupplierLinkRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + request.getProductId()));
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found: " + request.getSupplierId()));

        ProductSupplier link = productSupplierRepository.findByProductIdAndSupplierId(product.getId(), supplier.getId())
                .orElseGet(ProductSupplier::new);

        link.setProduct(product);
        link.setSupplier(supplier);
        link.setSupplierPrice(request.getSupplierPrice());
        return productSupplierRepository.save(link);
    }

    @Transactional
    public void unlinkSupplierFromProduct(Long productId, Long supplierId) {
        ProductSupplier link = productSupplierRepository.findByProductIdAndSupplierId(productId, supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier-product link not found"));
        productSupplierRepository.delete(link);
    }

    @Transactional
    public void deleteSupplier(Long id) {
        if (productSupplierRepository.existsBySupplierId(id)) {
            throw new RuntimeException("Supplier is still linked to products. Unlink first.");
        }
        supplierRepository.deleteById(id);
    }
}
