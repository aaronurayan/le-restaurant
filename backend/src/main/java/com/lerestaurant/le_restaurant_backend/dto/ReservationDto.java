package com.lerestaurant.le_restaurant_backend.dto;

import java.time.OffsetDateTime;

/**
 * Reservation Data Transfer Object (F108, F109)
 * 
 * This DTO represents reservation data for API responses.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F108-F109-ReservationManagement
 */
public class ReservationDto {
    
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Long tableId;
    private String tableNumber;
    private String tableLocation;
    private Integer numberOfGuests;
    private OffsetDateTime reservationDateTime;
    private String specialRequests;
    private String status; // PENDING, CONFIRMED, CANCELLED, COMPLETED
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private String rejectionReason;
    private Long approvedBy; // Manager ID
    
    // Constructors
    public ReservationDto() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    
    public Long getTableId() { return tableId; }
    public void setTableId(Long tableId) { this.tableId = tableId; }
    
    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }
    
    public String getTableLocation() { return tableLocation; }
    public void setTableLocation(String tableLocation) { this.tableLocation = tableLocation; }
    
    public Integer getNumberOfGuests() { return numberOfGuests; }
    public void setNumberOfGuests(Integer numberOfGuests) { this.numberOfGuests = numberOfGuests; }
    
    public OffsetDateTime getReservationDateTime() { return reservationDateTime; }
    public void setReservationDateTime(OffsetDateTime reservationDateTime) { this.reservationDateTime = reservationDateTime; }
    
    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    
    public Long getApprovedBy() { return approvedBy; }
    public void setApprovedBy(Long approvedBy) { this.approvedBy = approvedBy; }
}
