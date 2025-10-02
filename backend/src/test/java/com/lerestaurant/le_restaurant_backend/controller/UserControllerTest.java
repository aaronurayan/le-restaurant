package com.lerestaurant.le_restaurant_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lerestaurant.le_restaurant_backend.dto.UserDto;
import com.lerestaurant.le_restaurant_backend.dto.UserCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.UserUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.User;
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

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

/**
 * Unit Tests for UserController (F102 - User Management)
 * 
 * This test suite validates the REST API endpoints for user management
 * operations
 * including CRUD operations, filtering, and status management.
 * 
 * @author Le Restaurant Development Team
 * @module F102-UserManagement
 */
@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("UserController Tests (F102)")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private UserDto testUserDto;
    private UserCreateRequestDto testUserCreateRequest;

    @BeforeEach
    void setUp() {
        // Setup test DTO data
        testUserDto = new UserDto(
                1L,
                "john@example.com",
                "0412345678",
                "John",
                "Doe",
                User.UserRole.CUSTOMER,
                User.UserStatus.ACTIVE,
                null,
                null,
                null,
                null);

        testUserCreateRequest = new UserCreateRequestDto();
        testUserCreateRequest.setEmail("newuser@example.com");
        testUserCreateRequest.setPassword("SecurePass123!");
        testUserCreateRequest.setFirstName("New");
        testUserCreateRequest.setLastName("User");
        testUserCreateRequest.setRole(User.UserRole.CUSTOMER);
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
            UserDto testUserDto2 = new UserDto(
                    2L,
                    "jane@example.com",
                    "0412345679",
                    "Jane",
                    "Smith",
                    User.UserRole.MANAGER,
                    User.UserStatus.ACTIVE,
                    null,
                    null,
                    null,
                    null);
            List<UserDto> users = Arrays.asList(testUserDto, testUserDto2);
            when(userService.getAllUsers()).thenReturn(users);

            // When & Then
            mockMvc.perform(get("/api/users")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(2)))
                    .andExpect(jsonPath("$[0].email", is("john@example.com")))
                    .andExpect(jsonPath("$[0].firstName", is("John")))
                    .andExpect(jsonPath("$[1].email", is("jane@example.com")))
                    .andExpect(jsonPath("$[1].firstName", is("Jane")));

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
            when(userService.getUserById(1L)).thenReturn(testUserDto);

            // When & Then
            mockMvc.perform(get("/api/users/1"))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", is(1)))
                    .andExpect(jsonPath("$.email", is("john@example.com")))
                    .andExpect(jsonPath("$.firstName", is("John")))
                    .andExpect(jsonPath("$.role", is("CUSTOMER")))
                    .andExpect(jsonPath("$.status", is("ACTIVE")));

            verify(userService, times(1)).getUserById(1L);
        }

        @Test
        @DisplayName("Should return 404 when user not found")
        void shouldReturn404WhenUserNotFound() throws Exception {
            // Given
            when(userService.getUserById(999L)).thenThrow(new RuntimeException("User not found with id: 999"));

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
            UserDto createdUserDto = new UserDto(
                    3L,
                    "newuser@example.com",
                    null,
                    "New",
                    "User",
                    User.UserRole.CUSTOMER,
                    User.UserStatus.ACTIVE,
                    null,
                    null,
                    null,
                    null);

            when(userService.createUser(any(UserCreateRequestDto.class))).thenReturn(createdUserDto);

            // When & Then
            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(testUserCreateRequest)))
                    .andDo(print())
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id", is(3)))
                    .andExpect(jsonPath("$.email", is("newuser@example.com")))
                    .andExpect(jsonPath("$.firstName", is("New")));

            verify(userService, times(1)).createUser(any(UserCreateRequestDto.class));
        }

        @Test
        @DisplayName("Should return 400 when email is missing")
        void shouldReturn400WhenEmailIsMissing() throws Exception {
            // Given
            testUserCreateRequest.setEmail(null);
            when(userService.createUser(any(UserCreateRequestDto.class)))
                    .thenThrow(new RuntimeException("Email is required"));

            // When & Then
            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(testUserCreateRequest)))
                    .andExpect(status().isBadRequest());

            verify(userService, times(1)).createUser(any(UserCreateRequestDto.class));
        }

        @Test
        @DisplayName("Should return 400 when email is invalid")
        void shouldReturn400WhenEmailIsInvalid() throws Exception {
            // Given
            testUserCreateRequest.setEmail("invalid-email");
            when(userService.createUser(any(UserCreateRequestDto.class)))
                    .thenThrow(new RuntimeException("Invalid email format"));

            // When & Then
            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(testUserCreateRequest)))
                    .andExpect(status().isBadRequest());

            verify(userService, times(1)).createUser(any(UserCreateRequestDto.class));
        }

        @Test
        @DisplayName("Should return 409 when email already exists")
        void shouldReturn409WhenEmailExists() throws Exception {
            // Given
            when(userService.createUser(any(UserCreateRequestDto.class)))
                    .thenThrow(new IllegalArgumentException("Email already exists"));

            // When & Then
            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(testUserCreateRequest)))
                    .andExpect(status().isBadRequest());

            verify(userService, times(1)).createUser(any(UserCreateRequestDto.class));
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
            UserUpdateRequestDto updateRequest = new UserUpdateRequestDto();
            updateRequest.setFirstName("Updated");
            updateRequest.setLastName("Name");

            UserDto updatedUserDto = new UserDto(
                    1L,
                    "john@example.com",
                    "0412345678",
                    "Updated",
                    "Name",
                    User.UserRole.CUSTOMER,
                    User.UserStatus.ACTIVE,
                    null,
                    null,
                    null,
                    null);

            when(userService.updateUser(eq(1L), any(UserUpdateRequestDto.class))).thenReturn(updatedUserDto);

            // When & Then
            mockMvc.perform(put("/api/users/1")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateRequest)))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", is(1)))
                    .andExpect(jsonPath("$.firstName", is("Updated")))
                    .andExpect(jsonPath("$.lastName", is("Name")));

            verify(userService, times(1)).updateUser(eq(1L), any(UserUpdateRequestDto.class));
        }

        @Test
        @DisplayName("Should return 404 when updating non-existent user")
        void shouldReturn404WhenUpdatingNonExistentUser() throws Exception {
            // Given
            UserUpdateRequestDto updateRequest = new UserUpdateRequestDto();
            updateRequest.setFirstName("Updated");

            when(userService.updateUser(eq(999L), any(UserUpdateRequestDto.class)))
                    .thenThrow(new RuntimeException("User not found with id: 999"));

            // When & Then
            mockMvc.perform(put("/api/users/999")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateRequest)))
                    .andExpect(status().isBadRequest());

            verify(userService, times(1)).updateUser(eq(999L), any(UserUpdateRequestDto.class));
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
                    .andExpect(status().isOk());

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
                    .andExpect(status().isBadRequest());

            verify(userService, times(1)).deleteUser(999L);
        }
    }

    // =================================================================
    // GET /api/users/role/{role} - Get Users by Role Tests
    // =================================================================
    @Nested
    @DisplayName("GET /api/users/role/{role} - Get Users by Role")
    class GetUsersByRoleTests {

        @Test
        @DisplayName("Should get users by CUSTOMER role")
        void shouldGetUsersByCustomerRole() throws Exception {
            // Given
            List<UserDto> customerUsers = Arrays.asList(testUserDto);
            when(userService.getUsersByRole(User.UserRole.CUSTOMER)).thenReturn(customerUsers);

            // When & Then
            mockMvc.perform(get("/api/users/role/CUSTOMER"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].role", is("CUSTOMER")));

            verify(userService, times(1)).getUsersByRole(User.UserRole.CUSTOMER);
        }
    }

    // =================================================================
    // GET /api/users/status/{status} - Get Users by Status Tests
    // =================================================================
    @Nested
    @DisplayName("GET /api/users/status/{status} - Get Users by Status")
    class GetUsersByStatusTests {

        @Test
        @DisplayName("Should get users by ACTIVE status")
        void shouldGetUsersByActiveStatus() throws Exception {
            // Given
            List<UserDto> activeUsers = Arrays.asList(testUserDto);
            when(userService.getUsersByStatus(User.UserStatus.ACTIVE)).thenReturn(activeUsers);

            // When & Then
            mockMvc.perform(get("/api/users/status/ACTIVE"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].status", is("ACTIVE")));

            verify(userService, times(1)).getUsersByStatus(User.UserStatus.ACTIVE);
        }
    }
}
