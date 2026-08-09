package com.vastrada.service;

import com.vastrada.dto.AddToCartRequest;
import com.vastrada.dto.CartDTO;
import com.vastrada.dto.WishlistDTO;
import com.vastrada.entity.Product;
import com.vastrada.entity.User;
import com.vastrada.entity.Wishlist;
import com.vastrada.entity.WishlistItem;
import com.vastrada.exception.BadRequestException;
import com.vastrada.exception.ResourceNotFoundException;
import com.vastrada.repository.ProductRepository;
import com.vastrada.repository.WishlistItemRepository;
import com.vastrada.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private CartService cartService;

    @Transactional
    public Wishlist getOrCreateWishlist(User user) {
        return wishlistRepository.findByUser(user)
                .orElseGet(() -> wishlistRepository.save(new Wishlist(user)));
    }

    public WishlistDTO getWishlist() {
        User currentUser = authService.getCurrentUser();
        Wishlist wishlist = getOrCreateWishlist(currentUser);
        return new WishlistDTO(wishlist);
    }

    @Transactional
    public WishlistDTO addToWishlist(Long productId) {
        User currentUser = authService.getCurrentUser();
        Wishlist wishlist = getOrCreateWishlist(currentUser);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        if (wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), productId)) {
            return new WishlistDTO(wishlist);
        }

        WishlistItem item = new WishlistItem(wishlist, product);
        wishlist.getItems().add(item);
        wishlistItemRepository.save(item);

        return new WishlistDTO(wishlistRepository.save(wishlist));
    }

    @Transactional
    public WishlistDTO removeFromWishlist(Long productId) {
        User currentUser = authService.getCurrentUser();
        Wishlist wishlist = getOrCreateWishlist(currentUser);

        WishlistItem item = wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in wishlist"));

        wishlist.getItems().remove(item);
        wishlistItemRepository.delete(item);

        return new WishlistDTO(wishlistRepository.save(wishlist));
    }

    @Transactional
    public CartDTO moveToCart(Long productId, Long variantId) {
        User currentUser = authService.getCurrentUser();
        Wishlist wishlist = getOrCreateWishlist(currentUser);

        WishlistItem item = wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in wishlist"));

        wishlist.getItems().remove(item);
        wishlistItemRepository.delete(item);

        return cartService.addToCart(new AddToCartRequest(variantId, 1));
    }
}
