package com.lerestaurant.le_restaurant_backend.dto;

import com.lerestaurant.le_restaurant_backend.entity.Order;
import java.time.OffsetDateTime;

/**
 * Order Update Request DTO (F105)
 * 
 * This DTO is used for updating existing orders via API.
 * Typically used for status updates by managers.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F105-OrderManagement
 */
public class OrderUpdateRequestDto {
    
    private Order.OrderStatus status;
    private String specialInstructions;
    private OffsetDateTime estimatedCompletion;
    
    // Constructors
    public OrderUpdateRequestDto() {}
    
    public OrderUpdateRequestDto(Order.OrderStatus status, String specialInstructions,
                                OffsetDateTime estimatedCompletion) {
        this.status = status;
        this.specialInstructions = specialInstructions;
        this.estimatedCompletion = estimatedCompletion;
    }
    
    // Getters and Setters
    public Order.OrderStatus getStatus() {
        return status;
    }
    
    public void setStatus(Order.OrderStatus status) {
        this.status = status;
    }
    
    public String getSpecialInstructions() {
        return specialInstructions;
    }
    
    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }
    
    public OffsetDateTime getEstimatedCompletion() {
        return estimatedCompletion;
    }
    
    public void setEstimatedCompletion(OffsetDateTime estimatedCompletion) {
        this.estimatedCompletion = estimatedCompletion;
    }
}
