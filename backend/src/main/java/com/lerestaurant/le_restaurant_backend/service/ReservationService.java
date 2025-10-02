package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.ReservationApprovalRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.ReservationDenialRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.ReservationDto;
import com.lerestaurant.le_restaurant_backend.entity.Reservation;
import com.lerestaurant.le_restaurant_backend.entity.Reservation.ReservationStatus;
import com.lerestaurant.le_restaurant_backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ReservationService
 * F109 - Reservation Management Feature
 * 
 * Business logic for managing restaurant reservations.
 * Handles approval, denial, and filtering of reservations.
 * 
 * @author Le Restaurant Development Team
 */
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    /**
     * Get all reservations
     * @return List of all reservations as DTOs
     */
    public List<ReservationDto> getAllReservations() {
        return reservationRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get reservation by ID
     * @param id The reservation ID
     * @return ReservationDto if found
     * @throws RuntimeException if reservation not found
     */
    public ReservationDto getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + id));
        return convertToDto(reservation);
    }

    /**
     * Get reservations by status
     * @param status The reservation status
     * @return List of reservations with the given status
     */
    public List<ReservationDto> getReservationsByStatus(ReservationStatus status) {
        return reservationRepository.findByStatus(status)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get reservations by date
     * @param date The reservation date
     * @return List of reservations on the given date
     */
    public List<ReservationDto> getReservationsByDate(LocalDate date) {
        return reservationRepository.findByReservationDate(date)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get reservations within a date range
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of reservations within the range
     */
    public List<ReservationDto> getReservationsByDateRange(LocalDate startDate, LocalDate endDate) {
        return reservationRepository.findByReservationDateBetween(startDate, endDate)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Search reservations by customer name
     * @param customerName Name to search for
     * @return List of matching reservations
     */
    public List<ReservationDto> searchReservationsByCustomerName(String customerName) {
        return reservationRepository.findByCustomerNameContainingIgnoreCase(customerName)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all pending reservations
     * @return List of pending reservations ordered by date and time
     */
    public List<ReservationDto> getPendingReservations() {
        return reservationRepository.findPendingReservationsOrderedByDateTime()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Approve a reservation
     * @param id The reservation ID
     * @param requestDto Approval request details
     * @return Updated reservation DTO
     * @throws RuntimeException if reservation not found or cannot be approved
     */
    @Transactional
    public ReservationDto approveReservation(Long id, ReservationApprovalRequestDto requestDto) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + id));

        // Validate that reservation can be approved
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new RuntimeException("Only PENDING reservations can be approved. Current status: " + reservation.getStatus());
        }

        // Update reservation
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setConfirmedAt(ZonedDateTime.now());
        reservation.setConfirmedByUserId(requestDto.getConfirmedByUserId());
        
        if (requestDto.getTableId() != null) {
            reservation.setTableId(requestDto.getTableId());
        }
        
        if (requestDto.getAdminNotes() != null && !requestDto.getAdminNotes().isBlank()) {
            String existingNotes = reservation.getAdminNotes() != null ? reservation.getAdminNotes() + "\n" : "";
            reservation.setAdminNotes(existingNotes + "[APPROVED] " + requestDto.getAdminNotes());
        }

        Reservation savedReservation = reservationRepository.save(reservation);
        return convertToDto(savedReservation);
    }

    /**
     * Deny a reservation
     * @param id The reservation ID
     * @param requestDto Denial request details
     * @return Updated reservation DTO
     * @throws RuntimeException if reservation not found or cannot be denied
     */
    @Transactional
    public ReservationDto denyReservation(Long id, ReservationDenialRequestDto requestDto) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + id));

        // Validate that reservation can be denied
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new RuntimeException("Only PENDING reservations can be denied. Current status: " + reservation.getStatus());
        }

        // Update reservation
        reservation.setStatus(ReservationStatus.DENIED);
        
        String denialNote = "[DENIED] " + requestDto.getDenialReason();
        if (requestDto.getDeniedByUserId() != null) {
            denialNote += " (By User ID: " + requestDto.getDeniedByUserId() + ")";
        }
        
        String existingNotes = reservation.getAdminNotes() != null ? reservation.getAdminNotes() + "\n" : "";
        reservation.setAdminNotes(existingNotes + denialNote);

        Reservation savedReservation = reservationRepository.save(reservation);
        return convertToDto(savedReservation);
    }

    /**
     * Search reservations with flexible filters
     * @param customerName Customer name (optional)
     * @param status Reservation status (optional)
     * @param startDate Start date (optional)
     * @return List of matching reservations
     */
    public List<ReservationDto> searchReservations(String customerName, ReservationStatus status, LocalDate startDate) {
        return reservationRepository.searchReservations(customerName, status, startDate)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get count of reservations by status
     * @param status The status to count
     * @return Number of reservations
     */
    public long countByStatus(ReservationStatus status) {
        return reservationRepository.countByStatus(status);
    }

    /**
     * Convert Reservation entity to DTO
     * @param reservation The entity to convert
     * @return ReservationDto
     */
    private ReservationDto convertToDto(Reservation reservation) {
        return new ReservationDto(
                reservation.getId(),
                reservation.getCustomerId(),
                reservation.getCustomerName(),
                reservation.getCustomerEmail(),
                reservation.getCustomerPhone(),
                reservation.getReservationDate(),
                reservation.getReservationTime(),
                reservation.getPartySize(),
                reservation.getTableId(),
                reservation.getStatus(),
                reservation.getSpecialRequests(),
                reservation.getCreatedAt(),
                reservation.getConfirmedAt(),
                reservation.getConfirmedByUserId(),
                reservation.getCheckedInAt(),
                reservation.getAdminNotes()
        );
    }
}
