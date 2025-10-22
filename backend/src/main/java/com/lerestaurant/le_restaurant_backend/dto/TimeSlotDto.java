package com.lerestaurant.le_restaurant_backend.dto;

import java.util.List;

/**
 * Time Slot DTO for availability responses (F108)
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-22
 * @module F108-TableReservation
 */
public class TimeSlotDto {

    private String time;
    private Boolean isAvailable;
    private List<TableDto> availableTables;

    public TimeSlotDto() {
    }

    public TimeSlotDto(String time, Boolean isAvailable, List<TableDto> availableTables) {
        this.time = time;
        this.isAvailable = isAvailable;
        this.availableTables = availableTables;
    }

    // Getters and Setters
    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public List<TableDto> getAvailableTables() {
        return availableTables;
    }

    public void setAvailableTables(List<TableDto> availableTables) {
        this.availableTables = availableTables;
    }
}
