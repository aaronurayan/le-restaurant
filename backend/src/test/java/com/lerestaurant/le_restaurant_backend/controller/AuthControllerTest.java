package com.lerestaurant.le_restaurant_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lerestaurant.le_restaurant_backend.dto.AuthRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.UserDto;
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

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

/**
 * Unit Tests for AuthController (F102 - User Authentication)
 *
 * This test suite validates the authentication endpoints for user login.
 *
 * @author Le Restaurant Development Team
 * @module F102-UserAuthentication
 */
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("AuthController Tests (F102)")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private UserDto testUserDto;
    private AuthRequestDto testAuthRequest;

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

        testAuthRequest = new AuthRequestDto();
        testAuthRequest.setEmail("john@example.com");
        testAuthRequest.setPassword("SecurePass123!");
    }

    // =================================================================
    // POST /api/auth/login - Login Tests
    // =================================================================
    @Nested
    @DisplayName("POST /api/auth/login - Login")
    class LoginTests {

        @Test
        @DisplayName("Should login user successfully")
        void shouldLoginUserSuccessfully() throws Exception {
            // Given
            when(userService.authenticateUser("john@example.com", "SecurePass123!")).thenReturn(testUserDto);

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(testAuthRequest)))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.user.id", is(1)))
                    .andExpect(jsonPath("$.user.email", is("john@example.com")))
                    .andExpect(jsonPath("$.user.firstName", is("John")))
                    .andExpect(jsonPath("$.token", is("mock-token")));

            verify(userService, times(1)).authenticateUser("john@example.com", "SecurePass123!");
        }

        @Test
        @DisplayName("Should return 401 when invalid credentials")
        void shouldReturn401WhenInvalidCredentials() throws Exception {
            // Given
            when(userService.authenticateUser("john@example.com", "WrongPass123!"))
                    .thenThrow(new RuntimeException("Invalid email or password"));

            testAuthRequest.setPassword("WrongPass123!");

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(testAuthRequest)))
                    .andExpect(status().isUnauthorized());

            verify(userService, times(1)).authenticateUser("john@example.com", "WrongPass123!");
        }

        @Test
        @DisplayName("Should return 404 when user not found")
        void shouldReturn404WhenUserNotFound() throws Exception {
            // Given
            when(userService.authenticateUser("nonexistent@example.com", "SecurePass123!"))
                    .thenThrow(new RuntimeException("User not found"));

            testAuthRequest.setEmail("nonexistent@example.com");

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(testAuthRequest)))
                    .andExpect(status().isNotFound());

            verify(userService, times(1)).authenticateUser("nonexistent@example.com", "SecurePass123!");
        }
    }
}
