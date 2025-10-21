package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.ReservationApprovalRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.ReservationCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.ReservationDto;
import com.lerestaurant.le_restaurant_backend.entity.Reservation;
import com.lerestaurant.le_restaurant_backend.service.ReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Reservation Controller (F108, F109)
 * 
 * REST API endpoints for reservation management.
 * F108: Customer creates reservation
 * F109: Manager approves/rejects reservation
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F108-F109-ReservationManagement
 */
@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {
    
    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);
    
    private final ReservationService reservationService;
    
    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }
    
    /**
     * Create new reservation (F108)
     * POST /api/reservations
     * 
     * @param requestDto Reservation creation request
     * @return Created reservation
     */
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationCreateRequestDto requestDto) {
        try {
            logger.info("Creating new reservation for customer ID: {}", requestDto.getCustomerId());
            ReservationDto reservationDto = reservationService.createReservation(requestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(reservationDto);
        } catch (RuntimeException e) {
            logger.error("Error creating reservation: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Get reservation by ID
     * GET /api/reservations/{id}
     * 
     * @param id Reservation ID
     * @return Reservation details
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(@PathVariable Long id) {
        try {
            logger.info("Fetching reservation with ID: {}", id);
            ReservationDto reservationDto = reservationService.getReservationById(id);
            return ResponseEntity.ok(reservationDto);
        } catch (RuntimeException e) {
            logger.error("Error fetching reservation: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    /**
     * Get all reservations
     * GET /api/reservations
     * 
     * @return List of all reservations
     */
    @GetMapping
    public ResponseEntity<?> getAllReservations() {
        try {
            logger.info("Fetching all reservations");
            List<ReservationDto> reservations = reservationService.getAllReservations();
            return ResponseEntity.ok(reservations);
        } catch (RuntimeException e) {
            logger.error("Error fetching reservations: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Get reservations by customer (F108)
     * GET /api/reservations/customer/{customerId}
     * 
     * @param customerId Customer ID
     * @return List of customer's reservations
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getReservationsByCustomer(@PathVariable Long customerId) {
        try {
            logger.info("Fetching reservations for customer ID: {}", customerId);
            List<ReservationDto> reservations = reservationService.getReservationsByCustomer(customerId);
            return ResponseEntity.ok(reservations);
        } catch (RuntimeException e) {
            logger.error("Error fetching customer reservations: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Get reservations by status
     * GET /api/reservations/status/{status}
     * 
     * @param status Reservation status
     * @return List of reservations with given status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getReservationsByStatus(@PathVariable String status) {
        try {
            logger.info("Fetching reservations with status: {}", status);
            Reservation.ReservationStatus reservationStatus = Reservation.ReservationStatus.valueOf(status.toUpperCase());
            List<ReservationDto> reservations = reservationService.getReservationsByStatus(reservationStatus);
            return ResponseEntity.ok(reservations);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid reservation status: {}", status);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid reservation status: " + status);
            return ResponseEntity.badRequest().body(error);
        } catch (RuntimeException e) {
            logger.error("Error fetching reservations by status: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Approve reservation (F109)
     * POST /api/reservations/{id}/approve
     * 
     * @param id Reservation ID
     * @param approverId Manager ID
     * @return Approved reservation
     */
    @PostMapping("/{id}/approve/{approverId}")
    public ResponseEntity<?> approveReservation(@PathVariable Long id, @PathVariable Long approverId) {
        try {
            logger.info("Approving reservation {} by manager ID: {}", id, approverId);
            ReservationDto reservationDto = reservationService.approveReservation(id, approverId);
            return ResponseEntity.ok(reservationDto);
        } catch (RuntimeException e) {
            logger.error("Error approving reservation: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Reject/Cancel reservation (F109)
     * POST /api/reservations/{id}/reject
     * 
     * @param id Reservation ID
     * @param requestDto Rejection request with reason
     * @return Rejected reservation
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectReservation(@PathVariable Long id, 
                                              @RequestBody ReservationApprovalRequestDto requestDto) {
        try {
            logger.info("Rejecting reservation {}", id);
            ReservationDto reservationDto = reservationService.rejectReservation(
                id,
                requestDto.getRejectionReason(),
                requestDto.getApproverId()
            );
            return ResponseEntity.ok(reservationDto);
        } catch (RuntimeException e) {
            logger.error("Error rejecting reservation: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Cancel reservation (Customer cancellation)
     * PUT /api/reservations/{id}/cancel
     * 
     * @param id Reservation ID
     * @return Cancelled reservation
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        try {
            logger.info("Cancelling reservation with ID: {}", id);
            ReservationDto reservationDto = reservationService.cancelReservation(id);
            return ResponseEntity.ok(reservationDto);
        } catch (RuntimeException e) {
            logger.error("Error cancelling reservation: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Complete reservation
     * PUT /api/reservations/{id}/complete
     * 
     * @param id Reservation ID
     * @return Completed reservation
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeReservation(@PathVariable Long id) {
        try {
            logger.info("Completing reservation with ID: {}", id);
            ReservationDto reservationDto = reservationService.completeReservation(id);
            return ResponseEntity.ok(reservationDto);
        } catch (RuntimeException e) {
            logger.error("Error completing reservation: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Delete reservation
     * DELETE /api/reservations/{id}
     * 
     * @param id Reservation ID
     * @return Success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        try {
            logger.info("Deleting reservation with ID: {}", id);
            reservationService.deleteReservation(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Reservation deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error deleting reservation: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
