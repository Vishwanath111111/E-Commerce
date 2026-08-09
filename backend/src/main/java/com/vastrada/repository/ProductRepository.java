package com.vastrada.repository;

import com.vastrada.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);
    Boolean existsBySlug(String slug);

    List<Product> findByIsFeaturedTrueAndIsActiveTrue();
    List<Product> findByIsNewArrivalTrueAndIsActiveTrue();
    List<Product> findByIsBestSellerTrueAndIsActiveTrue();
    List<Product> findByIsTrendingTrueAndIsActiveTrue();

    @Query("SELECT DISTINCT p FROM Product p " +
           "LEFT JOIN p.category c " +
           "LEFT JOIN p.variants v " +
           "WHERE p.isActive = true " +
           "AND (:categorySlug IS NULL OR c.slug = :categorySlug OR c.parentCategory.slug = :categorySlug) " +
           "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:minPrice IS NULL OR p.basePrice >= :minPrice OR p.discountPrice >= :minPrice) " +
           "AND (:maxPrice IS NULL OR (CASE WHEN p.discountPrice IS NOT NULL THEN p.discountPrice ELSE p.basePrice END) <= :maxPrice) " +
           "AND (:minRating IS NULL OR p.averageRating >= :minRating) " +
           "AND (:size IS NULL OR v.size = :size) " +
           "AND (:color IS NULL OR LOWER(v.color) = LOWER(:color))")
    Page<Product> filterProducts(
            @Param("categorySlug") String categorySlug,
            @Param("search") String search,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minRating") Double minRating,
            @Param("size") String size,
            @Param("color") String color,
            Pageable pageable
    );

    List<Product> findTop6ByCategoryIdAndIdNotAndIsActiveTrue(Long categoryId, Long productId);
}
