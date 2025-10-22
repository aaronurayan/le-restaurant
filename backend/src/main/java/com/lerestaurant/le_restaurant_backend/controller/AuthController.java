package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.AuthRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.UserDto;
import com.lerestaurant.le_restaurant_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDto request) {
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email must not be null or empty");
            return ResponseEntity.badRequest().body(error);
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Password must not be null or empty");
            return ResponseEntity.badRequest().body(error);
        }
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
}
