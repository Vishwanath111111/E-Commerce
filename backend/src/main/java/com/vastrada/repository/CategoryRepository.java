package com.vastrada.repository;

import com.vastrada.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);
    List<Category> findByParentCategoryIsNullAndIsActiveTrue();
    List<Category> findByIsActiveTrue();
    List<Category> findByIsFeaturedTrueAndIsActiveTrue();
    Boolean existsBySlug(String slug);
}
