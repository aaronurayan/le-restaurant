package com.lerestaurant.le_restaurant_backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lerestaurant.le_restaurant_backend.dto.UserCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.UserDto;
import com.lerestaurant.le_restaurant_backend.dto.UserUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
// CORS is handled globally in WebConfig
public class UserController {
    
    private final UserService userService;
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody UserCreateRequestDto requestDto) {
        // Exception handling is done by GlobalExceptionHandler
        UserDto user = userService.createUser(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        // Exception handling is done by GlobalExceptionHandler
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        // Exception handling is done by GlobalExceptionHandler
        UserDto user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserDto>> getUsersByRole(@PathVariable User.UserRole role) {
        List<UserDto> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<UserDto>> getUsersByStatus(@PathVariable User.UserStatus status) {
        List<UserDto> users = userService.getUsersByStatus(status);
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequestDto requestDto) {
        // Exception handling is done by GlobalExceptionHandler
        UserDto user = userService.updateUser(id, requestDto);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, User.UserStatus> statusRequest) {
        // Exception handling is done by GlobalExceptionHandler
        User.UserStatus status = statusRequest.get("status");
        UserDto user = userService.updateUserStatus(id, status);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/{id}/login")
    public ResponseEntity<?> updateLastLogin(@PathVariable Long id) {
        // Exception handling is done by GlobalExceptionHandler
        UserDto user = userService.updateLastLogin(id);
        return ResponseEntity.ok(user);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        // Exception handling is done by GlobalExceptionHandler
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/exists/{email}")
    public ResponseEntity<Map<String, Boolean>> checkEmailExists(@PathVariable String email) {
        boolean exists = userService.existsByEmail(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testConnection() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "User API connection successful! 👤");
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }
}
