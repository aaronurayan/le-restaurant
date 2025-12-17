package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.AddToCartRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.CartDto;
import com.lerestaurant.le_restaurant_backend.dto.CartItemDto;
import com.lerestaurant.le_restaurant_backend.dto.UpdateCartItemRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.Cart;
import com.lerestaurant.le_restaurant_backend.entity.CartItem;
import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.CartRepository;
import com.lerestaurant.le_restaurant_backend.repository.CartItemRepository;
import com.lerestaurant.le_restaurant_backend.repository.MenuItemRepository;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Cart Service (Phase 4.1)
 * 
 * Manages server-side shopping cart operations.
 */
@Service
@Transactional
public class CartService {

    private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    @Autowired
    public CartService(CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            MenuItemRepository menuItemRepository,
            UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get or create cart for user
     */
    public CartDto getCart(Long userId) {
        logger.info("Fetching cart for user: {}", userId);
        Cart cart = getOrCreateCart(userId);
        return convertToDto(cart);
    }

    /**
     * Add item to cart
     */
    public CartDto addItemToCart(Long userId, AddToCartRequestDto request) {
        logger.info("Adding item {} to cart for user {}", request.getMenuItemId(), userId);

        Cart cart = getOrCreateCart(userId);
        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found: " + request.getMenuItemId()));

        if (!menuItem.isAvailable()) {
            throw new IllegalStateException("Menu item is not available: " + menuItem.getName());
        }

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository
                .findByCartIdAndMenuItemId(cart.getId(), request.getMenuItemId());

        if (existingItem.isPresent()) {
            // Update quantity
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            if (request.getSpecialInstructions() != null) {
                item.setSpecialInstructions(request.getSpecialInstructions());
            }
            cartItemRepository.save(item);
            logger.info("Updated existing cart item quantity to {}", item.getQuantity());
        } else {
            // Create new cart item
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setMenuItem(menuItem);
            newItem.setQuantity(request.getQuantity());
            newItem.setUnitPrice(menuItem.getPrice());
            newItem.setSpecialInstructions(request.getSpecialInstructions());
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
            logger.info("Added new item to cart");
        }

        return convertToDto(cartRepository.save(cart));
    }

    /**
     * Update cart item quantity
     */
    public CartDto updateCartItem(Long userId, Long itemId, UpdateCartItemRequestDto request) {
        logger.info("Updating cart item {} for user {}", itemId, userId);

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new IllegalStateException("Cart item does not belong to user's cart");
        }

        item.setQuantity(request.getQuantity());
        if (request.getSpecialInstructions() != null) {
            item.setSpecialInstructions(request.getSpecialInstructions());
        }
        cartItemRepository.save(item);

        return convertToDto(cartRepository.save(cart));
    }

    /**
     * Remove item from cart
     */
    public CartDto removeItemFromCart(Long userId, Long itemId) {
        logger.info("Removing cart item {} for user {}", itemId, userId);

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new IllegalStateException("Cart item does not belong to user's cart");
        }

        cart.removeItem(item);
        cartItemRepository.delete(item);

        return convertToDto(cartRepository.save(cart));
    }

    /**
     * Clear entire cart
     */
    public void clearCart(Long userId) {
        logger.info("Clearing cart for user {}", userId);

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));

        cart.clearItems();
        cartRepository.save(cart);
    }

    // Helper methods
    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found: " + userId));
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    private CartDto convertToDto(Cart cart) {
        List<CartItemDto> items = cart.getItems().stream()
                .map(this::convertItemToDto)
                .collect(Collectors.toList());

        return new CartDto(
                cart.getId(),
                cart.getUser().getId(),
                items,
                cart.getCreatedAt(),
                cart.getUpdatedAt());
    }

    private CartItemDto convertItemToDto(CartItem item) {
        return new CartItemDto(
                item.getId(),
                item.getMenuItem().getId(),
                item.getMenuItem().getName(),
                item.getMenuItem().getImageUrl(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getSpecialInstructions(),
                item.getAddedAt());
    }
}
