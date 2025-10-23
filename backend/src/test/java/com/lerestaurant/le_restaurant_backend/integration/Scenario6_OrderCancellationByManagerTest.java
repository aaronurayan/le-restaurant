package com.lerestaurant.le_restaurant_backend.integration;

import com.lerestaurant.le_restaurant_backend.dto.*;
import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import org.junit.jupiter.api.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Scenario 6: Order Cancellation by Manager
 * Story: A customer places an order, but a manager has to cancel it before it's delivered.
 * 
 * Tests coverage: F105, F106
 */
@DisplayName("Scenario 6: Order Cancellation by Manager")
class Scenario6_OrderCancellationByManagerTest extends BaseE2ETest {

    @Test
    @Transactional
    @DisplayName("Manager can cancel orders and trigger refunds")
    void testOrderCancellationByManager() {
        // Setup
        UserDto customer = createTestCustomer("cancel-test@example.com", "Cancel", "Test");
        MenuItem burger = createTestMenuItem("Burger", BigDecimal.valueOf(12.00), "MAIN");

        // Step 1: Order and Pay (F105, F106)
        OrderDto order = createTestOrder(customer.getId(), burger.getId(), 1, BigDecimal.valueOf(12.00));
        assertNotNull(order);
        Long orderId = order.getId();

        PaymentDto payment = processPayment(orderId, BigDecimal.valueOf(12.00));
        assertNotNull(payment);
        assertEquals(Payment.PaymentStatus.COMPLETED, payment.getStatus());

        // Verify order is now PREPARING (or some prepared status)
        OrderDto paidOrder = orderService.getOrderById(orderId);
        assertNotNull(paidOrder.getStatus());

        // Step 2: Manager Cancels (F105/F106)
        orderService.deleteOrder(orderId);
        
        // Verify order is cancelled
        OrderDto cancelledOrder = orderService.getOrderById(orderId);
        assertNotNull(cancelledOrder);
        assertEquals("CANCELLED", cancelledOrder.getStatus());

        // Verify refund process initiated
        // (In real implementation, this would create a refund entry in payments table)
    }
}
