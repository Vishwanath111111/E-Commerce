package com.vastrada.controller;

import com.vastrada.dto.ApiResponse;
import com.vastrada.dto.CategoryDTO;
import com.vastrada.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }

    @GetMapping("/tree")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getCategoryTree() {
        List<CategoryDTO> tree = categoryService.getCategoryTree();
        return ResponseEntity.ok(ApiResponse.success("Category tree retrieved successfully", tree));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getFeaturedCategories() {
        List<CategoryDTO> featured = categoryService.getFeaturedCategories();
        return ResponseEntity.ok(ApiResponse.success("Featured categories retrieved", featured));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<CategoryDTO>> getCategoryBySlug(@PathVariable String slug) {
        CategoryDTO category = categoryService.getCategoryBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Category retrieved", category));
    }
}
