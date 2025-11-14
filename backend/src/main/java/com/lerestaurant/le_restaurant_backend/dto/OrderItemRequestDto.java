package com.lerestaurant.le_restaurant_backend.dto;

import jakarta.validation.constraints.*;

/**
 * Order Item Request DTO (F105)
 * 
 * This DTO is used when creating order items as part of an order creation request.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F105-OrderManagement
 */
public class OrderItemRequestDto {
    
    @NotNull(message = "Menu item ID is required")
    private Long menuItemId;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    // Constructors
    public OrderItemRequestDto() {}
    
    public OrderItemRequestDto(Long menuItemId, Integer quantity) {
        this.menuItemId = menuItemId;
        this.quantity = quantity;
    }
    
    // Getters and Setters
    public Long getMenuItemId() {
        return menuItemId;
    }
    
    public void setMenuItemId(Long menuItemId) {
        this.menuItemId = menuItemId;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
