package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.OrderCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.OrderDto;
import com.lerestaurant.le_restaurant_backend.dto.OrderUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.Order;
import com.lerestaurant.le_restaurant_backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Order Management REST Controller (F105)
 * 
 * This controller provides REST API endpoints for order management.
 * It handles order CRUD operations and status updates.
 * This controller serves as the foundation for F107 Delivery Management.
 * 
 * Base URL: /api/orders
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F105-OrderManagement
 */
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
    
    private final OrderService orderService;
    
    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    /**
     * Create a new order
     * 
     * POST /api/orders
     * 
     * @param requestDto Order creation request
     * @return ResponseEntity with created OrderDto or error
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderCreateRequestDto requestDto) {
        try {
            OrderDto order = orderService.createOrder(requestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Get order by ID
     * 
     * GET /api/orders/{id}
     * 
     * @param id Order ID
     * @return ResponseEntity with OrderDto or error
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            OrderDto order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get all orders
     * 
     * GET /api/orders
     * 
     * @return ResponseEntity with list of OrderDto
     */
    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<OrderDto> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    
    /**
     * Get orders by customer ID
     * 
     * GET /api/orders/customer/{customerId}
     * 
     * @param customerId Customer ID
     * @return ResponseEntity with list of OrderDto
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDto>> getOrdersByCustomerId(@PathVariable Long customerId) {
        List<OrderDto> orders = orderService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok(orders);
    }
    
    /**
     * Get orders by status
     * 
     * GET /api/orders/status/{status}
     * 
     * @param status Order status
     * @return ResponseEntity with list of OrderDto
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderDto>> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        List<OrderDto> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }
    
    /**
     * Update order status
     * 
     * PUT /api/orders/{id}/status
     * 
     * @param id Order ID
     * @param statusUpdate Map containing the new status
     * @return ResponseEntity with updated OrderDto or error
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, 
                                               @RequestBody Map<String, String> statusUpdate) {
        try {
            Order.OrderStatus status = Order.OrderStatus.valueOf(statusUpdate.get("status"));
            OrderDto order = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Update order
     * 
     * PUT /api/orders/{id}
     * 
     * @param id Order ID
     * @param requestDto Order update request
     * @return ResponseEntity with updated OrderDto or error
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id,
                                        @RequestBody OrderUpdateRequestDto requestDto) {
        try {
            OrderDto order = orderService.updateOrder(id, requestDto);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Delete/cancel order
     * 
     * DELETE /api/orders/{id}
     * 
     * @param id Order ID
     * @return ResponseEntity with success message or error
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Order cancelled successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
