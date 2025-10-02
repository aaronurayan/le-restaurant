package com.lerestaurant.le_restaurant_backend.dto;

import com.lerestaurant.le_restaurant_backend.entity.Reservation.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZonedDateTime;

/**
 * ReservationDto - Data Transfer Object
 * F109 - Reservation Management Feature
 * 
 * Represents the complete reservation data transferred between layers.
 * 
 * @author Le Restaurant Development Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto {
    
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
    private Integer partySize;
    private Long tableId;
    private ReservationStatus status;
    private String specialRequests;
    private ZonedDateTime createdAt;
    private ZonedDateTime confirmedAt;
    private Long confirmedByUserId;
    private ZonedDateTime checkedInAt;
    private String adminNotes;
}
