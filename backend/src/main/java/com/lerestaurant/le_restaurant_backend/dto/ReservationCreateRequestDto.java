package com.lerestaurant.le_restaurant_backend.dto;

import java.time.OffsetDateTime;

/**
 * Reservation Creation Request DTO (F108)
 * 
 * This DTO is used for creating reservations via API.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F108-F109-ReservationManagement
 */
public class ReservationCreateRequestDto {
    
    private Long customerId;
    private Long tableId;
    private Integer numberOfGuests;
    private OffsetDateTime reservationDateTime;
    private String specialRequests;
    
    // Constructors
    public ReservationCreateRequestDto() {}
    
    // Getters and Setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    
    public Long getTableId() { return tableId; }
    public void setTableId(Long tableId) { this.tableId = tableId; }
    
    public Integer getNumberOfGuests() { return numberOfGuests; }
    public void setNumberOfGuests(Integer numberOfGuests) { this.numberOfGuests = numberOfGuests; }
    
    public OffsetDateTime getReservationDateTime() { return reservationDateTime; }
    public void setReservationDateTime(OffsetDateTime reservationDateTime) { this.reservationDateTime = reservationDateTime; }
    
    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
}
