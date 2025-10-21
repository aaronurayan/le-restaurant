package com.lerestaurant.le_restaurant_backend.dto;

import java.math.BigDecimal;

/**
 * Delivery Creation Request DTO (F107)
 * 
 * This DTO is used for creating new deliveries via API.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F107-DeliveryManagement
 */
public class DeliveryCreateRequestDto {
    
    private Long orderId;
    private Long deliveryAddressId;
    private BigDecimal deliveryFee;
    private Integer estimatedDeliveryTimeMinutes;
    private String deliveryInstructions;
    
    // Constructors
    public DeliveryCreateRequestDto() {}
    
    // Getters and Setters
    public Long getOrderId() {
        return orderId;
    }
    
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    
    public Long getDeliveryAddressId() {
        return deliveryAddressId;
    }
    
    public void setDeliveryAddressId(Long deliveryAddressId) {
        this.deliveryAddressId = deliveryAddressId;
    }
    
    public BigDecimal getDeliveryFee() {
        return deliveryFee;
    }
    
    public void setDeliveryFee(BigDecimal deliveryFee) {
        this.deliveryFee = deliveryFee;
    }
    
    public Integer getEstimatedDeliveryTimeMinutes() {
        return estimatedDeliveryTimeMinutes;
    }
    
    public void setEstimatedDeliveryTimeMinutes(Integer estimatedDeliveryTimeMinutes) {
        this.estimatedDeliveryTimeMinutes = estimatedDeliveryTimeMinutes;
    }
    
    public String getDeliveryInstructions() {
        return deliveryInstructions;
    }
    
    public void setDeliveryInstructions(String deliveryInstructions) {
        this.deliveryInstructions = deliveryInstructions;
    }
}
