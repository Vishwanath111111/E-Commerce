package com.vastrada.service;

import com.vastrada.dto.AddToCartRequest;
import com.vastrada.dto.CartDTO;
import com.vastrada.dto.UpdateCartItemRequest;
import com.vastrada.entity.Cart;
import com.vastrada.entity.CartItem;
import com.vastrada.entity.Inventory;
import com.vastrada.entity.ProductVariant;
import com.vastrada.entity.User;
import com.vastrada.exception.BadRequestException;
import com.vastrada.exception.InsufficientStockException;
import com.vastrada.exception.ResourceNotFoundException;
import com.vastrada.repository.CartItemRepository;
import com.vastrada.repository.CartRepository;
import com.vastrada.repository.InventoryRepository;
import com.vastrada.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private AuthService authService;

    @Transactional
    public Cart getOrCreateCartForUser(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(new Cart(user)));
    }

    public CartDTO getCart() {
        User currentUser = authService.getCurrentUser();
        Cart cart = getOrCreateCartForUser(currentUser);
        return new CartDTO(cart);
    }

    @Transactional
    public CartDTO addToCart(AddToCartRequest request) {
        User currentUser = authService.getCurrentUser();
        Cart cart = getOrCreateCartForUser(currentUser);

        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found: " + request.getVariantId()));

        if (!variant.getIsActive() || (variant.getProduct() != null && !variant.getProduct().getIsActive())) {
            throw new BadRequestException("This product variant is currently unavailable");
        }

        Inventory inventory = inventoryRepository.findByVariantId(variant.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for variant"));

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndVariantId(cart.getId(), variant.getId());
        int newQuantity = request.getQuantity();
        if (existingItemOpt.isPresent()) {
            newQuantity += existingItemOpt.get().getQuantity();
        }

        if (inventory.getAvailableQuantity() < newQuantity) {
            throw new InsufficientStockException("Cannot add " + request.getQuantity() + " item(s). Only " +
                    inventory.getAvailableQuantity() + " units available in stock.");
        }

        BigDecimal unitPrice = variant.getDiscountPrice() != null ? variant.getDiscountPrice() : variant.getPrice();

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(newQuantity);
            existingItem.setUnitPrice(unitPrice);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem(cart, variant, request.getQuantity(), unitPrice);
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return new CartDTO(cartRepository.save(cart));
    }

    @Transactional
    public CartDTO updateCartItem(Long itemId, UpdateCartItemRequest request) {
        User currentUser = authService.getCurrentUser();
        Cart cart = getOrCreateCartForUser(currentUser);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        Inventory inventory = inventoryRepository.findByVariantId(item.getVariant().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for variant"));

        if (inventory.getAvailableQuantity() < request.getQuantity()) {
            throw new InsufficientStockException("Requested quantity " + request.getQuantity() + " exceeds available stock (" +
                    inventory.getAvailableQuantity() + ")");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return new CartDTO(cartRepository.findById(cart.getId()).get());
    }

    @Transactional
    public CartDTO removeCartItem(Long itemId) {
        User currentUser = authService.getCurrentUser();
        Cart cart = getOrCreateCartForUser(currentUser);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return new CartDTO(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(Cart cart) {
        cartItemRepository.deleteByCartId(cart.getId());
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
