package com.vastrada.repository;

import com.vastrada.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    Optional<ProductVariant> findBySku(String sku);
    Boolean existsBySku(String sku);
    List<ProductVariant> findByProductId(Long productId);
}
