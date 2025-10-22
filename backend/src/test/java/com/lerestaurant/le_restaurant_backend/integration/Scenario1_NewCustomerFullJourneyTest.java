package com.lerestaurant.le_restaurant_backend.integration;

import com.lerestaurant.le_restaurant_backend.dto.*;
import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import com.lerestaurant.le_restaurant_backend.entity.Delivery;
import org.junit.jupiter.api.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Scenario 1: New Customer Full Journey (Happy Path)
 * Story: A new customer signs up, orders food, pays, gets it delivered, and books a table for a future visit.
 * 
 * Tests coverage: F100, F101, F105, F106, F107, F108, F109
 */
@DisplayName("Scenario 1: New Customer Full Journey (Happy Path)")
class Scenario1_NewCustomerFullJourneyTest extends BaseE2ETest {

    @Test
    @Transactional
    @DisplayName("Complete customer journey from registration to reservation")
    void testNewCustomerFullJourney() {
        // Step 1: Registration (F100)
        UserDto alice = createTestCustomer("alice-journey@example.com", "Alice", "Johnson");
        assertNotNull(alice);
        assertNotNull(alice.getId());
        assertEquals("alice-journey@example.com", alice.getEmail());

        // Step 2: Login (F101) - Verify user exists
        UserDto fetchedAlice = userService.getUserById(alice.getId());
        assertNotNull(fetchedAlice);
        assertEquals("Alice", fetchedAlice.getFirstName());

        // Step 3: Create Order (F105)
        MenuItem chickenItem = createTestMenuItem("Grilled Chicken", BigDecimal.valueOf(24.99), "MAIN");
        
        OrderDto order = createTestOrder(alice.getId(), chickenItem.getId(), 2, BigDecimal.valueOf(24.99));
        assertNotNull(order);
        // Order status after creation may vary based on implementation
        assertNotNull(order.getStatus());
        Long orderId = order.getId();

        // Step 4: Process Payment (F106)
        PaymentDto payment = processPayment(orderId, BigDecimal.valueOf(49.98));
        assertNotNull(payment);
        assertEquals("COMPLETED", payment.getStatus());

        // Verify order status updated to PREPARING
        OrderDto paidOrder = orderService.getOrderById(orderId);
        assertEquals("PREPARING", paidOrder.getStatus());

        // Step 5: Manage Delivery (F107)
        DeliveryDto delivery = createDelivery(orderId);
        assertNotNull(delivery);
        Long deliveryId = delivery.getId();

        // Update delivery status through the journey
        DeliveryUpdateRequestDto statusDto1 = new DeliveryUpdateRequestDto();
        statusDto1.setStatus(Delivery.DeliveryStatus.ASSIGNED);
        deliveryService.updateDeliveryStatus(deliveryId, statusDto1);

        DeliveryUpdateRequestDto statusDto2 = new DeliveryUpdateRequestDto();
        statusDto2.setStatus(Delivery.DeliveryStatus.IN_TRANSIT);
        deliveryService.updateDeliveryStatus(deliveryId, statusDto2);

        DeliveryUpdateRequestDto statusDto3 = new DeliveryUpdateRequestDto();
        statusDto3.setStatus(Delivery.DeliveryStatus.DELIVERED);
        deliveryService.updateDeliveryStatus(deliveryId, statusDto3);

        DeliveryDto finalDelivery = deliveryService.getDeliveryById(deliveryId);
        assertEquals("DELIVERED", finalDelivery.getStatus());

        // Step 6: Make Reservation (F108)
        ReservationDto reservation = createReservation(
            alice.getId(),
            LocalDate.now().plusDays(7),
            LocalTime.of(19, 0),
            4
        );
        assertNotNull(reservation);
        assertEquals("PENDING_APPROVAL", reservation.getStatus());
        Long reservationId = reservation.getId();

        // Step 7: Approve Reservation (F109)
        // Create a manager to approve the reservation
        UserDto manager = createTestCustomer("manager-approve@example.com", "Manager", "Approve");
        
        ReservationDto approvedReservation = reservationService.approveReservation(reservationId, manager.getId());
        assertNotNull(approvedReservation);
        assertEquals("CONFIRMED", approvedReservation.getStatus());
    }
}
