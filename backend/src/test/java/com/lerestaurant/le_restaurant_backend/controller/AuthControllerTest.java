package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.AuthRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.UserDto;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.service.PasswordResetService;
import com.lerestaurant.le_restaurant_backend.service.UserService;
import com.lerestaurant.le_restaurant_backend.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * AuthController Unit Tests
 * 
 * Tests for authentication endpoints including:
 * - Login functionality
 * - Registration functionality
 * - Error handling
 * - Validation
 */
@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    // AuthController constructor dependencies + the JwtAuthenticationFilter (a Filter bean
    // auto-included by @WebMvcTest) all need these beans present, or the context fails to load.
    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private PasswordResetService passwordResetService;

    @Autowired
    private ObjectMapper objectMapper;

    private AuthRequestDto validLoginRequest;
    private UserDto mockUserDto;

    @BeforeEach
    void setUp() {
        validLoginRequest = new AuthRequestDto();
        validLoginRequest.setEmail("customer@lerestaurant.com");
        validLoginRequest.setPassword("password123");

        mockUserDto = new UserDto();
        mockUserDto.setId(1L);
        mockUserDto.setEmail("customer@lerestaurant.com");
        mockUserDto.setFirstName("John");
        mockUserDto.setLastName("Doe");
        // Role is required: AuthController.login calls user.getRole().toString() when
        // generating the JWT; a null role would NPE and surface as a 401.
        mockUserDto.setRole(User.UserRole.CUSTOMER);
    }

    @Test
    void testLogin_Success() throws Exception {
        // Arrange
        when(userService.authenticateUser(anyString(), anyString())).thenReturn(mockUserDto);
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("mock.jwt.token");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validLoginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.user.email").value("customer@lerestaurant.com"))
                .andExpect(jsonPath("$.token").exists());

        verify(userService, times(1)).authenticateUser(anyString(), anyString());
    }

    @Test
    void testLogin_InvalidCredentials() throws Exception {
        // Arrange
        when(userService.authenticateUser(anyString(), anyString()))
                .thenThrow(new RuntimeException("Invalid credentials"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validLoginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").exists());

        verify(userService, times(1)).authenticateUser(anyString(), anyString());
    }

    @Test
    void testLogin_InvalidEmail() throws Exception {
        // Arrange
        AuthRequestDto invalidRequest = new AuthRequestDto();
        invalidRequest.setEmail("invalid-email");
        invalidRequest.setPassword("password123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).authenticateUser(anyString(), anyString());
    }

    @Test
    void testLogin_EmptyPassword() throws Exception {
        // Arrange
        AuthRequestDto invalidRequest = new AuthRequestDto();
        invalidRequest.setEmail("customer@lerestaurant.com");
        invalidRequest.setPassword("");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).authenticateUser(anyString(), anyString());
    }

    @Test
    void testLogin_MissingFields() throws Exception {
        // Arrange
        AuthRequestDto invalidRequest = new AuthRequestDto();

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).authenticateUser(anyString(), anyString());
    }
}

