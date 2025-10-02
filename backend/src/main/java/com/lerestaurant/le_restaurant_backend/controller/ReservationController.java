package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.ReservationApprovalRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.ReservationDenialRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.ReservationDto;
import com.lerestaurant.le_restaurant_backend.entity.Reservation.ReservationStatus;
import com.lerestaurant.le_restaurant_backend.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * ReservationController
 * F109 - Reservation Management Feature
 * 
 * REST API endpoints for managing restaurant reservations.
 * Admin/Manager can view, approve, and deny reservations.
 * 
 * @author Le Restaurant Development Team
 */
@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    /**
     * Get all reservations with optional filters
     * GET /api/admin/reservations
     * Query params: status, startDate, endDate, customerName
     * 
     * @return List of reservations
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<ReservationDto>> getAllReservations(
            @RequestParam(required = false) ReservationStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String customerName
    ) {
        List<ReservationDto> reservations;

        // Apply filters based on query parameters
        if (status != null && startDate != null && endDate != null) {
            // Filter by status and date range
            reservations = reservationService.getReservationsByDateRange(startDate, endDate)
                    .stream()
                    .filter(r -> r.getStatus() == status)
                    .toList();
        } else if (status != null) {
            // Filter by status only
            reservations = reservationService.getReservationsByStatus(status);
        } else if (startDate != null && endDate != null) {
            // Filter by date range only
            reservations = reservationService.getReservationsByDateRange(startDate, endDate);
        } else if (customerName != null && !customerName.isBlank()) {
            // Search by customer name
            reservations = reservationService.searchReservationsByCustomerName(customerName);
        } else {
            // No filters - get all reservations
            reservations = reservationService.getAllReservations();
        }

        return ResponseEntity.ok(reservations);
    }

    /**
     * Get pending reservations ordered by date and time
     * GET /api/admin/reservations/pending
     * 
     * @return List of pending reservations
     */
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<ReservationDto>> getPendingReservations() {
        List<ReservationDto> pendingReservations = reservationService.getPendingReservations();
        return ResponseEntity.ok(pendingReservations);
    }

    /**
     * Get reservation by ID
     * GET /api/admin/reservations/{id}
     * 
     * @param id Reservation ID
     * @return Reservation details
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ReservationDto> getReservationById(@PathVariable Long id) {
        try {
            ReservationDto reservation = reservationService.getReservationById(id);
            return ResponseEntity.ok(reservation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Approve a reservation
     * PUT /api/admin/reservations/{id}/approve
     * 
     * @param id Reservation ID
     * @param requestDto Approval details (tableId, adminNotes, confirmedByUserId)
     * @return Updated reservation
     */
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> approveReservation(
            @PathVariable Long id,
            @RequestBody ReservationApprovalRequestDto requestDto
    ) {
        try {
            ReservationDto approvedReservation = reservationService.approveReservation(id, requestDto);
            return ResponseEntity.ok(approvedReservation);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Deny a reservation
     * PUT /api/admin/reservations/{id}/deny
     * 
     * @param id Reservation ID
     * @param requestDto Denial details (denialReason, deniedByUserId)
     * @return Updated reservation
     */
    @PutMapping("/{id}/deny")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> denyReservation(
            @PathVariable Long id,
            @RequestBody ReservationDenialRequestDto requestDto
    ) {
        try {
            ReservationDto deniedReservation = reservationService.denyReservation(id, requestDto);
            return ResponseEntity.ok(deniedReservation);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Get count of reservations by status
     * GET /api/admin/reservations/count/{status}
     * 
     * @param status Reservation status
     * @return Count
     */
    @GetMapping("/count/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Long> getReservationCountByStatus(@PathVariable ReservationStatus status) {
        long count = reservationService.countByStatus(status);
        return ResponseEntity.ok(count);
    }

    /**
     * Error response DTO for API errors
     */
    private record ErrorResponse(String message) {}
}