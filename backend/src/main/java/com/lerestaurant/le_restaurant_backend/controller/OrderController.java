package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.entity.Order;
import com.lerestaurant.le_restaurant_backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // 📝 Place an order
    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
        Order newOrder = orderService.placeOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(newOrder);
    }

    // 👀 View order status (by order ID)
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // 📜 View order history (by customer ID)
    @GetMapping("/user/{customerId}")
    public ResponseEntity<List<Order>> getOrderHistory(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
    }
}
