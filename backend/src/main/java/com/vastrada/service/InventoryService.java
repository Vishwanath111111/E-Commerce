package com.vastrada.service;

import com.vastrada.entity.Inventory;
import com.vastrada.entity.ProductVariant;
import com.vastrada.exception.BadRequestException;
import com.vastrada.exception.InsufficientStockException;
import com.vastrada.exception.ResourceNotFoundException;
import com.vastrada.repository.InventoryRepository;
import com.vastrada.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public List<Inventory> getLowStockInventory() {
        return inventoryRepository.findLowStockItems();
    }

    public Inventory getInventoryByVariantId(Long variantId) {
        return inventoryRepository.findByVariantId(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory record not found for variant ID: " + variantId));
    }

    @Transactional
    public Inventory updateStock(Long variantId, int newQuantity, Integer lowStockThreshold) {
        if (newQuantity < 0) {
            throw new BadRequestException("Inventory quantity cannot be negative");
        }

        Inventory inventory = inventoryRepository.findByVariantId(variantId)
                .orElseGet(() -> {
                    ProductVariant variant = variantRepository.findById(variantId)
                            .orElseThrow(() -> new ResourceNotFoundException("Variant not found: " + variantId));
                    return new Inventory(variant, newQuantity, 5);
                });

        inventory.setAvailableQuantity(newQuantity);
        if (lowStockThreshold != null) {
            inventory.setLowStockThreshold(lowStockThreshold);
        }

        return inventoryRepository.save(inventory);
    }

    @Transactional
    public void deductStockForOrder(Long variantId, int quantity) {
        Inventory inventory = getInventoryByVariantId(variantId);
        if (inventory.getAvailableQuantity() < quantity) {
            throw new InsufficientStockException("Insufficient stock for variant SKU " + inventory.getVariant().getSku() +
                    ". Available: " + inventory.getAvailableQuantity() + ", Requested: " + quantity);
        }

        inventory.setAvailableQuantity(inventory.getAvailableQuantity() - quantity);
        inventory.setSoldQuantity(inventory.getSoldQuantity() + quantity);
        inventoryRepository.save(inventory);
    }

    @Transactional
    public void restoreStockForCancelledOrder(Long variantId, int quantity) {
        Inventory inventory = getInventoryByVariantId(variantId);
        inventory.setAvailableQuantity(inventory.getAvailableQuantity() + quantity);
        if (inventory.getSoldQuantity() >= quantity) {
            inventory.setSoldQuantity(inventory.getSoldQuantity() - quantity);
        }
        inventoryRepository.save(inventory);
    }
}
