package com.lerestaurant.le_restaurant_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZonedDateTime;

/**
 * Reservation Entity for Le Restaurant
 * F109 - Reservation Management Feature
 * 
 * Represents a customer reservation in the restaurant system.
 * Admins/Managers can view, approve, or deny reservations.
 * 
 * @author Le Restaurant Development Team
 */
@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "customer_name", nullable = false, length = 255)
    private String customerName;

    @Column(name = "customer_email", nullable = false, length = 255)
    private String customerEmail;

    @Column(name = "customer_phone", nullable = false, length = 50)
    private String customerPhone;

    @Column(name = "reservation_date", nullable = false)
    private LocalDate reservationDate;

    @Column(name = "reservation_time", nullable = false)
    private LocalTime reservationTime;

    @Column(name = "party_size", nullable = false)
    private Integer partySize;

    @Column(name = "table_id")
    private Long tableId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "confirmed_at")
    private ZonedDateTime confirmedAt;

    @Column(name = "confirmed_by_user_id")
    private Long confirmedByUserId;

    @Column(name = "checked_in_at")
    private ZonedDateTime checkedInAt;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @PrePersist
    protected void onCreate() {
        this.createdAt = ZonedDateTime.now();
        if (this.status == null) {
            this.status = ReservationStatus.PENDING;
        }
    }

    /**
     * Reservation Status Enum
     */
    public enum ReservationStatus {
        PENDING,      // Waiting for admin approval
        CONFIRMED,    // Approved by admin
        CANCELLED,    // Cancelled by customer or admin
        DENIED,       // Denied by admin
        SEATED,       // Customer has been seated
        COMPLETED,    // Reservation completed
        NO_SHOW       // Customer did not show up
    }
}
