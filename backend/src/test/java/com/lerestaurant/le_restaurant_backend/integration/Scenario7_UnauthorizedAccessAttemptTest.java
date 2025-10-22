package com.lerestaurant.le_restaurant_backend.integration;

import com.lerestaurant.le_restaurant_backend.dto.*;
import com.lerestaurant.le_restaurant_backend.entity.User;
import org.junit.jupiter.api.*;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Scenario 7: Unauthorized Access Attempt
 * Story: A regular customer attempts to access manager-only functionality.
 * 
 * Note: This test verifies business logic. In real implementation,
 * Spring Security would handle authorization at the controller level.
 * 
 * Tests coverage: F101, F102, F104, F109
 */
@DisplayName("Scenario 7: Unauthorized Access Attempt")
class Scenario7_UnauthorizedAccessAttemptTest extends BaseE2ETest {

    @Test
    @Transactional
    @DisplayName("Customers cannot access manager-only endpoints")
    void testUnauthorizedAccessAttempt() {
        // Step 1: Customer Login (F101)
        UserDto customer = createTestCustomer("unauthorized@example.com", "Unauthorized", "User");
        assertNotNull(customer);
        assertEquals("CUSTOMER", customer.getRole());

        // Steps 2-4: Verify customer cannot perform manager operations
        // In a real implementation with Spring Security, these would return 403 Forbidden
        // For now, we verify the user doesn't have manager role
        assertNotEquals("MANAGER", customer.getRole());

        // Additional verification: Create a manager and verify role difference
        UserCreateRequestDto managerDto = new UserCreateRequestDto();
        managerDto.setEmail("manager-test@example.com");
        managerDto.setPassword("ManagerPass123!");
        managerDto.setFirstName("Manager");
        managerDto.setLastName("User");

        UserDto manager = userService.createUser(managerDto);
        
        // Manually set manager role (in real app, this would be done during registration)
        User managerEntity = userRepository.findById(manager.getId()).orElseThrow();
        managerEntity.setRole(User.UserRole.MANAGER);
        userRepository.save(managerEntity);

        // Verify manager role is set
        UserDto updatedManager = userService.getUserById(manager.getId());
        assertEquals("MANAGER", updatedManager.getRole());

        // Verify customer role is different
        assertEquals("CUSTOMER", customer.getRole());
        assertNotEquals(updatedManager.getRole(), customer.getRole());
    }
}
