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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lerestaurant.le_restaurant_backend.dto.PaymentDto;
import com.lerestaurant.le_restaurant_backend.dto.PaymentRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.Payment;
import com.lerestaurant.le_restaurant_backend.service.PaymentService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
// CORS is handled globally in WebConfig
public class PaymentController {
    
    private final PaymentService paymentService;
    
    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    
    @PostMapping
    public ResponseEntity<?> createPayment(@Valid @RequestBody PaymentRequestDto requestDto) {
        // Exception handling is done by GlobalExceptionHandler
        PaymentDto payment = paymentService.createPayment(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        // Exception handling is done by GlobalExceptionHandler
        PaymentDto payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }
    
    @GetMapping
    public ResponseEntity<List<PaymentDto>> getAllPayments() {
        List<PaymentDto> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<PaymentDto>> getPaymentsByOrderId(@PathVariable Long orderId) {
        List<PaymentDto> payments = paymentService.getPaymentsByOrderId(orderId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentDto>> getPaymentsByStatus(@PathVariable Payment.PaymentStatus status) {
        List<PaymentDto> payments = paymentService.getPaymentsByStatus(status);
        return ResponseEntity.ok(payments);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestParam Payment.PaymentStatus status) {
        // Exception handling is done by GlobalExceptionHandler
        PaymentDto payment = paymentService.updatePaymentStatus(id, status);
        return ResponseEntity.ok(payment);
    }
    
    @PostMapping("/{id}/process")
    public ResponseEntity<?> processPayment(@PathVariable Long id) {
        // Exception handling is done by GlobalExceptionHandler
        PaymentDto payment = paymentService.processPayment(id);
        return ResponseEntity.ok(payment);
    }
    
    @PostMapping("/{id}/refund")
    public ResponseEntity<?> refundPayment(@PathVariable Long id) {
        // Exception handling is done by GlobalExceptionHandler
        PaymentDto payment = paymentService.refundPayment(id);
        return ResponseEntity.ok(payment);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePayment(@PathVariable Long id, @RequestBody Map<String, String> update) {
        // Exception handling is done by GlobalExceptionHandler
        Payment.PaymentStatus status = Payment.PaymentStatus.valueOf(update.get("status"));
        PaymentDto payment = paymentService.updatePaymentStatus(id, status);
        return ResponseEntity.ok(payment);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable Long id) {
        // Exception handling is done by GlobalExceptionHandler
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testConnection() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Payment API connection successful! 💳");
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }
}
