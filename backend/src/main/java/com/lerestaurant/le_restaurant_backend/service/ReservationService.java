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
     * Supports both authenticated customers and guest reservations
     * 
     * @param requestDto Reservation creation request
     * @return Created reservation as DTO (status = PENDING)
     * @throws RuntimeException if validation fails
     */
    public ReservationDto createReservation(ReservationCreateRequestDto requestDto) {
        logger.info("Creating new reservation - Customer ID: {}, Guest: {}",
                requestDto.getCustomerId(), requestDto.getGuestEmail());

        User customer;

        // Handle guest reservation vs authenticated customer reservation
        if (requestDto.getCustomerId() == null) {
            // Guest reservation - create or find guest user
            logger.info("Processing guest reservation for: {}", requestDto.getGuestEmail());

            // Validate guest info is provided
            if (requestDto.getGuestEmail() == null || requestDto.getGuestName() == null) {
                throw new RuntimeException("Guest email and name are required for guest reservations");
            }

            // Try to find existing guest user by email, or create new one
            customer = userRepository.findByEmail(requestDto.getGuestEmail())
                    .orElseGet(() -> {
                        logger.info("Creating new guest user for: {}", requestDto.getGuestEmail());
                        User guestUser = new User();
                        guestUser.setEmail(requestDto.getGuestEmail());

                        // Parse guest name into first and last name
                        String[] nameParts = requestDto.getGuestName().trim().split("\\s+", 2);
                        guestUser.setFirstName(nameParts[0]);
                        guestUser.setLastName(nameParts.length > 1 ? nameParts[1] : "");

                        guestUser.setPhoneNumber(requestDto.getGuestPhone());
                        guestUser.setRole(User.UserRole.CUSTOMER);
                        guestUser.setStatus(User.UserStatus.ACTIVE);
                        guestUser.setPasswordHash("GUEST_USER"); // Placeholder - guest users cannot login
                        return userRepository.save(guestUser);
                    });
        } else {
            // Authenticated customer reservation
            customer = userRepository.findById(requestDto.getCustomerId())
                    .orElseThrow(
                            () -> new RuntimeException("Customer not found with ID: " + requestDto.getCustomerId()));
        }

        RestaurantTable table = null;

        // Handle table assignment (optional - can be auto-assigned later)
        if (requestDto.getTableId() != null) {
            table = restaurantTableRepository.findById(requestDto.getTableId())
                    .orElseThrow(() -> new RuntimeException("Table not found with ID: " + requestDto.getTableId()));

            // Validate number of guests does not exceed table capacity
            if (requestDto.getNumberOfGuests() > table.getCapacity()) {
                throw new RuntimeException("Number of guests (" + requestDto.getNumberOfGuests() +
                        ") exceeds table capacity (" + table.getCapacity() + ")");
            }

            // Check for existing reservations at same time
            List<Reservation> existingReservations = reservationRepository.findByTableIdAndReservationDateTime(
                    requestDto.getTableId(),
                    requestDto.getReservationDateTime());
            if (!existingReservations.isEmpty()) {
                boolean hasActiveReservation = existingReservations.stream()
                        .anyMatch(r -> r.getStatus() != Reservation.ReservationStatus.CANCELLED);
                if (hasActiveReservation) {
                    throw new RuntimeException("Table is already reserved for this time");
                }
            }
        }

        // Validate reservation is for future date
        if (requestDto.getReservationDateTime().isBefore(OffsetDateTime.now())) {
            throw new RuntimeException("Reservation date must be in the future");
        }

        // Create new reservation
        Reservation reservation = new Reservation();
        reservation.setCustomer(customer);
        reservation.setTable(table); // Can be null - will be assigned by manager
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
     * @param id         Reservation ID
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
     * @param id              Reservation ID
     * @param rejectionReason Reason for rejection
     * @param approverId      Manager (User) ID rejecting the reservation
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
        String customerName = (reservation.getCustomer().getFirstName() != null
                ? reservation.getCustomer().getFirstName()
                : "") +
                " " +
                (reservation.getCustomer().getLastName() != null ? reservation.getCustomer().getLastName() : "");
        dto.setCustomerName(customerName.trim());
        dto.setCustomerEmail(reservation.getCustomer().getEmail());
        dto.setCustomerPhone(reservation.getCustomer().getPhoneNumber());

        // Table info (may be null if not yet assigned)
        if (reservation.getTable() != null) {
            dto.setTableId(reservation.getTable().getId());
            dto.setTableNumber(reservation.getTable().getTableNumber());
            dto.setTableLocation(reservation.getTable().getLocationDescription());
        }

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

    /**
     * Get reservations by date (F108)
     * 
     * @param dateString Date in yyyy-MM-dd format
     * @return List of reservations for the date
     */
    public List<ReservationDto> getReservationsByDate(String dateString) {
        logger.info("Fetching reservations for date: {}", dateString);
        java.time.LocalDate date = java.time.LocalDate.parse(dateString);
        List<Reservation> reservations = reservationRepository.findByReservationDate(date);
        return reservations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get available time slots for a date and party size (F108)
     * 
     * @param dateString Date in yyyy-MM-dd format
     * @param partySize  Number of guests
     * @return List of available time slots
     */
    public List<com.lerestaurant.le_restaurant_backend.dto.TimeSlotDto> getAvailableTimeSlots(String dateString,
            Integer partySize) {
        logger.info("Getting available time slots for date: {} and party size: {}", dateString, partySize);
        java.time.LocalDate date = java.time.LocalDate.parse(dateString);

        List<com.lerestaurant.le_restaurant_backend.dto.TimeSlotDto> timeSlots = new java.util.ArrayList<>();

        // Generate time slots from 17:00 to 21:30 in 30-minute intervals
        for (int hour = 17; hour <= 21; hour++) {
            for (int minute = 0; minute < 60; minute += 30) {
                String timeString = String.format("%02d:%02d", hour, minute);
                java.time.LocalTime time = java.time.LocalTime.parse(timeString);

                List<com.lerestaurant.le_restaurant_backend.dto.TableDto> availableTables = getAvailableTablesForDateTime(
                        date, time, partySize);

                com.lerestaurant.le_restaurant_backend.dto.TimeSlotDto timeSlot = new com.lerestaurant.le_restaurant_backend.dto.TimeSlotDto(
                        timeString,
                        !availableTables.isEmpty(),
                        availableTables);
                timeSlots.add(timeSlot);
            }
        }

        return timeSlots;
    }

    /**
     * Get available tables for a date, time, and party size (F108)
     * 
     * @param dateString Date in yyyy-MM-dd format
     * @param timeString Time in HH:mm format
     * @param partySize  Number of guests
     * @return List of available tables
     */
    public List<com.lerestaurant.le_restaurant_backend.dto.TableDto> getAvailableTables(String dateString,
            String timeString, Integer partySize) {
        logger.info("Getting available tables for date: {}, time: {}, party size: {}", dateString, timeString,
                partySize);
        java.time.LocalDate date = java.time.LocalDate.parse(dateString);
        java.time.LocalTime time = java.time.LocalTime.parse(timeString);

        return getAvailableTablesForDateTime(date, time, partySize);
    }

    /**
     * Helper method to get available tables for a specific date and time
     * 
     * @param date      Reservation date
     * @param time      Reservation time
     * @param partySize Number of guests
     * @return List of available tables
     */
    private List<com.lerestaurant.le_restaurant_backend.dto.TableDto> getAvailableTablesForDateTime(
            java.time.LocalDate date, java.time.LocalTime time, Integer partySize) {

        // Get all tables that can accommodate the party size
        List<RestaurantTable> allTables = restaurantTableRepository.findAll().stream()
                .filter(table -> table.getCapacity() >= partySize)
                .filter(table -> table.getStatus() == RestaurantTable.TableStatus.AVAILABLE)
                .collect(Collectors.toList());

        // Get all reservations for this date and time
        List<Reservation> existingReservations = reservationRepository.findByReservationDateAndReservationTime(date,
                time);

        // Filter out tables that are already reserved and not cancelled
        List<Long> reservedTableIds = existingReservations.stream()
                .filter(r -> r.getStatus() != Reservation.ReservationStatus.CANCELLED)
                .filter(r -> r.getTable() != null)
                .map(r -> r.getTable().getId())
                .collect(Collectors.toList());

        // Return available tables as DTOs
        return allTables.stream()
                .filter(table -> !reservedTableIds.contains(table.getId()))
                .map(this::convertTableToDto)
                .collect(Collectors.toList());
    }

    /**
     * Convert RestaurantTable entity to TableDto
     * 
     * @param table RestaurantTable entity
     * @return TableDto
     */
    private com.lerestaurant.le_restaurant_backend.dto.TableDto convertTableToDto(RestaurantTable table) {
        List<String> features = new java.util.ArrayList<>();
        if (table.getTableType() != null) {
            features.add(table.getTableType().toString().toLowerCase());
        }

        return new com.lerestaurant.le_restaurant_backend.dto.TableDto(
                table.getId().toString(),
                table.getTableNumber(),
                table.getCapacity(),
                table.getLocationDescription() != null ? table.getLocationDescription() : "Main dining area",
                table.getStatus() == RestaurantTable.TableStatus.AVAILABLE,
                features);
    }
}
