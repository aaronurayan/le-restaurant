package com.lerestaurant.le_restaurant_backend.repository;

import com.lerestaurant.le_restaurant_backend.entity.Reservation;
import com.lerestaurant.le_restaurant_backend.entity.Reservation.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * ReservationRepository Interface
 * F109 - Reservation Management Feature
 * 
 * Provides database access methods for Reservation entity.
 * Includes custom queries for filtering and searching reservations.
 * 
 * @author Le Restaurant Development Team
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    /**
     * Find all reservations with a specific status
     * @param status The reservation status to filter by
     * @return List of reservations with the given status
     */
    List<Reservation> findByStatus(ReservationStatus status);

    /**
     * Find all reservations for a specific date
     * @param reservationDate The date to filter by
     * @return List of reservations on the given date
     */
    List<Reservation> findByReservationDate(LocalDate reservationDate);

    /**
     * Find all reservations within a date range
     * @param startDate The start date (inclusive)
     * @param endDate The end date (inclusive)
     * @return List of reservations within the date range
     */
    List<Reservation> findByReservationDateBetween(LocalDate startDate, LocalDate endDate);

    /**
     * Find all reservations for a specific customer
     * @param customerId The customer's ID
     * @return List of reservations for the customer
     */
    List<Reservation> findByCustomerId(Long customerId);

    /**
     * Find all reservations by customer email
     * @param customerEmail The customer's email
     * @return List of reservations for the customer
     */
    List<Reservation> findByCustomerEmail(String customerEmail);

    /**
     * Search reservations by customer name (case-insensitive partial match)
     * @param customerName The name to search for
     * @return List of matching reservations
     */
    List<Reservation> findByCustomerNameContainingIgnoreCase(String customerName);

    /**
     * Find all reservations with multiple statuses
     * @param statuses List of statuses to filter by
     * @return List of reservations matching any of the given statuses
     */
    List<Reservation> findByStatusIn(List<ReservationStatus> statuses);

    /**
     * Find reservations by status and date range
     * @param status The reservation status
     * @param startDate The start date (inclusive)
     * @param endDate The end date (inclusive)
     * @return List of reservations matching criteria
     */
    @Query("SELECT r FROM Reservation r WHERE r.status = :status AND r.reservationDate BETWEEN :startDate AND :endDate")
    List<Reservation> findByStatusAndDateRange(
        @Param("status") ReservationStatus status,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    /**
     * Search reservations with flexible filters
     * @param customerName Customer name to search (optional)
     * @param status Reservation status (optional)
     * @param startDate Start date for range (optional)
     * @return List of matching reservations
     */
    @Query("SELECT r FROM Reservation r WHERE " +
           "(:customerName IS NULL OR LOWER(r.customerName) LIKE LOWER(CONCAT('%', :customerName, '%'))) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:startDate IS NULL OR r.reservationDate >= :startDate)")
    List<Reservation> searchReservations(
        @Param("customerName") String customerName,
        @Param("status") ReservationStatus status,
        @Param("startDate") LocalDate startDate
    );

    /**
     * Count reservations by status
     * @param status The status to count
     * @return Number of reservations with the given status
     */
    long countByStatus(ReservationStatus status);

    /**
     * Find reservations assigned to a specific table
     * @param tableId The table ID
     * @return List of reservations for the table
     */
    List<Reservation> findByTableId(Long tableId);

    /**
     * Find all pending reservations ordered by reservation date and time
     * @return List of pending reservations
     */
    @Query("SELECT r FROM Reservation r WHERE r.status = 'PENDING' ORDER BY r.reservationDate ASC, r.reservationTime ASC")
    List<Reservation> findPendingReservationsOrderedByDateTime();
}
