package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.ReservationApprovalRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.ReservationCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.ReservationDto;
import com.lerestaurant.le_restaurant_backend.entity.Reservation;
import com.lerestaurant.le_restaurant_backend.entity.RestaurantTable;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.ReservationRepository;
import com.lerestaurant.le_restaurant_backend.repository.RestaurantTableRepository;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Reservation Service (F108, F109)
 * 
 * This service handles business logic for reservation management.
 * F108: Customer creates reservation (status = PENDING)
 * F109: Manager approves/rejects reservation (status = CONFIRMED/CANCELLED)
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F108-F109-ReservationManagement
 */
@Service
@Transactional
public class ReservationService {
    
    private static final Logger logger = LoggerFactory.getLogger(ReservationService.class);
    
    private final ReservationRepository reservationRepository;
    private final RestaurantTableRepository restaurantTableRepository;
    private final UserRepository userRepository;
    
    @Autowired
    public ReservationService(ReservationRepository reservationRepository,
                             RestaurantTableRepository restaurantTableRepository,
                             UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.restaurantTableRepository = restaurantTableRepository;
        this.userRepository = userRepository;
    }
    
    /**
     * Create new reservation (F108)
     * 
     * @param requestDto Reservation creation request
     * @return Created reservation as DTO (status = PENDING)
     * @throws RuntimeException if customer or table not found
     */
    public ReservationDto createReservation(ReservationCreateRequestDto requestDto) {
        logger.info("Creating new reservation for customer ID: {}", requestDto.getCustomerId());
        
        // Validate customer exists
        User customer = userRepository.findById(requestDto.getCustomerId())
            .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + requestDto.getCustomerId()));
        
        // Validate table exists
        RestaurantTable table = restaurantTableRepository.findById(requestDto.getTableId())
            .orElseThrow(() -> new RuntimeException("Table not found with ID: " + requestDto.getTableId()));
        
        // Validate number of guests does not exceed table capacity
        if (requestDto.getNumberOfGuests() > table.getCapacity()) {
            throw new RuntimeException("Number of guests (" + requestDto.getNumberOfGuests() + 
                                     ") exceeds table capacity (" + table.getCapacity() + ")");
        }
        
        // Validate reservation is for future date
        if (requestDto.getReservationDateTime().isBefore(OffsetDateTime.now())) {
            throw new RuntimeException("Reservation date must be in the future");
        }
        
        // Check for existing reservations at same time (basic check, could be more sophisticated)
        List<Reservation> existingReservations = reservationRepository.findByTableIdAndReservationDateTime(
            requestDto.getTableId(),
            requestDto.getReservationDateTime()
        );
        if (!existingReservations.isEmpty()) {
            throw new RuntimeException("Table is already reserved for this time");
        }
        
        // Create new reservation
        Reservation reservation = new Reservation();
        reservation.setCustomer(customer);
        reservation.setTable(table);
        reservation.setNumberOfGuests(requestDto.getNumberOfGuests());
        reservation.setReservationDateTime(requestDto.getReservationDateTime());
        reservation.setSpecialRequests(requestDto.getSpecialRequests());
        reservation.setStatus(Reservation.ReservationStatus.PENDING);
        reservation.setCreatedAt(OffsetDateTime.now());
        
        Reservation savedReservation = reservationRepository.save(reservation);
        logger.info("Created reservation with ID: {}", savedReservation.getId());
        
        return convertToDto(savedReservation);
    }
    
    /**
     * Get reservation by ID
     * 
     * @param id Reservation ID
     * @return Reservation as DTO
     * @throws RuntimeException if reservation not found
     */
    public ReservationDto getReservationById(Long id) {
        logger.info("Fetching reservation with ID: {}", id);
        
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + id));
        
        return convertToDto(reservation);
    }
    
    /**
     * Get all reservations
     * 
     * @return List of all reservations
     */
    public List<ReservationDto> getAllReservations() {
        logger.info("Fetching all reservations");
        
        List<Reservation> reservations = reservationRepository.findAll();
        return reservations.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Get reservations by customer (F108)
     * 
     * @param customerId Customer ID
     * @return List of customer's reservations
     */
    public List<ReservationDto> getReservationsByCustomer(Long customerId) {
        logger.info("Fetching reservations for customer ID: {}", customerId);
        
        List<Reservation> reservations = reservationRepository.findByCustomerId(customerId);
        return reservations.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Get reservations by status
     * 
     * @param status Reservation status
     * @return List of reservations with given status
     */
    public List<ReservationDto> getReservationsByStatus(Reservation.ReservationStatus status) {
        logger.info("Fetching reservations with status: {}", status);
        
        List<Reservation> reservations = reservationRepository.findByStatus(status);
        return reservations.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Approve reservation (F109)
     * 
     * @param id Reservation ID
     * @param approverId Manager (User) ID approving the reservation
     * @return Approved reservation as DTO
     * @throws RuntimeException if reservation not found or not in PENDING status
     */
    public ReservationDto approveReservation(Long id, Long approverId) {
        logger.info("Approving reservation {} by manager ID: {}", id, approverId);
        
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + id));
        
        if (reservation.getStatus() != Reservation.ReservationStatus.PENDING) {
            throw new RuntimeException("Only PENDING reservations can be approved");
        }
        
        User approver = userRepository.findById(approverId)
            .orElseThrow(() -> new RuntimeException("Approver not found with ID: " + approverId));
        
        reservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
        reservation.setApprovedBy(approver);
        reservation.setUpdatedAt(OffsetDateTime.now());
        
        Reservation updatedReservation = reservationRepository.save(reservation);
        logger.info("Approved reservation with ID: {}", id);
        
        return convertToDto(updatedReservation);
    }
    
    /**
     * Reject/Cancel reservation (F109)
     * 
     * @param id Reservation ID
     * @param rejectionReason Reason for rejection
     * @param approverId Manager (User) ID rejecting the reservation
     * @return Rejected reservation as DTO
     * @throws RuntimeException if reservation not found or not in PENDING status
     */
    public ReservationDto rejectReservation(Long id, String rejectionReason, Long approverId) {
        logger.info("Rejecting reservation {} with reason: {}", id, rejectionReason);
        
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + id));
        
        if (reservation.getStatus() != Reservation.ReservationStatus.PENDING) {
            throw new RuntimeException("Only PENDING reservations can be rejected");
        }
        
        User rejecter = userRepository.findById(approverId)
            .orElseThrow(() -> new RuntimeException("Rejecter not found with ID: " + approverId));
        
        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservation.setRejectionReason(rejectionReason);
        reservation.setApprovedBy(rejecter);
        reservation.setUpdatedAt(OffsetDateTime.now());
        
        Reservation updatedReservation = reservationRepository.save(reservation);
        logger.info("Rejected reservation with ID: {}", id);
        
        return convertToDto(updatedReservation);
    }
    
    /**
     * Cancel reservation (Customer cancellation)
     * 
     * @param id Reservation ID
     * @return Cancelled reservation as DTO
     * @throws RuntimeException if reservation not found or already completed
     */
    public ReservationDto cancelReservation(Long id) {
        logger.info("Cancelling reservation with ID: {}", id);
        
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + id));
        
        if (reservation.getStatus() == Reservation.ReservationStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel completed reservations");
        }
        
        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservation.setUpdatedAt(OffsetDateTime.now());
        
        Reservation updatedReservation = reservationRepository.save(reservation);
        logger.info("Cancelled reservation with ID: {}", id);
        
        return convertToDto(updatedReservation);
    }
    
    /**
     * Complete reservation (after customer arrives/leaves)
     * 
     * @param id Reservation ID
     * @return Completed reservation as DTO
     * @throws RuntimeException if reservation not found
     */
    public ReservationDto completeReservation(Long id) {
        logger.info("Completing reservation with ID: {}", id);
        
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + id));
        
        reservation.setStatus(Reservation.ReservationStatus.COMPLETED);
        reservation.setUpdatedAt(OffsetDateTime.now());
        
        Reservation updatedReservation = reservationRepository.save(reservation);
        logger.info("Completed reservation with ID: {}", id);
        
        return convertToDto(updatedReservation);
    }
    
    /**
     * Delete reservation
     * 
     * @param id Reservation ID
     * @throws RuntimeException if reservation not found
     */
    public void deleteReservation(Long id) {
        logger.info("Deleting reservation with ID: {}", id);
        
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reservation not found with ID: " + id);
        }
        
        reservationRepository.deleteById(id);
        logger.info("Deleted reservation with ID: {}", id);
    }
    
    /**
     * Convert Reservation entity to DTO
     * 
     * @param reservation Reservation entity
     * @return Reservation DTO
     */
    private ReservationDto convertToDto(Reservation reservation) {
        ReservationDto dto = new ReservationDto();
        dto.setId(reservation.getId());
        
        // Customer info
        dto.setCustomerId(reservation.getCustomer().getId());
        String customerName = (reservation.getCustomer().getFirstName() != null ? reservation.getCustomer().getFirstName() : "") + 
                             " " + 
                             (reservation.getCustomer().getLastName() != null ? reservation.getCustomer().getLastName() : "");
        dto.setCustomerName(customerName.trim());
        dto.setCustomerEmail(reservation.getCustomer().getEmail());
        dto.setCustomerPhone(reservation.getCustomer().getPhoneNumber());
        
        // Table info
        dto.setTableId(reservation.getTable().getId());
        dto.setTableNumber(reservation.getTable().getTableNumber());
        dto.setTableLocation(reservation.getTable().getLocationDescription());
        
        // Reservation details
        dto.setNumberOfGuests(reservation.getNumberOfGuests());
        dto.setReservationDateTime(reservation.getReservationDateTime());
        dto.setSpecialRequests(reservation.getSpecialRequests());
        dto.setStatus(reservation.getStatus().toString());
        
        // Timestamps
        dto.setCreatedAt(reservation.getCreatedAt());
        dto.setUpdatedAt(reservation.getUpdatedAt());
        
        // Rejection/Approval info
        if (reservation.getRejectionReason() != null) {
            dto.setRejectionReason(reservation.getRejectionReason());
        }
        if (reservation.getApprovedBy() != null) {
            dto.setApprovedBy(reservation.getApprovedBy().getId());
        }
        
        return dto;
    }
}
