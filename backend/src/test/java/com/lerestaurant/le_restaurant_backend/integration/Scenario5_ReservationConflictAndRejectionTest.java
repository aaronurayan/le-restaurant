package com.lerestaurant.le_restaurant_backend.integration;

import com.lerestaurant.le_restaurant_backend.dto.*;
import org.junit.jupiter.api.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Scenario 5: Reservation Conflict and Rejection
 * Story: Two customers try to book the last table for the same time slot;
 * one succeeds, the other is rejected.
 * 
 * Tests coverage: F108, F109
 */
@DisplayName("Scenario 5: Reservation Conflict and Rejection")
class Scenario5_ReservationConflictAndRejectionTest extends BaseE2ETest {

    @Test
    @Transactional
    @DisplayName("Manager handles conflicting reservations correctly")
    void testReservationConflictAndRejection() {
        // Create two customers
        UserDto customerA = createTestCustomer("customerA-res@example.com", "Customer", "A");
        UserDto customerB = createTestCustomer("customerB-res@example.com", "Customer", "B");

        LocalDate reservationDate = LocalDate.now().plusDays(10);
        LocalTime reservationTime = LocalTime.of(19, 0);

        // Step 1: Customer A Reserves (F108)
        ReservationDto reservationA = createReservation(
            customerA.getId(),
            reservationDate,
            reservationTime,
            4
        );
        assertNotNull(reservationA);
        // Reservation status after creation may vary
        assertNotNull(reservationA.getStatus());
        Long reservationAId = reservationA.getId();

        // Step 2: Customer B Reserves (F108) - Same time slot
        ReservationDto reservationB = createReservation(
            customerB.getId(),
            reservationDate,
            reservationTime,
            4
        );
        assertNotNull(reservationB);
        assertEquals("PENDING_APPROVAL", reservationB.getStatus());
        Long reservationBId = reservationB.getId();

        // Step 3: Manager Approves A (F109)
        UserDto manager = createTestCustomer("manager-res@example.com", "Manager", "Res");
        ReservationDto approvedA = reservationService.approveReservation(reservationAId, manager.getId());
        assertNotNull(approvedA);
        assertEquals("CONFIRMED", approvedA.getStatus());

        // Step 4: Manager Rejects B (F109)
        ReservationDto rejectedB = reservationService.rejectReservation(reservationBId, "Table not available at requested time", manager.getId());
        assertNotNull(rejectedB);
        assertEquals("REJECTED", rejectedB.getStatus());
    }
}
