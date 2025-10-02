package com.lerestaurant.le_restaurant_backend.dto;

import java.math.BigDecimal;

/**
 * DTO for updating an existing menu item (F104 - Menu Management)
 * All fields are optional to allow partial updates
 * 
 * @author Le Restaurant Development Team
 */
public class MenuItemUpdateRequestDto {
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private Boolean available;
    private String imageUrl;
    
    // Default constructor
    public MenuItemUpdateRequestDto() {}
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Boolean getAvailable() {
        return available;
    }
    
    public void setAvailable(Boolean available) {
        this.available = available;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
