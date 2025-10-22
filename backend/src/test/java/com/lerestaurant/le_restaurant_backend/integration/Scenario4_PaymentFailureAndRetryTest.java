package com.lerestaurant.le_restaurant_backend.integration;

import com.lerestaurant.le_restaurant_backend.dto.*;
import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import org.junit.jupiter.api.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Scenario 4: Payment Failure and Retry
 * Story: A customer's payment fails, they try again, and the order is processed.
 * 
 * Tests coverage: F105, F106
 */
@DisplayName("Scenario 4: Payment Failure and Retry")
class Scenario4_PaymentFailureAndRetryTest extends BaseE2ETest {

    @Test
    @Transactional
    @DisplayName("Customer can retry payment after initial failure")
    void testPaymentFailureAndRetry() {
        // Setup
        UserDto customer = createTestCustomer("payment-retry@example.com", "Payment", "Tester");
        MenuItem burger = createTestMenuItem("Burger", BigDecimal.valueOf(15.00), "MAIN");

        // Step 1: Create Order (F105)
        OrderDto order = createTestOrder(customer.getId(), burger.getId(), 1, BigDecimal.valueOf(15.00));
        assertNotNull(order);
        assertEquals("PENDING_PAYMENT", order.getStatus());
        Long orderId = order.getId();

        // Step 2: Payment Fails (F106)
        PaymentRequestDto failedPaymentDto = new PaymentRequestDto();
        failedPaymentDto.setOrderId(orderId);
        failedPaymentDto.setAmount(BigDecimal.valueOf(15.00));
        failedPaymentDto.setPaymentMethod("INVALID_CARD");

        // Attempting invalid payment should fail gracefully
        // (Implementation may vary based on payment service logic)
        Exception paymentException = assertThrows(Exception.class, () -> {
            paymentService.createPayment(failedPaymentDto);
        });
        assertNotNull(paymentException);

        // Verify order still PENDING_PAYMENT
        OrderDto stillPendingOrder = orderService.getOrderById(orderId);
        assertEquals("PENDING_PAYMENT", stillPendingOrder.getStatus());

        // Step 3: Payment Succeeds (F106)
        PaymentDto successPayment = processPayment(orderId, BigDecimal.valueOf(15.00));
        assertNotNull(successPayment);
        assertEquals("COMPLETED", successPayment.getStatus());

        // Verify order status updated to PREPARING
        OrderDto paidOrder = orderService.getOrderById(orderId);
        assertEquals("PREPARING", paidOrder.getStatus());
    }
}
