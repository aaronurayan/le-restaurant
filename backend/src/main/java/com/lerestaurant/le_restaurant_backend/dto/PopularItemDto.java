package com.lerestaurant.le_restaurant_backend.dto;

import java.math.BigDecimal;

/**
 * PopularItemDto - Popular menu item statistics (Phase 4.3)
 */
public class PopularItemDto {
    private Long menuItemId;
    private String menuItemName;
    private String category;
    private Long orderCount;
    private BigDecimal totalRevenue;

    public PopularItemDto() {
    }

    public PopularItemDto(Long menuItemId, String menuItemName, String category,
            Long orderCount, BigDecimal totalRevenue) {
        this.menuItemId = menuItemId;
        this.menuItemName = menuItemName;
        this.category = category;
        this.orderCount = orderCount;
        this.totalRevenue = totalRevenue;
    }

    // Getters and Setters
    public Long getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(Long menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getMenuItemName() {
        return menuItemName;
    }

    public void setMenuItemName(String menuItemName) {
        this.menuItemName = menuItemName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Long orderCount) {
        this.orderCount = orderCount;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
