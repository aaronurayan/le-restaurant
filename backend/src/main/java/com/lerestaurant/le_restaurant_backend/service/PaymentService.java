package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.PaymentDto;
import com.lerestaurant.le_restaurant_backend.dto.PaymentRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.Payment;
import com.lerestaurant.le_restaurant_backend.entity.Order;
import com.lerestaurant.le_restaurant_backend.repository.PaymentRepository;
import com.lerestaurant.le_restaurant_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    
    @Autowired
    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }
    
    public PaymentDto createPayment(PaymentRequestDto requestDto) {
        // 주문 존재 확인
        Order order = orderRepository.findById(requestDto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + requestDto.getOrderId()));
        
        // 결제 생성
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(requestDto.getAmount());
        payment.setPaymentMethod(requestDto.getPaymentMethod());
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setPaymentDetails(requestDto.getPaymentDetails());
        payment.setPaymentTime(OffsetDateTime.now());
        
        Payment savedPayment = paymentRepository.save(payment);
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
        return convertToDto(updatedPayment);
    }
    
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        
        paymentRepository.delete(payment);
    }
    
    private PaymentDto convertToDto(Payment payment) {
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
                payment.getGatewayResponse()
        );
    }
}
