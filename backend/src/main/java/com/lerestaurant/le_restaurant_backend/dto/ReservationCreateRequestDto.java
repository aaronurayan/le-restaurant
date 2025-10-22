package com.lerestaurant.le_restaurant_backend.dto;

import java.time.OffsetDateTime;

/**
 * Reservation Creation Request DTO (F108)
 * 
 * This DTO is used for creating reservations via API.
 * Supports both authenticated customers and guest reservations.
 * 
 * @author Le Restaurant Development Team
 * @version 1.1.0
 * @since 2025-10-20
 * @module F108-F109-ReservationManagement
 */
public class ReservationCreateRequestDto {

    private Long customerId; // Optional - null for guest reservations
    private Long tableId; // Optional - auto-assigned if null
    private Integer numberOfGuests;
    private OffsetDateTime reservationDateTime;
    private String specialRequests;

    // Guest customer info (for non-authenticated users)
    private String guestName;
    private String guestEmail;
    private String guestPhone;

    // Constructors
    public ReservationCreateRequestDto() {
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

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public OffsetDateTime getReservationDateTime() {
        return reservationDateTime;
    }

    public void setReservationDateTime(OffsetDateTime reservationDateTime) {
        this.reservationDateTime = reservationDateTime;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getGuestEmail() {
        return guestEmail;
    }

    public void setGuestEmail(String guestEmail) {
        this.guestEmail = guestEmail;
    }

    public String getGuestPhone() {
        return guestPhone;
    }

    public void setGuestPhone(String guestPhone) {
        this.guestPhone = guestPhone;
    }
}
