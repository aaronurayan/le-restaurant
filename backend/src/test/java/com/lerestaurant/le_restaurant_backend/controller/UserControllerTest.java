package com.lerestaurant.le_restaurant_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lerestaurant.le_restaurant_backend.dto.UserDTO;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.enums.UserRole;
import com.lerestaurant.le_restaurant_backend.enums.UserStatus;
import com.lerestaurant.le_restaurant_backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit Tests for UserController (F102 - User Management)
 * 
 * This test suite validates the REST API endpoints for user management operations
 * including CRUD operations, filtering, and status management.
 * 
 * @author Le Restaurant Development Team
 * @module F102-UserManagement
 */
@WebMvcTest(UserController.class)
@DisplayName("UserController Tests (F102)")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private User testUser1;
    private User testUser2;
    private UserDTO testUserDTO;

    @BeforeEach
    void setUp() {
        // Setup test data
        testUser1 = new User();
        testUser1.setId(1L);
        testUser1.setUsername("johndoe");
        testUser1.setEmail("john@example.com");
        testUser1.setFirstName("John");
        testUser1.setLastName("Doe");
        testUser1.setRole(UserRole.CUSTOMER);
        testUser1.setStatus(UserStatus.ACTIVE);
        testUser1.setCreatedAt(LocalDateTime.now());

        testUser2 = new User();
        testUser2.setId(2L);
        testUser2.setUsername("janesmith");
        testUser2.setEmail("jane@example.com");
        testUser2.setFirstName("Jane");
        testUser2.setLastName("Smith");
        testUser2.setRole(UserRole.STAFF);
        testUser2.setStatus(UserStatus.ACTIVE);
        testUser2.setCreatedAt(LocalDateTime.now());

        testUserDTO = new UserDTO();
        testUserDTO.setUsername("newuser");
        testUserDTO.setEmail("newuser@example.com");
        testUserDTO.setPassword("SecurePass123!");
        testUserDTO.setFirstName("New");
        testUserDTO.setLastName("User");
        testUserDTO.setRole(UserRole.CUSTOMER);
    }

    // =================================================================
    // GET /api/users - List All Users Tests
    // =================================================================
    @Nested
    @DisplayName("GET /api/users - List All Users")
    class ListUsersTests {

        @Test
        @DisplayName("Should return list of all users successfully")
        void shouldReturnAllUsers() throws Exception {
            // Given
            List<User> users = Arrays.asList(testUser1, testUser2);
            when(userService.getAllUsers()).thenReturn(users);

            // When & Then
            mockMvc.perform(get("/api/users")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(2)))
                    .andExpect(jsonPath("$[0].username", is("johndoe")))
                    .andExpect(jsonPath("$[0].email", is("john@example.com")))
                    .andExpect(jsonPath("$[1].username", is("janesmith")))
                    .andExpect(jsonPath("$[1].email", is("jane@example.com")));

            verify(userService, times(1)).getAllUsers();
        }

        @Test
        @DisplayName("Should return empty list when no users exist")
        void shouldReturnEmptyList() throws Exception {
            // Given
            when(userService.getAllUsers()).thenReturn(Arrays.asList());

            // When & Then
            mockMvc.perform(get("/api/users"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(0)));

            verify(userService, times(1)).getAllUsers();
        }
    }

    // =================================================================
    // GET /api/users/{id} - Get User by ID Tests
    // =================================================================
    @Nested
    @DisplayName("GET /api/users/{id} - Get User by ID")
    class GetUserByIdTests {

        @Test
        @DisplayName("Should return user when valid ID is provided")
        void shouldReturnUserById() throws Exception {
            // Given
            when(userService.getUserById(1L)).thenReturn(Optional.of(testUser1));

            // When & Then
            mockMvc.perform(get("/api/users/1"))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", is(1)))
                    .andExpect(jsonPath("$.username", is("johndoe")))
                    .andExpect(jsonPath("$.email", is("john@example.com")))
                    .andExpect(jsonPath("$.role", is("CUSTOMER")))
                    .andExpect(jsonPath("$.status", is("ACTIVE")));

            verify(userService, times(1)).getUserById(1L);
        }

        @Test
        @DisplayName("Should return 404 when user not found")
        void shouldReturn404WhenUserNotFound() throws Exception {
            // Given
            when(userService.getUserById(999L)).thenReturn(Optional.empty());

            // When & Then
            mockMvc.perform(get("/api/users/999"))
                    .andExpect(status().isNotFound());

            verify(userService, times(1)).getUserById(999L);
        }
    }

    // =================================================================
    // POST /api/users - Create User Tests
    // =================================================================
    @Nested
    @DisplayName("POST /api/users - Create User")
    class CreateUserTests {

        @Test
        @DisplayName("Should create new user successfully")
        void shouldCreateUser() throws Exception {
            // Given
            User createdUser = new User();
            createdUser.setId(3L);
            createdUser.setUsername(testUserDTO.getUsername());
            createdUser.setEmail(testUserDTO.getEmail());
            createdUser.setFirstName(testUserDTO.getFirstName());
            createdUser.setLastName(testUserDTO.getLastName());
            createdUser.setRole(testUserDTO.getRole());
            createdUser.setStatus(UserStatus.ACTIVE);

            when(userService.createUser(any(UserDTO.class))).thenReturn(createdUser);

            // When & Then
            mockMvc.perform(post("/api/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testUserDTO)))
                    .andDo(print())
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id", is(3)))
                    .andExpect(jsonPath("$.username", is("newuser")))
                    .andExpect(jsonPath("$.email", is("newuser@example.com")));

            verify(userService, times(1)).createUser(any(UserDTO.class));
        }

        @Test
        @DisplayName("Should return 400 when username is missing")
        void shouldReturn400WhenUsernameIsMissing() throws Exception {
            // Given
            testUserDTO.setUsername(null);

            // When & Then
            mockMvc.perform(post("/api/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testUserDTO)))
                    .andExpect(status().isBadRequest());

            verify(userService, never()).createUser(any(UserDTO.class));
        }

        @Test
        @DisplayName("Should return 400 when email is invalid")
        void shouldReturn400WhenEmailIsInvalid() throws Exception {
            // Given
            testUserDTO.setEmail("invalid-email");

            // When & Then
            mockMvc.perform(post("/api/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testUserDTO)))
                    .andExpect(status().isBadRequest());

            verify(userService, never()).createUser(any(UserDTO.class));
        }

        @Test
        @DisplayName("Should return 409 when username already exists")
        void shouldReturn409WhenUsernameExists() throws Exception {
            // Given
            when(userService.createUser(any(UserDTO.class)))
                    .thenThrow(new IllegalArgumentException("Username already exists"));

            // When & Then
            mockMvc.perform(post("/api/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testUserDTO)))
                    .andExpect(status().isConflict());

            verify(userService, times(1)).createUser(any(UserDTO.class));
        }
    }

    // =================================================================
    // PUT /api/users/{id} - Update User Tests
    // =================================================================
    @Nested
    @DisplayName("PUT /api/users/{id} - Update User")
    class UpdateUserTests {

        @Test
        @DisplayName("Should update user successfully")
        void shouldUpdateUser() throws Exception {
            // Given
            testUser1.setFirstName("Updated");
            testUser1.setLastName("Name");
            when(userService.updateUser(eq(1L), any(UserDTO.class))).thenReturn(testUser1);

            // When & Then
            mockMvc.perform(put("/api/users/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testUserDTO)))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", is(1)))
                    .andExpect(jsonPath("$.firstName", is("Updated")))
                    .andExpect(jsonPath("$.lastName", is("Name")));

            verify(userService, times(1)).updateUser(eq(1L), any(UserDTO.class));
        }

        @Test
        @DisplayName("Should return 404 when updating non-existent user")
        void shouldReturn404WhenUpdatingNonExistentUser() throws Exception {
            // Given
            when(userService.updateUser(eq(999L), any(UserDTO.class)))
                    .thenThrow(new IllegalArgumentException("User not found"));

            // When & Then
            mockMvc.perform(put("/api/users/999")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testUserDTO)))
                    .andExpect(status().isNotFound());

            verify(userService, times(1)).updateUser(eq(999L), any(UserDTO.class));
        }
    }

    // =================================================================
    // DELETE /api/users/{id} - Delete User Tests
    // =================================================================
    @Nested
    @DisplayName("DELETE /api/users/{id} - Delete User")
    class DeleteUserTests {

        @Test
        @DisplayName("Should delete user successfully")
        void shouldDeleteUser() throws Exception {
            // Given
            doNothing().when(userService).deleteUser(1L);

            // When & Then
            mockMvc.perform(delete("/api/users/1"))
                    .andExpect(status().isNoContent());

            verify(userService, times(1)).deleteUser(1L);
        }

        @Test
        @DisplayName("Should return 404 when deleting non-existent user")
        void shouldReturn404WhenDeletingNonExistentUser() throws Exception {
            // Given
            doThrow(new IllegalArgumentException("User not found"))
                    .when(userService).deleteUser(999L);

            // When & Then
            mockMvc.perform(delete("/api/users/999"))
                    .andExpect(status().isNotFound());

            verify(userService, times(1)).deleteUser(999L);
        }
    }

    // =================================================================
    // PATCH /api/users/{id}/status - Update User Status Tests
    // =================================================================
    @Nested
    @DisplayName("PATCH /api/users/{id}/status - Update User Status")
    class UpdateUserStatusTests {

        @Test
        @DisplayName("Should update user status to SUSPENDED")
        void shouldUpdateStatusToSuspended() throws Exception {
            // Given
            testUser1.setStatus(UserStatus.SUSPENDED);
            when(userService.updateUserStatus(1L, UserStatus.SUSPENDED)).thenReturn(testUser1);

            // When & Then
            mockMvc.perform(patch("/api/users/1/status")
                            .param("status", "SUSPENDED"))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status", is("SUSPENDED")));

            verify(userService, times(1)).updateUserStatus(1L, UserStatus.SUSPENDED);
        }

        @Test
        @DisplayName("Should update user status to ACTIVE")
        void shouldUpdateStatusToActive() throws Exception {
            // Given
            testUser1.setStatus(UserStatus.ACTIVE);
            when(userService.updateUserStatus(1L, UserStatus.ACTIVE)).thenReturn(testUser1);

            // When & Then
            mockMvc.perform(patch("/api/users/1/status")
                            .param("status", "ACTIVE"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status", is("ACTIVE")));

            verify(userService, times(1)).updateUserStatus(1L, UserStatus.ACTIVE);
        }

        @Test
        @DisplayName("Should return 400 when status is invalid")
        void shouldReturn400WhenStatusIsInvalid() throws Exception {
            // When & Then
            mockMvc.perform(patch("/api/users/1/status")
                            .param("status", "INVALID_STATUS"))
                    .andExpect(status().isBadRequest());

            verify(userService, never()).updateUserStatus(anyLong(), any(UserStatus.class));
        }
    }

    // =================================================================
    // GET /api/users/filter - Filter Users Tests
    // =================================================================
    @Nested
    @DisplayName("GET /api/users/filter - Filter Users")
    class FilterUsersTests {

        @Test
        @DisplayName("Should filter users by role")
        void shouldFilterUsersByRole() throws Exception {
            // Given
            when(userService.filterUsers(eq(UserRole.CUSTOMER), any(), any()))
                    .thenReturn(Arrays.asList(testUser1));

            // When & Then
            mockMvc.perform(get("/api/users/filter")
                            .param("role", "CUSTOMER"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].role", is("CUSTOMER")));

            verify(userService, times(1)).filterUsers(eq(UserRole.CUSTOMER), any(), any());
        }

        @Test
        @DisplayName("Should filter users by status")
        void shouldFilterUsersByStatus() throws Exception {
            // Given
            when(userService.filterUsers(any(), eq(UserStatus.ACTIVE), any()))
                    .thenReturn(Arrays.asList(testUser1, testUser2));

            // When & Then
            mockMvc.perform(get("/api/users/filter")
                            .param("status", "ACTIVE"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(2)));

            verify(userService, times(1)).filterUsers(any(), eq(UserStatus.ACTIVE), any());
        }

        @Test
        @DisplayName("Should filter users by search term")
        void shouldFilterUsersBySearchTerm() throws Exception {
            // Given
            when(userService.filterUsers(any(), any(), eq("john")))
                    .thenReturn(Arrays.asList(testUser1));

            // When & Then
            mockMvc.perform(get("/api/users/filter")
                            .param("search", "john"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].username", containsString("john")));

            verify(userService, times(1)).filterUsers(any(), any(), eq("john"));
        }

        @Test
        @DisplayName("Should apply multiple filters")
        void shouldApplyMultipleFilters() throws Exception {
            // Given
            when(userService.filterUsers(eq(UserRole.CUSTOMER), eq(UserStatus.ACTIVE), eq("john")))
                    .thenReturn(Arrays.asList(testUser1));

            // When & Then
            mockMvc.perform(get("/api/users/filter")
                            .param("role", "CUSTOMER")
                            .param("status", "ACTIVE")
                            .param("search", "john"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)));

            verify(userService, times(1))
                    .filterUsers(eq(UserRole.CUSTOMER), eq(UserStatus.ACTIVE), eq("john"));
        }
    }

    // =================================================================
    // Integration / Edge Case Tests
    // =================================================================
    @Nested
    @DisplayName("Edge Cases and Validation")
    class EdgeCaseTests {

        @Test
        @DisplayName("Should handle very long usernames gracefully")
        void shouldHandleLongUsernames() throws Exception {
            // Given
            String longUsername = "a".repeat(256);
            testUserDTO.setUsername(longUsername);

            // When & Then
            mockMvc.perform(post("/api/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testUserDTO)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should validate password strength")
        void shouldValidatePasswordStrength() throws Exception {
            // Given
            testUserDTO.setPassword("weak");

            // When & Then
            mockMvc.perform(post("/api/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testUserDTO)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should not allow duplicate emails")
        void shouldNotAllowDuplicateEmails() throws Exception {
            // Given
            when(userService.createUser(any(UserDTO.class)))
                    .thenThrow(new IllegalArgumentException("Email already exists"));

            // When & Then
            mockMvc.perform(post("/api/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testUserDTO)))
                    .andExpect(status().isConflict());
        }
    }
}
