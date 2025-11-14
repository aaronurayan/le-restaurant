package com.lerestaurant.le_restaurant_backend.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.lerestaurant.le_restaurant_backend.dto.PaymentDto;
import com.lerestaurant.le_restaurant_backend.dto.PaymentRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.Order;
import com.lerestaurant.le_restaurant_backend.entity.Payment;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.OrderRepository;
import com.lerestaurant.le_restaurant_backend.repository.PaymentRepository;

/**
 * PaymentService Unit Tests
 * 
 * Tests for PaymentService business logic including:
 * - Payment creation and validation
 * - Payment processing
 * - Payment refund
 * - Payment status management
 * - Error handling
 */
@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private PaymentService paymentService;

    private Order testOrder;
    private User testCustomer;
    private Payment testPayment;

    @BeforeEach
    void setUp() {
        // Setup test customer
        testCustomer = new User();
        testCustomer.setId(1L);
        testCustomer.setEmail("customer@test.com");
        testCustomer.setFirstName("John");
        testCustomer.setLastName("Doe");
        testCustomer.setRole(User.UserRole.CUSTOMER);
        testCustomer.setStatus(User.UserStatus.ACTIVE);

        // Setup test order
        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setCustomer(testCustomer);
        testOrder.setTotalAmount(new BigDecimal("100.00"));
        testOrder.setStatus(Order.OrderStatus.PENDING);
        testOrder.setOrderTime(OffsetDateTime.now());

        // Setup test payment
        testPayment = new Payment();
        testPayment.setId(1L);
        testPayment.setOrder(testOrder);
        testPayment.setAmount(new BigDecimal("100.00"));
        testPayment.setPaymentMethod(Payment.PaymentMethod.CREDIT_CARD);
        testPayment.setTransactionId("txn-123");
        testPayment.setStatus(Payment.PaymentStatus.PENDING);
        testPayment.setPaymentTime(OffsetDateTime.now());
    }

    @Test
    void testCreatePayment_Success() {
        // Arrange
        PaymentRequestDto requestDto = new PaymentRequestDto();
        requestDto.setOrderId(1L);
        requestDto.setAmount(new BigDecimal("100.00"));
        requestDto.setPaymentMethod(Payment.PaymentMethod.CREDIT_CARD);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(paymentRepository.findByOrderId(1L)).thenReturn(new ArrayList<>());
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        // Act
        PaymentDto result = paymentService.createPayment(requestDto);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getOrderId());
        assertEquals(new BigDecimal("100.00"), result.getAmount());
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    void testCreatePayment_OrderNotFound() {
        // Arrange
        PaymentRequestDto requestDto = new PaymentRequestDto();
        requestDto.setOrderId(999L);
        requestDto.setAmount(new BigDecimal("100.00"));
        requestDto.setPaymentMethod(Payment.PaymentMethod.CREDIT_CARD);

        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.createPayment(requestDto);
        });

        assertTrue(exception.getMessage().contains("Order not found"));
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    void testCreatePayment_AmountMismatch() {
        // Arrange
        PaymentRequestDto requestDto = new PaymentRequestDto();
        requestDto.setOrderId(1L);
        requestDto.setAmount(new BigDecimal("150.00")); // Different from order total
        requestDto.setPaymentMethod(Payment.PaymentMethod.CREDIT_CARD);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            paymentService.createPayment(requestDto);
        });

        assertTrue(exception.getMessage().contains("does not match order total"));
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    void testCreatePayment_DuplicateCompletedPayment() {
        // Arrange
        PaymentRequestDto requestDto = new PaymentRequestDto();
        requestDto.setOrderId(1L);
        requestDto.setAmount(new BigDecimal("100.00"));
        requestDto.setPaymentMethod(Payment.PaymentMethod.CREDIT_CARD);

        Payment completedPayment = new Payment();
        completedPayment.setStatus(Payment.PaymentStatus.COMPLETED);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(paymentRepository.findByOrderId(1L)).thenReturn(List.of(completedPayment));

        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            paymentService.createPayment(requestDto);
        });

        assertTrue(exception.getMessage().contains("already has a completed payment"));
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    void testProcessPayment_Success() {
        // Arrange
        testPayment.setStatus(Payment.PaymentStatus.PENDING);
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        // Act
        PaymentDto result = paymentService.processPayment(1L);

        // Assert
        assertNotNull(result);
        verify(paymentRepository, times(1)).save(any(Payment.class));
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void testProcessPayment_NotFound() {
        // Arrange
        when(paymentRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.processPayment(999L);
        });

        assertTrue(exception.getMessage().contains("Payment not found"));
    }

    @Test
    void testRefundPayment_Success() {
        // Arrange
        testPayment.setStatus(Payment.PaymentStatus.COMPLETED);
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        // Act
        PaymentDto result = paymentService.refundPayment(1L);

        // Assert
        assertNotNull(result);
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    void testRefundPayment_NotFound() {
        // Arrange
        when(paymentRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.refundPayment(999L);
        });

        assertTrue(exception.getMessage().contains("Payment not found"));
    }

    @Test
    void testRefundPayment_NotCompleted() {
        // Arrange
        testPayment.setStatus(Payment.PaymentStatus.PENDING);
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            paymentService.refundPayment(1L);
        });

        assertTrue(exception.getMessage().contains("Only completed payments can be refunded"));
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    void testGetPaymentById_Success() {
        // Arrange
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        // Act
        PaymentDto result = paymentService.getPaymentById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testGetPaymentById_NotFound() {
        // Arrange
        when(paymentRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.getPaymentById(999L);
        });

        assertTrue(exception.getMessage().contains("Payment not found"));
    }

    @Test
    void testUpdatePaymentStatus_Success() {
        // Arrange
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        // Act
        PaymentDto result = paymentService.updatePaymentStatus(1L, Payment.PaymentStatus.COMPLETED);

        // Assert
        assertNotNull(result);
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    void testDeletePayment_Success() {
        // Arrange
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        doNothing().when(paymentRepository).delete(testPayment);

        // Act
        paymentService.deletePayment(1L);

        // Assert
        verify(paymentRepository, times(1)).delete(testPayment);
    }

    @Test
    void testDeletePayment_NotFound() {
        // Arrange
        when(paymentRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.deletePayment(999L);
        });

        assertTrue(exception.getMessage().contains("Payment not found"));
        verify(paymentRepository, never()).delete(any(Payment.class));
    }
}

