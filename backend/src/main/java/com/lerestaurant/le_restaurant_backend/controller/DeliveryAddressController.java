package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.DeliveryAddressCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.DeliveryAddressDto;
import com.lerestaurant.le_restaurant_backend.service.DeliveryAddressService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Delivery Address Controller (F107)
 * 
 * REST API endpoints for delivery address management.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F107-DeliveryManagement
 */
@RestController
@RequestMapping("/api/delivery-addresses")
// CORS is handled globally in WebConfig
public class DeliveryAddressController {
    
    private static final Logger logger = LoggerFactory.getLogger(DeliveryAddressController.class);
    
    private final DeliveryAddressService deliveryAddressService;
    
    @Autowired
    public DeliveryAddressController(DeliveryAddressService deliveryAddressService) {
        this.deliveryAddressService = deliveryAddressService;
    }
    
    /**
     * Create new delivery address
     * POST /api/delivery-addresses
     * 
     * @param requestDto Address creation request
     * @return Created address
     */
    @PostMapping
    public ResponseEntity<?> createAddress(@Valid @RequestBody DeliveryAddressCreateRequestDto requestDto) {
        // Exception handling is done by GlobalExceptionHandler
        logger.info("Creating new delivery address for user ID: {}", requestDto.getUserId());
        DeliveryAddressDto addressDto = deliveryAddressService.createAddress(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(addressDto);
    }
    
    /**
     * Get address by ID
     * GET /api/delivery-addresses/{id}
     * 
     * @param id Address ID
     * @return Address details
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getAddressById(@PathVariable Long id) {
        // Exception handling is done by GlobalExceptionHandler
        logger.info("Fetching delivery address with ID: {}", id);
        DeliveryAddressDto addressDto = deliveryAddressService.getAddressById(id);
        return ResponseEntity.ok(addressDto);
    }
    
    /**
     * Get all addresses for a user
     * GET /api/delivery-addresses/user/{userId}
     * 
     * @param userId User ID
     * @return List of user's addresses
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAddressesByUserId(@PathVariable Long userId) {
        // Exception handling is done by GlobalExceptionHandler
        logger.info("Fetching all delivery addresses for user ID: {}", userId);
        List<DeliveryAddressDto> addresses = deliveryAddressService.getAddressesByUserId(userId);
        return ResponseEntity.ok(addresses);
    }
    
    /**
     * Get default address for a user
     * GET /api/delivery-addresses/user/{userId}/default
     * 
     * @param userId User ID
     * @return Default address or empty response
     */
    @GetMapping("/user/{userId}/default")
    public ResponseEntity<?> getDefaultAddress(@PathVariable Long userId) {
        // Exception handling is done by GlobalExceptionHandler
        logger.info("Fetching default delivery address for user ID: {}", userId);
        DeliveryAddressDto addressDto = deliveryAddressService.getDefaultAddress(userId);
        if (addressDto == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(addressDto);
    }
    
    /**
     * Update existing address
     * PUT /api/delivery-addresses/{id}
     * 
     * @param id Address ID
     * @param requestDto Update request
     * @return Updated address
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id,
                                          @Valid @RequestBody DeliveryAddressCreateRequestDto requestDto) {
        // Exception handling is done by GlobalExceptionHandler
        logger.info("Updating delivery address with ID: {}", id);
        DeliveryAddressDto addressDto = deliveryAddressService.updateAddress(id, requestDto);
        return ResponseEntity.ok(addressDto);
    }
    
    /**
     * Set address as default for user
     * PUT /api/delivery-addresses/{id}/set-default
     * 
     * @param id Address ID
     * @return Updated address
     */
    @PutMapping("/{id}/set-default")
    public ResponseEntity<?> setAsDefault(@PathVariable Long id) {
        // Exception handling is done by GlobalExceptionHandler
        logger.info("Setting delivery address {} as default", id);
        DeliveryAddressDto addressDto = deliveryAddressService.setAsDefault(id);
        return ResponseEntity.ok(addressDto);
    }
    
    /**
     * Delete address
     * DELETE /api/delivery-addresses/{id}
     * 
     * @param id Address ID
     * @return Success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        // Exception handling is done by GlobalExceptionHandler
        logger.info("Deleting delivery address with ID: {}", id);
        deliveryAddressService.deleteAddress(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Delivery address deleted successfully");
        return ResponseEntity.ok(response);
    }
}
