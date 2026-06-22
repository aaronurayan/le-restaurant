package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.AuthRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.ForgotPasswordRequest;
import com.lerestaurant.le_restaurant_backend.dto.ResetPasswordRequest;
import com.lerestaurant.le_restaurant_backend.dto.UserCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.UserDto;
import com.lerestaurant.le_restaurant_backend.service.PasswordResetService;
import com.lerestaurant.le_restaurant_backend.service.UserService;
import com.lerestaurant.le_restaurant_backend.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
// CORS is handled globally in WebConfig
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordResetService passwordResetService;

    @Autowired
    public AuthController(UserService userService, JwtUtil jwtUtil, PasswordResetService passwordResetService) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequestDto request) {
        // Validation is now handled by @Valid annotation and GlobalExceptionHandler
        try {
            UserDto user = userService.authenticateUser(request.getEmail(), request.getPassword());
            
            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            Map<String, String> error = new HashMap<>();
            error.put("error", msg);
            // Always return 401 for any login failure, including user not found
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        // Generate the token server-side. The token is NEVER returned in the response:
        // exposing it would let any unauthenticated caller reset any account's password.
        // It is delivered out-of-band (email in production; server log in demo mode).
        passwordResetService.generateResetToken(request.getEmail());
        // Always return the same generic response regardless of whether the email exists,
        // to prevent account enumeration.
        Map<String, String> response = new HashMap<>();
        response.put("message", "If an account exists for that email, a password reset link has been sent.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password has been reset successfully. You can now log in.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserCreateRequestDto requestDto) {
        try {
            // Public self-registration may ONLY create CUSTOMER accounts. Ignore any
            // client-supplied role to prevent privilege escalation (e.g. registering as ADMIN).
            // Privileged accounts are created via the protected POST /api/users endpoint.
            requestDto.setRole(com.lerestaurant.le_restaurant_backend.entity.User.UserRole.CUSTOMER);
            UserDto user = userService.createUser(requestDto);
            
            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", token);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            // Return 409 Conflict for duplicate email
            if (e.getMessage().contains("already exists") || e.getMessage().contains("duplicate")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            }
            return ResponseEntity.badRequest().body(error);
        }
    }
}
