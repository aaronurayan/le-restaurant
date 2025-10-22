package com.lerestaurant.le_restaurant_backend.integration;

import com.lerestaurant.le_restaurant_backend.dto.*;
import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import org.junit.jupiter.api.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Scenario 10: Full Refund Process
 * Story: A customer's order is delivered incorrectly, and a manager issues a full refund.
 * 
 * Tests coverage: F105, F106, F107
 */
@DisplayName("Scenario 10: Full Refund Process")
class Scenario10_FullRefundProcessTest extends BaseE2ETest {

    @Test
    @Transactional
    @DisplayName("Manager can issue full refunds for delivered orders")
    void testFullRefundProcess() {
        // Setup
        UserDto customer = createTestCustomer("refund-test@example.com", "Refund", "Test");
        MenuItem steak = createTestMenuItem("Steak", BigDecimal.valueOf(35.00), "MAIN");

        // Create order and pay
        OrderDto order = createTestOrder(customer.getId(), steak.getId(), 1, BigDecimal.valueOf(35.00));
        assertNotNull(order);
        Long orderId = order.getId();

        PaymentDto payment = processPayment(orderId, BigDecimal.valueOf(35.00));
        assertNotNull(payment);
        assertEquals("COMPLETED", payment.getStatus());
        Long paymentId = payment.getId();

        // Create delivery
        DeliveryDto delivery = createDelivery(orderId);
        assertNotNull(delivery);

        // Step 1: Order Delivered (F107)
        DeliveryUpdateRequestDto statusDto1 = new DeliveryUpdateRequestDto();
        statusDto1.setStatus("ASSIGNED");
        deliveryService.updateDelivery(delivery.getId(), statusDto1);

        DeliveryUpdateRequestDto statusDto2 = new DeliveryUpdateRequestDto();
        statusDto2.setStatus("OUT_FOR_DELIVERY");
        deliveryService.updateDelivery(delivery.getId(), statusDto2);

        DeliveryUpdateRequestDto statusDto3 = new DeliveryUpdateRequestDto();
        statusDto3.setStatus("DELIVERED");
        deliveryService.updateDelivery(delivery.getId(), statusDto3);

        DeliveryDto deliveredDelivery = deliveryService.getDeliveryById(delivery.getId());
        assertEquals("DELIVERED", deliveredDelivery.getStatus());

        // Step 2: Customer Complaint (implied)

        // Step 3: Manager Issues Refund (F106)
        PaymentDto refundedPayment = paymentService.processRefund(paymentId);
        assertNotNull(refundedPayment);
        assertEquals("REFUNDED", refundedPayment.getStatus());

        // Verify order status updated
        OrderDto refundedOrder = orderService.getOrderById(orderId);
        assertEquals("REFUNDED", refundedOrder.getStatus());
    }
}
