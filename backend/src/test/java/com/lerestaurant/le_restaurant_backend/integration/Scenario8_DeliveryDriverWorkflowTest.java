package com.lerestaurant.le_restaurant_backend.integration;

import com.lerestaurant.le_restaurant_backend.dto.*;
import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import org.junit.jupiter.api.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Scenario 8: Delivery Driver Workflow
 * Story: A manager assigns a delivery, and the driver updates the status through the journey.
 * 
 * Tests coverage: F105, F106, F107
 */
@DisplayName("Scenario 8: Delivery Driver Workflow")
class Scenario8_DeliveryDriverWorkflowTest extends BaseE2ETest {

    @Test
    @Transactional
    @DisplayName("Delivery status workflow from assignment to completion")
    void testDeliveryDriverWorkflow() {
        // Setup
        UserDto customer = createTestCustomer("delivery-test@example.com", "Delivery", "Test");
        MenuItem pizza = createTestMenuItem("Pizza", BigDecimal.valueOf(18.00), "MAIN");

        // Step 1: Order Confirmed (F105, F106)
        OrderDto order = createTestOrder(customer.getId(), pizza.getId(), 1, BigDecimal.valueOf(18.00));
        assertNotNull(order);
        Long orderId = order.getId();

        PaymentDto payment = processPayment(orderId, BigDecimal.valueOf(18.00));
        assertNotNull(payment);
        assertEquals("COMPLETED", payment.getStatus());

        // Create delivery
        DeliveryDto delivery = createDelivery(orderId);
        assertNotNull(delivery);
        Long deliveryId = delivery.getId();

        // Step 2: Manager Assigns Driver (F107)
        DeliveryUpdateRequestDto assignDto = new DeliveryUpdateRequestDto();
        assignDto.setDriverId("DRV-001");
        assignDto.setDriverName("John Doe");
        
        DeliveryDto assignedDelivery = deliveryService.updateDelivery(deliveryId, assignDto);
        assertNotNull(assignedDelivery);
        assertEquals("DRV-001", assignedDelivery.getDriverId());

        // Step 3: Driver Updates Status (F107)
        DeliveryUpdateRequestDto statusDto1 = new DeliveryUpdateRequestDto();
        statusDto1.setStatus("ASSIGNED");
        deliveryService.updateDelivery(deliveryId, statusDto1);
        DeliveryDto assignedStatus = deliveryService.getDeliveryById(deliveryId);
        assertEquals("ASSIGNED", assignedStatus.getStatus());

        DeliveryUpdateRequestDto statusDto2 = new DeliveryUpdateRequestDto();
        statusDto2.setStatus("OUT_FOR_DELIVERY");
        deliveryService.updateDelivery(deliveryId, statusDto2);
        DeliveryDto outForDelivery = deliveryService.getDeliveryById(deliveryId);
        assertEquals("OUT_FOR_DELIVERY", outForDelivery.getStatus());

        DeliveryUpdateRequestDto statusDto3 = new DeliveryUpdateRequestDto();
        statusDto3.setStatus("DELIVERED");
        deliveryService.updateDelivery(deliveryId, statusDto3);
        DeliveryDto deliveredStatus = deliveryService.getDeliveryById(deliveryId);
        assertEquals("DELIVERED", deliveredStatus.getStatus());
    }
}
