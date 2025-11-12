package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.PaymentDto;
import com.lerestaurant.le_restaurant_backend.dto.PaymentRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.Payment;
import com.lerestaurant.le_restaurant_backend.entity.Order;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.PaymentRepository;
import com.lerestaurant.le_restaurant_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

/**
 * Payment Management Service (F106)
 * 
 * This service handles all payment-related business logic for F106 Payment Management.
 * It provides comprehensive payment processing, status management, and transaction tracking.
 * 
 * Features:
 * - Payment CRUD operations
 * - Payment processing and validation
 * - Transaction ID generation
 * - Payment status management
 * - Order validation
 * - Transaction management
 * - Comprehensive logging
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2024-01-15
 * @module F106-PaymentManagement
 */
@Service
@Transactional
public class PaymentService {
    
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    
    @Autowired
    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }
    
    /**
     * Create a new payment
     * 
     * This method creates a new payment for the specified order.
     * It validates the order existence, generates a transaction ID, and sets initial status.
     * 
     * @param requestDto Payment creation request data
     * @return PaymentDto Created payment data
     * @throws RuntimeException if order not found
     */
    public PaymentDto createPayment(PaymentRequestDto requestDto) {
        logger.info("Creating new payment for order ID: {}", requestDto.getOrderId());
        
        // Validate order existence
        Order order = orderRepository.findById(requestDto.getOrderId())
                .orElseThrow(() -> {
                    logger.error("Payment creation failed: order not found - {}", requestDto.getOrderId());
                    return new RuntimeException("Order not found with id: " + requestDto.getOrderId());
                });
        
        // Create payment entity
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(requestDto.getAmount());
        payment.setPaymentMethod(requestDto.getPaymentMethod());
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setPaymentDetails(requestDto.getPaymentDetails());
        payment.setPaymentTime(OffsetDateTime.now());
        
        // Save payment to database
        Payment savedPayment = paymentRepository.save(payment);
        logger.info("Payment created successfully with ID: {} and transaction ID: {}", 
                   savedPayment.getId(), savedPayment.getTransactionId());
        
        return convertToDto(savedPayment);
    }
    
    public PaymentDto getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        return convertToDto(payment);
    }
    
    public List<PaymentDto> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<PaymentDto> getPaymentsByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<PaymentDto> getPaymentsByStatus(Payment.PaymentStatus status) {
        return paymentRepository.findByStatus(status)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public PaymentDto updatePaymentStatus(Long id, Payment.PaymentStatus status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        
        payment.setStatus(status);
        payment.setProcessedAt(OffsetDateTime.now());
        
        Payment updatedPayment = paymentRepository.save(payment);
        return convertToDto(updatedPayment);
    }
    
    public PaymentDto processPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        
        // 실제 결제 처리 로직 (외부 결제 게이트웨이 연동)
        // 여기서는 간단히 성공으로 처리
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setProcessedAt(OffsetDateTime.now());
        payment.setGatewayResponse("Payment processed successfully");
        
        Payment updatedPayment = paymentRepository.save(payment);
        
        // 결제 완료 후 주문 상태 자동 업데이트
        // PENDING -> CONFIRMED (결제 완료 후)
        Order order = payment.getOrder();
        if (order.getStatus() == Order.OrderStatus.PENDING) {
            order.setStatus(Order.OrderStatus.CONFIRMED);
            orderRepository.save(order);
            logger.info("Order {} status automatically updated to CONFIRMED after payment completion", order.getId());
        }
        
        return convertToDto(updatedPayment);
    }
    
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        
        paymentRepository.delete(payment);
    }
    
    private PaymentDto convertToDto(Payment payment) {
        User customer = payment.getOrder().getCustomer();
        String customerName = customer != null 
            ? customer.getFirstName() + " " + customer.getLastName() 
            : "Unknown";
        String customerEmail = customer != null ? customer.getEmail() : "N/A";
        Long customerId = customer != null ? customer.getId() : null;
        
        return new PaymentDto(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getTransactionId(),
                payment.getStatus(),
                payment.getPaymentDetails(),
                payment.getPaymentTime(),
                payment.getProcessedAt(),
                payment.getGatewayResponse(),
                customerId,
                customerName,
                customerEmail
        );
    }
}
