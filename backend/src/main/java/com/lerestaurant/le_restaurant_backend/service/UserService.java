package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.UserDto;
import com.lerestaurant.le_restaurant_backend.dto.UserCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.UserUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.lerestaurant.le_restaurant_backend.util.PasswordValidator;

/**
 * User Management Service (F102)
 * 
 * This service handles all user-related business logic for F102 User Management.
 * It provides comprehensive user CRUD operations, role management, and status control.
 * 
 * Features:
 * - User CRUD operations
 * - User role and status management
 * - Email validation and uniqueness checking
 * - Password encryption and security
 * - Transaction management
 * - Comprehensive logging
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2024-01-15
 * @module F102-UserManagement
 */
@Service
@Transactional
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    /**
     * Create a new user
     * 
     * This method creates a new user with the provided information.
     * It validates input, checks password strength, enforces email uniqueness,
     * encrypts the password, and sets default values.
     * 
     * @param requestDto User creation request data
     * @return UserDto Created user data
     * @throws RuntimeException if email already exists
     */
    public UserDto createUser(UserCreateRequestDto requestDto) {
        logger.info("Creating new user with email: {}", requestDto.getEmail());

        // Basic input validation is now handled by Bean Validation (@Valid in Controller)
        // Only business logic validation remains here

        // Validate password strength
        if (!PasswordValidator.isStrong(requestDto.getPassword())) {
            throw new IllegalArgumentException("Password does not meet strength requirements");
        }

        // Check email uniqueness (using existsByEmail for better performance)
        if (userRepository.existsByEmail(requestDto.getEmail())) {
            logger.warn("User creation failed: email already exists - {}", requestDto.getEmail());
            throw new RuntimeException("User with email already exists: " + requestDto.getEmail());
        }

        // Create new user entity
        User user = new User();
        user.setEmail(requestDto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(requestDto.getPassword()));
        user.setPhoneNumber(requestDto.getPhoneNumber());
        user.setFirstName(requestDto.getFirstName());
        user.setLastName(requestDto.getLastName());
        user.setRole(requestDto.getRole());
        user.setStatus(User.UserStatus.ACTIVE);
        user.setCreatedAt(OffsetDateTime.now());
        // Save user to database
        User savedUser = userRepository.save(user);
        logger.info("User created successfully with ID: {}", savedUser.getId());

        return convertToDto(savedUser);
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToDto(user);
    }

    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return convertToDto(user);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getUsersByRole(User.UserRole role) {
        return userRepository.findByRole(role)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getUsersByStatus(User.UserStatus status) {
        return userRepository.findByStatus(status)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserDto updateUser(Long id, UserUpdateRequestDto requestDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (requestDto.getPhoneNumber() != null) {
            user.setPhoneNumber(requestDto.getPhoneNumber());
        }
        if (requestDto.getFirstName() != null) {
            user.setFirstName(requestDto.getFirstName());
        }
        if (requestDto.getLastName() != null) {
            user.setLastName(requestDto.getLastName());
        }
        if (requestDto.getStatus() != null) {
            user.setStatus(requestDto.getStatus());
        }
        if (requestDto.getProfileImageUrl() != null) {
            user.setProfileImageUrl(requestDto.getProfileImageUrl());
        }

        user.setUpdatedAt(OffsetDateTime.now());

        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    public UserDto updateUserStatus(Long id, User.UserStatus status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setStatus(status);
        user.setUpdatedAt(OffsetDateTime.now());

        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    public UserDto updateLastLogin(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setLastLogin(OffsetDateTime.now());

        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    public UserDto authenticateUser(String email, String rawPassword) {
        if (email == null) {
            throw new IllegalArgumentException("Email must not be null");
        }
        if (rawPassword == null) {
            throw new IllegalArgumentException("Password must not be null");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        user.setLastLogin(OffsetDateTime.now());
        userRepository.save(user);

        return convertToDto(user);
    }

    /**
     * Delete a user
     * 
     * This method deletes a user from the system.
     * It checks for existing orders and related data before deletion
     * to prevent data integrity issues.
     * 
     * For F102 User Management: Managers can safely delete users
     * who have no order history. Users with orders cannot be deleted
     * to maintain transaction records (soft delete recommended instead).
     * 
     * @param id User ID to delete
     * @throws RuntimeException if user not found or has existing orders
     */
    public void deleteUser(Long id) {
        logger.info("Attempting to delete user with ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Delete failed: user not found - {}", id);
                    return new RuntimeException("User not found with id: " + id);
                });
        
        // Check if user has any orders (prevent deletion if they have transaction history)
        // This is a business rule to maintain financial records
        if (user.getOrders() != null && !user.getOrders().isEmpty()) {
            logger.warn("Delete failed: user has {} orders - {}", user.getOrders().size(), id);
            throw new RuntimeException(
                "Cannot delete user with existing orders. " +
                "User has " + user.getOrders().size() + " order(s). " +
                "Consider deactivating the user instead."
            );
        }
        
        // Safe to delete - no order history
        userRepository.delete(user);
        logger.info("User deleted successfully: {}", id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    private UserDto convertToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getLastLogin(),
                user.getProfileImageUrl());
    }

}
