package com.lerestaurant.le_restaurant_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lerestaurant.le_restaurant_backend.dto.AuthRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.UserCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.UserDto;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest({ AuthController.class, UserController.class })
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("User Auth & Registration Controller Tests")
public class UserAuthAndRegistrationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    // --- Auth (Login) Test Data ---
    private UserDto testUserDto;
    private AuthRequestDto authRequest;

    // --- Registration Test Data ---
    private UserCreateRequestDto createReq;
    private UserDto createdDto;

    @BeforeEach
    void setUp() {
        // Auth test data
        testUserDto = new UserDto(
                1L,
                "john@example.com",
                "0412345678",
                "John",
                "Doe",
                User.UserRole.CUSTOMER,
                User.UserStatus.ACTIVE,
                OffsetDateTime.now(),
                null,
                null,
                null);
        authRequest = new AuthRequestDto();
        authRequest.setEmail("john@example.com");
        authRequest.setPassword("SecurePass123!");

        // Registration test data
        createReq = new UserCreateRequestDto();
        createReq.setEmail("newuser@example.com");
        createReq.setPassword("SecurePass123!");
        createReq.setFirstName("New");
        createReq.setLastName("User");
        createReq.setRole(User.UserRole.CUSTOMER);

        createdDto = new UserDto(3L, "newuser@example.com", null, "New", "User",
                User.UserRole.CUSTOMER, User.UserStatus.ACTIVE, null, null, null, null);
    }

    @Nested
    @DisplayName("AuthController - Login")
    class AuthControllerLogin {
        @Test
        @DisplayName("POST /api/auth/login - success returns user and token")
        void loginSuccess() throws Exception {
            when(userService.authenticateUser("john@example.com", "SecurePass123!")).thenReturn(testUserDto);
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(authRequest)))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.user.email", is("john@example.com")))
                    .andExpect(jsonPath("$.token").exists());
            verify(userService, times(1)).authenticateUser("john@example.com", "SecurePass123!");
        }

        @Test
        @DisplayName("POST /api/auth/login - invalid credentials returns 401")
        void loginInvalidCredentials() throws Exception {
            when(userService.authenticateUser("john@example.com", "bad"))
                    .thenThrow(new RuntimeException("Invalid credentials"));
            authRequest.setPassword("bad");
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(authRequest)))
                    .andExpect(status().isUnauthorized());
            verify(userService, times(1)).authenticateUser("john@example.com", "bad");
        }

        @Test
        @DisplayName("POST /api/auth/login - missing email returns 400")
        void loginMissingEmailReturns400() throws Exception {
            authRequest.setEmail(null);
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(authRequest)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("POST /api/auth/login - missing password returns 400")
        void loginMissingPasswordReturns400() throws Exception {
            authRequest.setPassword(null);
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(authRequest)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("POST /api/auth/login - non-existent user returns 401")
        void loginNonExistentUserReturns401() throws Exception {
            when(userService.authenticateUser("nouser@example.com", "SecurePass123!"))
                    .thenThrow(new RuntimeException("User not found with email: nouser@example.com"));
            authRequest.setEmail("nouser@example.com");
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(authRequest)))
                    .andExpect(status().isUnauthorized());
            verify(userService, times(1)).authenticateUser("nouser@example.com", "SecurePass123!");
        }

        @Test
        @DisplayName("POST /api/auth/login - inactive user returns 401")
        void loginInactiveUserReturns401() throws Exception {
            User inactiveUser = new User();
            inactiveUser.setEmail("inactive@example.com");
            inactiveUser.setPasswordHash("encodedInactive");
            inactiveUser.setStatus(User.UserStatus.INACTIVE);
            when(userService.authenticateUser("inactive@example.com", "SecurePass123!"))
                    .thenThrow(new RuntimeException("User is inactive"));
            authRequest.setEmail("inactive@example.com");
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(authRequest)))
                    .andExpect(status().isUnauthorized());
            verify(userService, times(1)).authenticateUser("inactive@example.com", "SecurePass123!");
        }
    }

    @Nested
    @DisplayName("UserController - Registration")
    class UserControllerRegistration {
        @Test
        @DisplayName("POST /api/users - successful creation returns 201 with user body")
        void shouldCreateUserSuccessfully() throws Exception {
            when(userService.createUser(any(UserCreateRequestDto.class))).thenReturn(createdDto);
            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createReq)))
                    .andDo(print())
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(3))
                    .andExpect(jsonPath("$.email").value("newuser@example.com"));
            verify(userService, times(1)).createUser(any(UserCreateRequestDto.class));
        }

        @Test
        @DisplayName("POST /api/users - missing password returns 400")
        void registrationMissingPasswordReturns400() throws Exception {
            createReq.setPassword(null);
            when(userService.createUser(any(UserCreateRequestDto.class)))
                    .thenThrow(new RuntimeException("Password is required"));
            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createReq)))
                    .andExpect(status().isBadRequest());
            verify(userService, times(1)).createUser(any(UserCreateRequestDto.class));
        }

        @Test
        @DisplayName("POST /api/users - weak password returns 400")
        void registrationWeakPasswordReturns400() throws Exception {
            createReq.setPassword("weak");
            when(userService.createUser(any(UserCreateRequestDto.class)))
                    .thenThrow(new RuntimeException("Password does not meet strength requirements"));
            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createReq)))
                    .andExpect(status().isBadRequest());
            verify(userService, times(1)).createUser(any(UserCreateRequestDto.class));
        }

        @Test
        @DisplayName("POST /api/users - missing email returns 400")
        void missingEmailReturns400() throws Exception {
            createReq.setEmail(null);
            when(userService.createUser(any(UserCreateRequestDto.class)))
                    .thenThrow(new RuntimeException("Email is required"));
            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createReq)))
                    .andExpect(status().isBadRequest());
            verify(userService, times(1)).createUser(any(UserCreateRequestDto.class));
        }

        @Test
        @DisplayName("POST /api/users - duplicate email returns 400")
        void duplicateEmailReturns400() throws Exception {
            when(userService.createUser(any(UserCreateRequestDto.class)))
                    .thenThrow(new IllegalArgumentException("Email already exists"));
            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createReq)))
                    .andExpect(status().isConflict());
            verify(userService, times(1)).createUser(any(UserCreateRequestDto.class));
        }

        @Test
        @DisplayName("POST /api/users - missing first name returns 400")
        void registrationMissingFirstNameReturns400() throws Exception {
            createReq.setFirstName(null);
            when(userService.createUser(any(UserCreateRequestDto.class)))
                    .thenThrow(new RuntimeException("First name is required"));
            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createReq)))
                    .andExpect(status().isBadRequest());
            verify(userService, times(1)).createUser(any(UserCreateRequestDto.class));
        }
    }
}
