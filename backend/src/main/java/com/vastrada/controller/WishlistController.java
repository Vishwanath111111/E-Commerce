package com.vastrada.controller;

import com.vastrada.dto.ApiResponse;
import com.vastrada.dto.CartDTO;
import com.vastrada.dto.WishlistDTO;
import com.vastrada.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<ApiResponse<WishlistDTO>> getWishlist() {
        WishlistDTO wishlist = wishlistService.getWishlist();
        return ResponseEntity.ok(ApiResponse.success("Wishlist retrieved", wishlist));
    }

    @PostMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<WishlistDTO>> addToWishlist(@PathVariable Long productId) {
        WishlistDTO wishlist = wishlistService.addToWishlist(productId);
        return ResponseEntity.ok(ApiResponse.success("Added to wishlist", wishlist));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<WishlistDTO>> removeFromWishlist(@PathVariable Long productId) {
        WishlistDTO wishlist = wishlistService.removeFromWishlist(productId);
        return ResponseEntity.ok(ApiResponse.success("Removed from wishlist", wishlist));
    }

    @PostMapping("/items/{productId}/move-to-cart")
    public ResponseEntity<ApiResponse<CartDTO>> moveToCart(
            @PathVariable Long productId,
            @RequestParam Long variantId
    ) {
        CartDTO cart = wishlistService.moveToCart(productId, variantId);
        return ResponseEntity.ok(ApiResponse.success("Moved item from wishlist to cart", cart));
    }
}
