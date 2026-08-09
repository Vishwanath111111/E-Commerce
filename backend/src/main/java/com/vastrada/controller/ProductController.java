package com.vastrada.controller;

import com.vastrada.dto.ApiResponse;
import com.vastrada.dto.ProductDTO;
import com.vastrada.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String color,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int pageSize
    ) {
        Page<ProductDTO> products = productService.filterProducts(
                category, search, minPrice, maxPrice, minRating, size, color, sortBy, page, pageSize
        );
        return ResponseEntity.ok(ApiResponse.success("Products retrieved", products));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getFeatured() {
        return ResponseEntity.ok(ApiResponse.success("Featured products", productService.getFeaturedProducts()));
    }

    @GetMapping("/new-arrivals")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getNewArrivals() {
        return ResponseEntity.ok(ApiResponse.success("New arrivals", productService.getNewArrivals()));
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getBestSellers() {
        return ResponseEntity.ok(ApiResponse.success("Best sellers", productService.getBestSellers()));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getTrending() {
        return ResponseEntity.ok(ApiResponse.success("Trending products", productService.getTrendingProducts()));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductBySlug(@PathVariable String slug) {
        ProductDTO product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Product details retrieved", product));
    }

    @GetMapping("/{slug}/related")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getRelatedProducts(@PathVariable String slug) {
        List<ProductDTO> related = productService.getRelatedProducts(slug);
        return ResponseEntity.ok(ApiResponse.success("Related products", related));
    }
}
