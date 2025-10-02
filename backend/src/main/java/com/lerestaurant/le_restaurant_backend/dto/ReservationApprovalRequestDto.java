package com.lerestaurant.le_restaurant_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ReservationApprovalRequestDto
 * F109 - Reservation Management Feature
 * 
 * Request DTO for approving a reservation.
 * 
 * @author Le Restaurant Development Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationApprovalRequestDto {
    
    private Long tableId;
    
    private String adminNotes;
    
    @NotBlank(message = "Confirmed by user ID is required")
    private Long confirmedByUserId;
}
