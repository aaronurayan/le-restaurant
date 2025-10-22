package com.lerestaurant.le_restaurant_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ReservationResponseDto
 * F109 - Reservation Management Feature
 * 
 * Standard API response wrapper for reservation operations.
 * 
 * @author Le Restaurant Development Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponseDto {
    
    private boolean success;
    private String message;
    private ReservationDto data;
    
    public static ReservationResponseDto success(String message, ReservationDto data) {
        return new ReservationResponseDto(true, message, data);
    }
    
    public static ReservationResponseDto error(String message) {
        return new ReservationResponseDto(false, message, null);
    }
}
