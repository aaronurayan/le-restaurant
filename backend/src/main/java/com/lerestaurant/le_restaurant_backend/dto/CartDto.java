package com.lerestaurant.le_restaurant_backend.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * CartDto - Data transfer object for Cart (Phase 4.1)
 */
public class CartDto {
    private Long id;
    private Long userId;
    private List<CartItemDto> items;
    private BigDecimal subtotal;
    private int itemCount;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public CartDto() {
    }

    public CartDto(Long id, Long userId, List<CartItemDto> items,
            OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        calculateTotals();
    }

    private void calculateTotals() {
        if (items != null) {
            this.subtotal = items.stream()
                    .map(CartItemDto::getSubtotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            this.itemCount = items.stream()
                    .mapToInt(CartItemDto::getQuantity)
                    .sum();
        } else {
            this.subtotal = BigDecimal.ZERO;
            this.itemCount = 0;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
        calculateTotals();
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public int getItemCount() {
        return itemCount;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
