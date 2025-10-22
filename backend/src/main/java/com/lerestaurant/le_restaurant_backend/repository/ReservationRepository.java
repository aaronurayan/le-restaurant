package com.lerestaurant.le_restaurant_backend.repository;

import com.lerestaurant.le_restaurant_backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByCustomerId(Long customerId);
    List<Reservation> findByStatus(Reservation.ReservationStatus status);
    List<Reservation> findByTableIdAndReservationDateAndReservationTime(Long tableId, LocalDate date, LocalTime time);
    
    // For conflict checking
    default List<Reservation> findByTableIdAndReservationDateTime(Long tableId, OffsetDateTime dateTime) {
        return findByTableIdAndReservationDateAndReservationTime(
            tableId,
            dateTime.toLocalDate(),
            dateTime.toLocalTime()
        );
    }
}


