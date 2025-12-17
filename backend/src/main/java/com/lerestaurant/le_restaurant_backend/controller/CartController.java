package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.AddToCartRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.CartDto;
import com.lerestaurant.le_restaurant_backend.dto.UpdateCartItemRequestDto;
import com.lerestaurant.le_restaurant_backend.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Cart Controller (Phase 4.1)
 * 
 * REST API endpoints for server-side cart management.
 * Base URL: /api/cart
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Get user's cart
     * GET /api/cart?userId={userId}
     */
    @GetMapping
    public ResponseEntity<CartDto> getCart(@RequestParam Long userId) {
        CartDto cart = cartService.getCart(userId);
        return ResponseEntity.ok(cart);
    }

    /**
     * Add item to cart
     * POST /api/cart/items?userId={userId}
     */
    @PostMapping("/items")
    public ResponseEntity<CartDto> addToCart(
            @RequestParam Long userId,
            @Valid @RequestBody AddToCartRequestDto request) {
        CartDto cart = cartService.addItemToCart(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(cart);
    }

    /**
     * Update cart item quantity
     * PUT /api/cart/items/{itemId}?userId={userId}
     */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDto> updateCartItem(
            @RequestParam Long userId,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequestDto request) {
        CartDto cart = cartService.updateCartItem(userId, itemId, request);
        return ResponseEntity.ok(cart);
    }

    /**
     * Remove item from cart
     * DELETE /api/cart/items/{itemId}?userId={userId}
     */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDto> removeFromCart(
            @RequestParam Long userId,
            @PathVariable Long itemId) {
        CartDto cart = cartService.removeItemFromCart(userId, itemId);
        return ResponseEntity.ok(cart);
    }

    /**
     * Clear entire cart
     * DELETE /api/cart?userId={userId}
     */
    @DeleteMapping
    public ResponseEntity<Map<String, String>> clearCart(@RequestParam Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of("message", "Cart cleared successfully"));
    }
}
