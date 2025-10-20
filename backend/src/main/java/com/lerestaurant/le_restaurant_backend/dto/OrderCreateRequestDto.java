package com.lerestaurant.le_restaurant_backend.dto;

import com.lerestaurant.le_restaurant_backend.entity.Order;
import java.math.BigDecimal;
import java.util.List;

/**
 * Order Creation Request DTO (F105)
 * 
 * This DTO is used for creating new orders via API.
 * It contains all required information to create an order.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F105-OrderManagement
 */
public class OrderCreateRequestDto {
    
    private Long customerId;
    private Long tableId; // nullable for delivery orders
    private Order.OrderType orderType;
    private BigDecimal tipAmount;
    private String specialInstructions;
    private List<OrderItemRequestDto> items;
    
    // Constructors
    public OrderCreateRequestDto() {}
    
    public OrderCreateRequestDto(Long customerId, Long tableId, Order.OrderType orderType,
                                BigDecimal tipAmount, String specialInstructions,
                                List<OrderItemRequestDto> items) {
        this.customerId = customerId;
        this.tableId = tableId;
        this.orderType = orderType;
        this.tipAmount = tipAmount;
        this.specialInstructions = specialInstructions;
        this.items = items;
    }
    
    // Getters and Setters
    public Long getCustomerId() {
        return customerId;
    }
    
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
    
    public Long getTableId() {
        return tableId;
    }
    
    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }
    
    public Order.OrderType getOrderType() {
        return orderType;
    }
    
    public void setOrderType(Order.OrderType orderType) {
        this.orderType = orderType;
    }
    
    public BigDecimal getTipAmount() {
        return tipAmount;
    }
    
    public void setTipAmount(BigDecimal tipAmount) {
        this.tipAmount = tipAmount;
    }
    
    public String getSpecialInstructions() {
        return specialInstructions;
    }
    
    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }
    
    public List<OrderItemRequestDto> getItems() {
        return items;
    }
    
    public void setItems(List<OrderItemRequestDto> items) {
        this.items = items;
    }
}
