package com.lerestaurant.le_restaurant_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {

    public enum ReservationStatus { PENDING, CONFIRMED, SEATED, COMPLETED, CANCELLED, NO_SHOW }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "table_id")
    private RestaurantTable table; // nullable until assigned

    @Column(name = "reservation_date", nullable = false)
    private LocalDate reservationDate;

    @Column(name = "reservation_time", nullable = false)
    private LocalTime reservationTime;

    @Column(name = "party_size", nullable = false)
    private Integer partySize;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "confirmed_at")
    private OffsetDateTime confirmedAt;

    @Column(name = "checked_in_at")
    private OffsetDateTime checkedInAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @ManyToOne
    @JoinColumn(name = "confirmed_by_user_id")
    private User confirmedBy;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    public RestaurantTable getTable() { return table; }
    public void setTable(RestaurantTable table) { this.table = table; }
    public LocalDate getReservationDate() { return reservationDate; }
    public void setReservationDate(LocalDate reservationDate) { this.reservationDate = reservationDate; }
    public LocalTime getReservationTime() { return reservationTime; }
    public void setReservationTime(LocalTime reservationTime) { this.reservationTime = reservationTime; }
    public Integer getPartySize() { return partySize; }
    public void setPartySize(Integer partySize) { this.partySize = partySize; }
    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
    public OffsetDateTime getConfirmedAt() { return confirmedAt; }
    public void setConfirmedAt(OffsetDateTime confirmedAt) { this.confirmedAt = confirmedAt; }
    public OffsetDateTime getCheckedInAt() { return checkedInAt; }
    public void setCheckedInAt(OffsetDateTime checkedInAt) { this.checkedInAt = checkedInAt; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public User getConfirmedBy() { return confirmedBy; }
    public void setConfirmedBy(User confirmedBy) { this.confirmedBy = confirmedBy; }
    
    // Alias methods for backward compatibility
    public User getApprovedBy() { return confirmedBy; }
    public void setApprovedBy(User approvedBy) { this.confirmedBy = approvedBy; }
    
    public Integer getNumberOfGuests() { return partySize; }
    public void setNumberOfGuests(Integer numberOfGuests) { this.partySize = numberOfGuests; }
    public OffsetDateTime getReservationDateTime() {
        if (reservationDate != null && reservationTime != null) {
            return OffsetDateTime.of(reservationDate.atTime(reservationTime), OffsetDateTime.now().getOffset());
        }
        return null;
    }
    public void setReservationDateTime(OffsetDateTime dateTime) {
        if (dateTime != null) {
            this.reservationDate = dateTime.toLocalDate();
            this.reservationTime = dateTime.toLocalTime();
        }
    }
}


