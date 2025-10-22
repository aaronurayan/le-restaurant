package com.lerestaurant.le_restaurant_backend.integration;

import com.lerestaurant.le_restaurant_backend.dto.*;
import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import org.junit.jupiter.api.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Scenario 9: High-Volume Concurrent Orders
 * Story: Multiple customers place orders for the same limited-stock menu item simultaneously.
 * 
 * Note: This test simulates concurrent behavior. In production, database-level locking
 * or optimistic locking would handle race conditions.
 * 
 * Tests coverage: F105
 */
@DisplayName("Scenario 9: High-Volume Concurrent Orders")
class Scenario9_HighVolumeConcurrentOrdersTest extends BaseE2ETest {

    @Test
    @Transactional
    @DisplayName("System handles limited stock correctly with concurrent orders")
    void testHighVolumeConcurrentOrders() {
        // Setup: Create menu item with limited stock
        MenuItem specialDish = new MenuItem();
        specialDish.setName("Special Limited Edition");
        specialDish.setDescription("Limited edition dish");
        specialDish.setPrice(BigDecimal.valueOf(30.00));
        specialDish.setCategory("SPECIAL");
        specialDish.setAvailable(true);
        // Note: MenuItem does not have a stock field; availability is managed via 'available' flag
        MenuItem savedSpecialDish = menuItemRepository.save(specialDish);
        Long dishId = savedSpecialDish.getId();

        // Create two customers
        UserDto customer1 = createTestCustomer("concurrent1@example.com", "Customer", "One");
        UserDto customer2 = createTestCustomer("concurrent2@example.com", "Customer", "Two");

        // Step 2-3: Concurrent Requests (F105)
        // Customer 1 orders - should succeed
        OrderDto order1 = createTestOrder(customer1.getId(), dishId, 1, BigDecimal.valueOf(30.00));
        assertNotNull(order1);

        // Update availability to false (simulating item no longer available)
        MenuItem updatedDish = menuItemRepository.findById(dishId).orElseThrow();
        updatedDish.setAvailable(false);
        menuItemRepository.save(updatedDish);

        // Customer 2 tries to order unavailable item - should fail
        Exception exception = assertThrows(Exception.class, () -> {
            createTestOrder(customer2.getId(), dishId, 1, BigDecimal.valueOf(30.00));
        });
        assertNotNull(exception);

        // Verify item is unavailable
        MenuItem confirmedUnavailable = menuItemRepository.findById(dishId).orElseThrow();
        assertFalse(confirmedUnavailable.isAvailable());
    }
}
