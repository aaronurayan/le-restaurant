package com.lerestaurant.le_restaurant_backend.dto;

import com.lerestaurant.le_restaurant_backend.entity.Order;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * Order Data Transfer Object (F105)
 * 
 * This DTO represents order data for API responses.
 * It includes order details, customer information, and order items.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F105-OrderManagement
 */
public class OrderDto {
    
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private Long tableId;
    private String tableNumber;
    private Order.OrderType orderType;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal tipAmount;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private String specialInstructions;
    private OffsetDateTime orderTime;
    private OffsetDateTime estimatedCompletion;
    private OffsetDateTime completedAt;
    private List<OrderItemDto> items;
    
    // Constructors
    public OrderDto() {}
    
    public OrderDto(Long id, Long customerId, String customerName, String customerEmail,
                    Long tableId, String tableNumber, Order.OrderType orderType,
                    BigDecimal subtotal, BigDecimal taxAmount, BigDecimal tipAmount,
                    BigDecimal totalAmount, Order.OrderStatus status, String specialInstructions,
                    OffsetDateTime orderTime, OffsetDateTime estimatedCompletion,
                    OffsetDateTime completedAt, List<OrderItemDto> items) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.tableId = tableId;
        this.tableNumber = tableNumber;
        this.orderType = orderType;
        this.subtotal = subtotal;
        this.taxAmount = taxAmount;
        this.tipAmount = tipAmount;
        this.totalAmount = totalAmount;
        this.status = status;
        this.specialInstructions = specialInstructions;
        this.orderTime = orderTime;
        this.estimatedCompletion = estimatedCompletion;
        this.completedAt = completedAt;
        this.items = items;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getCustomerId() {
        return customerId;
    }
    
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public String getCustomerEmail() {
        return customerEmail;
    }
    
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
    
    public Long getTableId() {
        return tableId;
    }
    
    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }
    
    public String getTableNumber() {
        return tableNumber;
    }
    
    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }
    
    public Order.OrderType getOrderType() {
        return orderType;
    }
    
    public void setOrderType(Order.OrderType orderType) {
        this.orderType = orderType;
    }
    
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    
    public BigDecimal getTaxAmount() {
        return taxAmount;
    }
    
    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }
    
    public BigDecimal getTipAmount() {
        return tipAmount;
    }
    
    public void setTipAmount(BigDecimal tipAmount) {
        this.tipAmount = tipAmount;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
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
    
    public OffsetDateTime getOrderTime() {
        return orderTime;
    }
    
    public void setOrderTime(OffsetDateTime orderTime) {
        this.orderTime = orderTime;
    }
    
    public OffsetDateTime getEstimatedCompletion() {
        return estimatedCompletion;
    }
    
    public void setEstimatedCompletion(OffsetDateTime estimatedCompletion) {
        this.estimatedCompletion = estimatedCompletion;
    }
    
    public OffsetDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(OffsetDateTime completedAt) {
        this.completedAt = completedAt;
    }
    
    public List<OrderItemDto> getItems() {
        return items;
    }
    
    public void setItems(List<OrderItemDto> items) {
        this.items = items;
    }
}
