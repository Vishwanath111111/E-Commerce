package com.vastrada.service;

import com.vastrada.dto.CategoryDTO;
import com.vastrada.entity.Category;
import com.vastrada.exception.BadRequestException;
import com.vastrada.exception.ResourceNotFoundException;
import com.vastrada.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(CategoryDTO::new)
                .collect(Collectors.toList());
    }

    public List<CategoryDTO> getCategoryTree() {
        return categoryRepository.findByParentCategoryIsNullAndIsActiveTrue().stream()
                .map(CategoryDTO::new)
                .collect(Collectors.toList());
    }

    public List<CategoryDTO> getFeaturedCategories() {
        return categoryRepository.findByIsFeaturedTrueAndIsActiveTrue().stream()
                .map(CategoryDTO::new)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
        return new CategoryDTO(category);
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsBySlug(dto.getSlug())) {
            throw new BadRequestException("Category slug already exists: " + dto.getSlug());
        }

        Category parent = null;
        if (dto.getParentId() != null) {
            parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found with ID: " + dto.getParentId()));
        }

        Category category = new Category(
                dto.getName(),
                dto.getSlug(),
                dto.getDescription(),
                dto.getImageUrl(),
                parent,
                dto.getIsFeatured()
        );

        return new CategoryDTO(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setImageUrl(dto.getImageUrl());
        if (dto.getIsFeatured() != null) category.setIsFeatured(dto.getIsFeatured());
        if (dto.getIsActive() != null) category.setIsActive(dto.getIsActive());

        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found with ID: " + dto.getParentId()));
            category.setParentCategory(parent);
        } else {
            category.setParentCategory(null);
        }

        return new CategoryDTO(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with ID: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
