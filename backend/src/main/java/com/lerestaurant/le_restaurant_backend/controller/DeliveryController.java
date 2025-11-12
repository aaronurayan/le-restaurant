package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.DeliveryCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.DeliveryDto;
import com.lerestaurant.le_restaurant_backend.dto.DeliveryUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.Delivery;
import com.lerestaurant.le_restaurant_backend.service.DeliveryService;
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
 * Delivery Controller (F107)
 * 
 * REST API endpoints for delivery management.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F107-DeliveryManagement
 */
@RestController
@RequestMapping("/api/deliveries")
// CORS is handled globally in WebConfig
public class DeliveryController {
    
    private static final Logger logger = LoggerFactory.getLogger(DeliveryController.class);
    
    private final DeliveryService deliveryService;
    
    @Autowired
    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }
    
    /**
     * Create new delivery
     * POST /api/deliveries
     * 
     * @param requestDto Delivery creation request
     * @return Created delivery
     */
    @PostMapping
    public ResponseEntity<?> createDelivery(@RequestBody DeliveryCreateRequestDto requestDto) {
        try {
            logger.info("Creating new delivery for order ID: {}", requestDto.getOrderId());
            DeliveryDto deliveryDto = deliveryService.createDelivery(requestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(deliveryDto);
        } catch (RuntimeException e) {
            logger.error("Error creating delivery: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Get delivery by ID
     * GET /api/deliveries/{id}
     * 
     * @param id Delivery ID
     * @return Delivery details
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getDeliveryById(@PathVariable Long id) {
        try {
            logger.info("Fetching delivery with ID: {}", id);
            DeliveryDto deliveryDto = deliveryService.getDeliveryById(id);
            return ResponseEntity.ok(deliveryDto);
        } catch (RuntimeException e) {
            logger.error("Error fetching delivery: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    /**
     * Get all deliveries
     * GET /api/deliveries
     * 
     * @return List of all deliveries
     */
    @GetMapping
    public ResponseEntity<?> getAllDeliveries() {
        try {
            logger.info("Fetching all deliveries");
            List<DeliveryDto> deliveries = deliveryService.getAllDeliveries();
            return ResponseEntity.ok(deliveries);
        } catch (RuntimeException e) {
            logger.error("Error fetching deliveries: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Get deliveries by status
     * GET /api/deliveries/status/{status}
     * 
     * @param status Delivery status
     * @return List of deliveries with given status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getDeliveriesByStatus(@PathVariable String status) {
        try {
            logger.info("Fetching deliveries with status: {}", status);
            Delivery.DeliveryStatus deliveryStatus = Delivery.DeliveryStatus.valueOf(status.toUpperCase());
            List<DeliveryDto> deliveries = deliveryService.getDeliveriesByStatus(deliveryStatus);
            return ResponseEntity.ok(deliveries);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid delivery status: {}", status);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid delivery status: " + status);
            return ResponseEntity.badRequest().body(error);
        } catch (RuntimeException e) {
            logger.error("Error fetching deliveries by status: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Get deliveries by driver
     * GET /api/deliveries/driver/{driverId}
     * 
     * @param driverId Driver (DeliveryDriver) ID
     * @return List of deliveries assigned to driver
     */
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<?> getDeliveriesByDriver(@PathVariable Long driverId) {
        try {
            logger.info("Fetching deliveries for driver ID: {}", driverId);
            List<DeliveryDto> deliveries = deliveryService.getDeliveriesByDriver(driverId);
            return ResponseEntity.ok(deliveries);
        } catch (RuntimeException e) {
            logger.error("Error fetching deliveries by driver: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Assign driver to delivery
     * POST /api/deliveries/{id}/assign-driver/{driverId}
     * 
     * @param id Delivery ID
     * @param driverId Driver ID
     * @return Updated delivery
     */
    @PostMapping("/{id}/assign-driver/{driverId}")
    public ResponseEntity<?> assignDriver(@PathVariable Long id, @PathVariable Long driverId) {
        try {
            logger.info("Assigning driver {} to delivery {}", driverId, id);
            DeliveryDto deliveryDto = deliveryService.assignDriver(id, driverId);
            return ResponseEntity.ok(deliveryDto);
        } catch (RuntimeException e) {
            logger.error("Error assigning driver: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Update delivery status
     * PUT /api/deliveries/{id}/status
     * 
     * @param id Delivery ID
     * @param requestDto Status update request
     * @return Updated delivery
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateDeliveryStatus(@PathVariable Long id,
                                                  @RequestBody DeliveryUpdateRequestDto requestDto) {
        try {
            logger.info("Updating delivery {} status to: {}", id, requestDto.getStatus());
            DeliveryDto deliveryDto = deliveryService.updateDeliveryStatus(id, requestDto);
            return ResponseEntity.ok(deliveryDto);
        } catch (RuntimeException e) {
            logger.error("Error updating delivery status: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Delete delivery
     * DELETE /api/deliveries/{id}
     * 
     * @param id Delivery ID
     * @return Success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDelivery(@PathVariable Long id) {
        try {
            logger.info("Deleting delivery with ID: {}", id);
            deliveryService.deleteDelivery(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Delivery deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error deleting delivery: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
