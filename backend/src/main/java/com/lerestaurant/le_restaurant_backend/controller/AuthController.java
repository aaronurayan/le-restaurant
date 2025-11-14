package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.AuthRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.UserCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.UserDto;
import com.lerestaurant.le_restaurant_backend.service.UserService;
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

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequestDto request) {
        // Validation is now handled by @Valid annotation and GlobalExceptionHandler
        try {
            UserDto user = userService.authenticateUser(request.getEmail(), request.getPassword());
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            // In a real app you'd return a signed JWT or session token here
            response.put("token", "mock-token");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            Map<String, String> error = new HashMap<>();
            error.put("error", msg);
            // Always return 401 for any login failure, including user not found
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserCreateRequestDto requestDto) {
        try {
            UserDto user = userService.createUser(requestDto);
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            // In a real app you'd return a signed JWT or session token here
            response.put("token", "mock-token");
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
