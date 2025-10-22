package com.lerestaurant.le_restaurant_backend.dto;

import com.lerestaurant.le_restaurant_backend.entity.Delivery;

/**
 * Delivery Update Request DTO (F107)
 * 
 * This DTO is used for updating existing deliveries via API.
 * Typically used for assigning drivers and updating status.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F107-DeliveryManagement
 */
public class DeliveryUpdateRequestDto {
    
    private Long driverId;
    private Delivery.DeliveryStatus status;
    private String deliveryInstructions;
    
    // Constructors
    public DeliveryUpdateRequestDto() {}
    
    // Getters and Setters
    public Long getDriverId() {
        return driverId;
    }
    
    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }
    
    public Delivery.DeliveryStatus getStatus() {
        return status;
    }
    
    public void setStatus(Delivery.DeliveryStatus status) {
        this.status = status;
    }
    
    public String getDeliveryInstructions() {
        return deliveryInstructions;
    }
    
    public void setDeliveryInstructions(String deliveryInstructions) {
        this.deliveryInstructions = deliveryInstructions;
    }
}
