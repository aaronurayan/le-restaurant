package com.lerestaurant.le_restaurant_backend.dto;

import com.lerestaurant.le_restaurant_backend.entity.Delivery;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * Delivery Data Transfer Object (F107)
 * 
 * This DTO represents delivery data for API responses.
 * It includes delivery details, order information, driver, and address.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F107-DeliveryManagement
 */
public class DeliveryDto {
    
    private Long id;
    private Long orderId;
    private String orderNumber;
    private BigDecimal orderTotal;
    private Long addressId;
    private String fullAddress;
    private Long driverId;
    private String driverName;
    private String driverPhone;
    private BigDecimal deliveryFee;
    private Integer estimatedDeliveryTimeMinutes;
    private Delivery.DeliveryStatus status;
    private String deliveryInstructions;
    private OffsetDateTime assignedAt;
    private OffsetDateTime pickedUpAt;
    private OffsetDateTime deliveredAt;
    private String deliveryPhotoUrl;
    
    // Constructors
    public DeliveryDto() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getOrderId() {
        return orderId;
    }
    
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    
    public String getOrderNumber() {
        return orderNumber;
    }
    
    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }
    
    public BigDecimal getOrderTotal() {
        return orderTotal;
    }
    
    public void setOrderTotal(BigDecimal orderTotal) {
        this.orderTotal = orderTotal;
    }
    
    public Long getAddressId() {
        return addressId;
    }
    
    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }
    
    public String getFullAddress() {
        return fullAddress;
    }
    
    public void setFullAddress(String fullAddress) {
        this.fullAddress = fullAddress;
    }
    
    public Long getDriverId() {
        return driverId;
    }
    
    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }
    
    public String getDriverName() {
        return driverName;
    }
    
    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }
    
    public String getDriverPhone() {
        return driverPhone;
    }
    
    public void setDriverPhone(String driverPhone) {
        this.driverPhone = driverPhone;
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
    
    public OffsetDateTime getAssignedAt() {
        return assignedAt;
    }
    
    public void setAssignedAt(OffsetDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }
    
    public OffsetDateTime getPickedUpAt() {
        return pickedUpAt;
    }
    
    public void setPickedUpAt(OffsetDateTime pickedUpAt) {
        this.pickedUpAt = pickedUpAt;
    }
    
    public OffsetDateTime getDeliveredAt() {
        return deliveredAt;
    }
    
    public void setDeliveredAt(OffsetDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }
    
    public String getDeliveryPhotoUrl() {
        return deliveryPhotoUrl;
    }
    
    public void setDeliveryPhotoUrl(String deliveryPhotoUrl) {
        this.deliveryPhotoUrl = deliveryPhotoUrl;
    }
}
