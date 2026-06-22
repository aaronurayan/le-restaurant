package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.OrderCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.OrderDto;
import com.lerestaurant.le_restaurant_backend.dto.OrderUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.Order;
import com.lerestaurant.le_restaurant_backend.service.AuthorizationService;
import com.lerestaurant.le_restaurant_backend.service.OrderService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Order Management REST Controller (F105)
 *
 * Provides endpoints for order CRUD operations and status management.
 * Base URL: /api/orders
 */
@RestController
@RequestMapping("/api/orders")
// CORS is handled globally in WebConfig
public class OrderController {

    private final OrderService orderService;
    private final AuthorizationService authorizationService;

    @Autowired
    public OrderController(OrderService orderService, AuthorizationService authorizationService) {
        this.orderService = orderService;
        this.authorizationService = authorizationService;
    }

    /** Create a new order */
    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderCreateRequestDto requestDto) {
        // Bind the order to the authenticated customer; staff may place orders for any customer.
        // Prevents a customer from creating orders under another customer's id.
        requestDto.setCustomerId(authorizationService.resolveOwnerId(requestDto.getCustomerId()));
        OrderDto order = orderService.createOrder(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    /** Get order by ID */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);
        // Customers may only read their own orders (prevents IDOR).
        authorizationService.requireSelfOrStaff(order.getCustomerId());
        return ResponseEntity.ok(order);
    }

    /** Get all orders */
    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /** Get orders by customer ID */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDto>> getOrdersByCustomerId(@PathVariable Long customerId) {
        // Customers may only list their own orders (prevents enumerating others' history).
        authorizationService.requireSelfOrStaff(customerId);
        return ResponseEntity.ok(orderService.getOrdersByCustomerId(customerId));
    }

    /** Get orders by status */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderDto>> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    /** Update order status */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        // Exception handling is done by GlobalExceptionHandler
        Order.OrderStatus status = Order.OrderStatus.valueOf(statusUpdate.get("status"));
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    /** Update order details */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @Valid @RequestBody OrderUpdateRequestDto requestDto) {
        // Exception handling is done by GlobalExceptionHandler
        return ResponseEntity.ok(orderService.updateOrder(id, requestDto));
    }

    /** Delete / cancel order */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        // Customers may only cancel their own orders (prevents cancelling others' orders).
        OrderDto order = orderService.getOrderById(id);
        authorizationService.requireSelfOrStaff(order.getCustomerId());
        orderService.deleteOrder(id);
        return ResponseEntity.ok(Map.of("message", "Order cancelled successfully"));
    }
}
