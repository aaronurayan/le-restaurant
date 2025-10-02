package com.lerestaurant.le_restaurant_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ReservationDenialRequestDto
 * F109 - Reservation Management Feature
 * 
 * Request DTO for denying a reservation.
 * 
 * @author Le Restaurant Development Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDenialRequestDto {
    
    @NotBlank(message = "Denial reason is required")
    private String denialReason;
    
    private Long deniedByUserId;
}
