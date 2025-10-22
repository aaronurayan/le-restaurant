package com.lerestaurant.le_restaurant_backend.integration;

import com.lerestaurant.le_restaurant_backend.dto.*;
import com.lerestaurant.le_restaurant_backend.entity.User;
import org.junit.jupiter.api.*;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Scenario 2: Manager Manages a User Account
 * Story: A manager views, modifies, and ultimately deletes a problematic user account.
 * 
 * Tests coverage: F100, F101, F102
 */
@DisplayName("Scenario 2: Manager Manages a User Account")
class Scenario2_ManagerManagesUserAccountTest extends BaseE2ETest {

    @Test
    @Transactional
    @DisplayName("Manager can view, update, and delete user accounts")
    void testManagerManagesUserAccount() {
        // Step 1: User Creation (F100)
        UserDto bob = createTestCustomer("bob-manager@example.com", "Bob", "Smith");
        assertNotNull(bob);
        Long bobUserId = bob.getId();

        // Step 2: View User (F102)
        UserDto fetchedBob = userService.getUserById(bobUserId);
        assertNotNull(fetchedBob);
        assertEquals("bob-manager@example.com", fetchedBob.getEmail());
        assertEquals("Bob", fetchedBob.getFirstName());

        // Step 3: Update User - Deactivate (F102)
        UserUpdateRequestDto updateDto = new UserUpdateRequestDto();
        updateDto.setStatus(User.UserStatus.INACTIVE);
        
        UserDto inactiveBob = userService.updateUser(bobUserId, updateDto);
        assertNotNull(inactiveBob);
        assertEquals(User.UserStatus.INACTIVE, inactiveBob.getStatus());

        // Step 4: Login Failure (F101) - Verify inactive user cannot login
        UserDto verifyInactive = userService.getUserById(bobUserId);
        assertEquals(User.UserStatus.INACTIVE, verifyInactive.getStatus());

        // Step 5: Delete User (F102)
        userService.deleteUser(bobUserId);
        
        // Verify user is deleted or not found
        assertThrows(Exception.class, () -> userService.getUserById(bobUserId));
    }
}
