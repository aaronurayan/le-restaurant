package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.entity.Reservation;
import com.lerestaurant.le_restaurant_backend.repository.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private ReservationService reservationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateReservation() {
        // Arrange
        Reservation reservation = new Reservation();
        reservation.setGuestCount(4);
        reservation.setDateTime(LocalDateTime.of(2025, 10, 2, 18, 0));

        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);

        // Act
        Reservation createdReservation = reservationService.createReservation(reservation);

        // Assert
        assertNotNull(createdReservation);
        assertEquals(4, createdReservation.getGuestCount());
        assertEquals(LocalDateTime.of(2025, 10, 2, 18, 0), createdReservation.getDateTime());
        verify(reservationRepository, times(1)).save(reservation);
    }

    @Test
    void testGetReservationById() {
        // Arrange
        Long reservationId = 1L;
        Reservation reservation = new Reservation();
        reservation.setId(reservationId);
        reservation.setGuestCount(4);
        reservation.setDateTime(LocalDateTime.of(2025, 10, 2, 18, 0));

        when(reservationRepository.findById(reservationId)).thenReturn(Optional.of(reservation));

        // Act
        Reservation foundReservation = reservationService.getReservationById(reservationId);

        // Assert
        assertNotNull(foundReservation);
        assertEquals(reservationId, foundReservation.getId());
        verify(reservationRepository, times(1)).findById(reservationId);
    }

    @Test
    void testDeleteReservation() {
        // Arrange
        Long reservationId = 1L;
        doNothing().when(reservationRepository).deleteById(reservationId);

        // Act
        reservationService.deleteReservation(reservationId);

        // Assert
        verify(reservationRepository, times(1)).deleteById(reservationId);
    }
}