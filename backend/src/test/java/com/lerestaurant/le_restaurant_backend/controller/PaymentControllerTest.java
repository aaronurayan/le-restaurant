package com.lerestaurant.le_restaurant_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lerestaurant.le_restaurant_backend.dto.PaymentDTO;
import com.lerestaurant.le_restaurant_backend.entity.Payment;
import com.lerestaurant.le_restaurant_backend.enums.PaymentMethod;
import com.lerestaurant.le_restaurant_backend.enums.PaymentStatus;
import com.lerestaurant.le_restaurant_backend.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit Tests for PaymentController (F106 - Payment Management)
 * 
 * This test suite validates the REST API endpoints for payment processing
 * including payment creation, status updates, refunds, and queries.
 * 
 * @author Le Restaurant Development Team
 * @module F106-PaymentManagement
 */
@WebMvcTest(PaymentController.class)
@DisplayName("PaymentController Tests (F106)")
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    private Payment testPayment1;
    private Payment testPayment2;
    private PaymentDTO testPaymentDTO;

    @BeforeEach
    void setUp() {
        // Setup test data
        testPayment1 = new Payment();
        testPayment1.setId(1L);
        testPayment1.setOrderId(1001L);
        testPayment1.setCustomerName("John Doe");
        testPayment1.setCustomerEmail("john@example.com");
        testPayment1.setAmount(new BigDecimal("125.50"));
        testPayment1.setCurrency("USD");
        testPayment1.setMethod(PaymentMethod.CREDIT_CARD);
        testPayment1.setStatus(PaymentStatus.COMPLETED);
        testPayment1.setTransactionId("TXN-001");
        testPayment1.setCreatedAt(LocalDateTime.now());

        testPayment2 = new Payment();
        testPayment2.setId(2L);
        testPayment2.setOrderId(1002L);
        testPayment2.setCustomerName("Jane Smith");
        testPayment2.setCustomerEmail("jane@example.com");
        testPayment2.setAmount(new BigDecimal("87.25"));
        testPayment2.setCurrency("USD");
        testPayment2.setMethod(PaymentMethod.CASH);
        testPayment2.setStatus(PaymentStatus.PENDING);
        testPayment2.setTransactionId("TXN-002");
        testPayment2.setCreatedAt(LocalDateTime.now());

        testPaymentDTO = new PaymentDTO();
        testPaymentDTO.setOrderId(1003L);
        testPaymentDTO.setAmount(new BigDecimal("200.00"));
        testPaymentDTO.setCurrency("USD");
        testPaymentDTO.setMethod(PaymentMethod.DIGITAL_WALLET);
    }

    // =================================================================
    // GET /api/payments - List All Payments Tests
    // =================================================================
    @Nested
    @DisplayName("GET /api/payments - List All Payments")
    class ListPaymentsTests {

        @Test
        @DisplayName("Should return list of all payments successfully")
        void shouldReturnAllPayments() throws Exception {
            // Given
            List<Payment> payments = Arrays.asList(testPayment1, testPayment2);
            when(paymentService.getAllPayments()).thenReturn(payments);

            // When & Then
            mockMvc.perform(get("/api/payments")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(2)))
                    .andExpect(jsonPath("$[0].transactionId", is("TXN-001")))
                    .andExpect(jsonPath("$[0].amount", is(125.50)))
                    .andExpect(jsonPath("$[1].transactionId", is("TXN-002")))
                    .andExpect(jsonPath("$[1].amount", is(87.25)));

            verify(paymentService, times(1)).getAllPayments();
        }

        @Test
        @DisplayName("Should return empty list when no payments exist")
        void shouldReturnEmptyList() throws Exception {
            // Given
            when(paymentService.getAllPayments()).thenReturn(Arrays.asList());

            // When & Then
            mockMvc.perform(get("/api/payments"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(0)));

            verify(paymentService, times(1)).getAllPayments();
        }
    }

    // =================================================================
    // GET /api/payments/{id} - Get Payment by ID Tests
    // =================================================================
    @Nested
    @DisplayName("GET /api/payments/{id} - Get Payment by ID")
    class GetPaymentByIdTests {

        @Test
        @DisplayName("Should return payment when valid ID is provided")
        void shouldReturnPaymentById() throws Exception {
            // Given
            when(paymentService.getPaymentById(1L)).thenReturn(Optional.of(testPayment1));

            // When & Then
            mockMvc.perform(get("/api/payments/1"))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", is(1)))
                    .andExpect(jsonPath("$.transactionId", is("TXN-001")))
                    .andExpect(jsonPath("$.amount", is(125.50)))
                    .andExpect(jsonPath("$.method", is("CREDIT_CARD")))
                    .andExpect(jsonPath("$.status", is("COMPLETED")));

            verify(paymentService, times(1)).getPaymentById(1L);
        }

        @Test
        @DisplayName("Should return 404 when payment not found")
        void shouldReturn404WhenPaymentNotFound() throws Exception {
            // Given
            when(paymentService.getPaymentById(999L)).thenReturn(Optional.empty());

            // When & Then
            mockMvc.perform(get("/api/payments/999"))
                    .andExpect(status().isNotFound());

            verify(paymentService, times(1)).getPaymentById(999L);
        }
    }

    // =================================================================
    // POST /api/payments - Process Payment Tests
    // =================================================================
    @Nested
    @DisplayName("POST /api/payments - Process Payment")
    class ProcessPaymentTests {

        @Test
        @DisplayName("Should process credit card payment successfully")
        void shouldProcessCreditCardPayment() throws Exception {
            // Given
            Payment processedPayment = new Payment();
            processedPayment.setId(3L);
            processedPayment.setOrderId(testPaymentDTO.getOrderId());
            processedPayment.setAmount(testPaymentDTO.getAmount());
            processedPayment.setCurrency(testPaymentDTO.getCurrency());
            processedPayment.setMethod(testPaymentDTO.getMethod());
            processedPayment.setStatus(PaymentStatus.COMPLETED);
            processedPayment.setTransactionId("TXN-003");

            when(paymentService.processPayment(any(PaymentDTO.class))).thenReturn(processedPayment);

            // When & Then
            mockMvc.perform(post("/api/payments")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testPaymentDTO)))
                    .andDo(print())
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id", is(3)))
                    .andExpect(jsonPath("$.status", is("COMPLETED")))
                    .andExpect(jsonPath("$.transactionId", notNullValue()));

            verify(paymentService, times(1)).processPayment(any(PaymentDTO.class));
        }

        @Test
        @DisplayName("Should return 400 when amount is missing")
        void shouldReturn400WhenAmountIsMissing() throws Exception {
            // Given
            testPaymentDTO.setAmount(null);

            // When & Then
            mockMvc.perform(post("/api/payments")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testPaymentDTO)))
                    .andExpect(status().isBadRequest());

            verify(paymentService, never()).processPayment(any(PaymentDTO.class));
        }

        @Test
        @DisplayName("Should return 400 when amount is negative")
        void shouldReturn400WhenAmountIsNegative() throws Exception {
            // Given
            testPaymentDTO.setAmount(new BigDecimal("-50.00"));

            // When & Then
            mockMvc.perform(post("/api/payments")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testPaymentDTO)))
                    .andExpect(status().isBadRequest());

            verify(paymentService, never()).processPayment(any(PaymentDTO.class));
        }

        @Test
        @DisplayName("Should return 400 when payment method is invalid")
        void shouldReturn400WhenMethodIsInvalid() throws Exception {
            // Given
            String invalidPaymentJson = """
                {
                    "orderId": 1003,
                    "amount": 200.00,
                    "currency": "USD",
                    "method": "INVALID_METHOD"
                }
                """;

            // When & Then
            mockMvc.perform(post("/api/payments")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(invalidPaymentJson))
                    .andExpect(status().isBadRequest());

            verify(paymentService, never()).processPayment(any(PaymentDTO.class));
        }

        @Test
        @DisplayName("Should handle payment processing failure")
        void shouldHandlePaymentProcessingFailure() throws Exception {
            // Given
            when(paymentService.processPayment(any(PaymentDTO.class)))
                    .thenThrow(new RuntimeException("Payment gateway error"));

            // When & Then
            mockMvc.perform(post("/api/payments")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testPaymentDTO)))
                    .andExpect(status().isInternalServerError());

            verify(paymentService, times(1)).processPayment(any(PaymentDTO.class));
        }
    }

    // =================================================================
    // PATCH /api/payments/{id}/status - Update Payment Status Tests
    // =================================================================
    @Nested
    @DisplayName("PATCH /api/payments/{id}/status - Update Payment Status")
    class UpdatePaymentStatusTests {

        @Test
        @DisplayName("Should update payment status to COMPLETED")
        void shouldUpdateStatusToCompleted() throws Exception {
            // Given
            testPayment2.setStatus(PaymentStatus.COMPLETED);
            when(paymentService.updatePaymentStatus(2L, PaymentStatus.COMPLETED))
                    .thenReturn(testPayment2);

            // When & Then
            mockMvc.perform(patch("/api/payments/2/status")
                            .param("status", "COMPLETED"))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status", is("COMPLETED")));

            verify(paymentService, times(1)).updatePaymentStatus(2L, PaymentStatus.COMPLETED);
        }

        @Test
        @DisplayName("Should update payment status to FAILED")
        void shouldUpdateStatusToFailed() throws Exception {
            // Given
            testPayment2.setStatus(PaymentStatus.FAILED);
            when(paymentService.updatePaymentStatus(2L, PaymentStatus.FAILED))
                    .thenReturn(testPayment2);

            // When & Then
            mockMvc.perform(patch("/api/payments/2/status")
                            .param("status", "FAILED"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status", is("FAILED")));

            verify(paymentService, times(1)).updatePaymentStatus(2L, PaymentStatus.FAILED);
        }

        @Test
        @DisplayName("Should return 400 when status is invalid")
        void shouldReturn400WhenStatusIsInvalid() throws Exception {
            // When & Then
            mockMvc.perform(patch("/api/payments/2/status")
                            .param("status", "INVALID_STATUS"))
                    .andExpect(status().isBadRequest());

            verify(paymentService, never()).updatePaymentStatus(anyLong(), any(PaymentStatus.class));
        }

        @Test
        @DisplayName("Should return 404 when payment not found")
        void shouldReturn404WhenPaymentNotFound() throws Exception {
            // Given
            when(paymentService.updatePaymentStatus(999L, PaymentStatus.COMPLETED))
                    .thenThrow(new IllegalArgumentException("Payment not found"));

            // When & Then
            mockMvc.perform(patch("/api/payments/999/status")
                            .param("status", "COMPLETED"))
                    .andExpect(status().isNotFound());

            verify(paymentService, times(1)).updatePaymentStatus(999L, PaymentStatus.COMPLETED);
        }
    }

    // =================================================================
    // POST /api/payments/{id}/refund - Process Refund Tests
    // =================================================================
    @Nested
    @DisplayName("POST /api/payments/{id}/refund - Process Refund")
    class ProcessRefundTests {

        @Test
        @DisplayName("Should process full refund successfully")
        void shouldProcessFullRefund() throws Exception {
            // Given
            testPayment1.setStatus(PaymentStatus.REFUNDED);
            when(paymentService.processRefund(1L, null)).thenReturn(testPayment1);

            // When & Then
            mockMvc.perform(post("/api/payments/1/refund"))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status", is("REFUNDED")));

            verify(paymentService, times(1)).processRefund(1L, null);
        }

        @Test
        @DisplayName("Should process partial refund successfully")
        void shouldProcessPartialRefund() throws Exception {
            // Given
            BigDecimal refundAmount = new BigDecimal("50.00");
            testPayment1.setStatus(PaymentStatus.PARTIALLY_REFUNDED);
            when(paymentService.processRefund(1L, refundAmount)).thenReturn(testPayment1);

            // When & Then
            mockMvc.perform(post("/api/payments/1/refund")
                            .param("amount", "50.00"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status", is("PARTIALLY_REFUNDED")));

            verify(paymentService, times(1)).processRefund(eq(1L), any(BigDecimal.class));
        }

        @Test
        @DisplayName("Should return 400 when refund amount exceeds payment amount")
        void shouldReturn400WhenRefundExceedsPayment() throws Exception {
            // Given
            BigDecimal excessiveRefund = new BigDecimal("500.00");
            when(paymentService.processRefund(1L, excessiveRefund))
                    .thenThrow(new IllegalArgumentException("Refund amount exceeds payment amount"));

            // When & Then
            mockMvc.perform(post("/api/payments/1/refund")
                            .param("amount", "500.00"))
                    .andExpect(status().isBadRequest());

            verify(paymentService, times(1)).processRefund(eq(1L), any(BigDecimal.class));
        }

        @Test
        @DisplayName("Should return 400 when refunding non-completed payment")
        void shouldReturn400WhenRefundingNonCompletedPayment() throws Exception {
            // Given
            when(paymentService.processRefund(2L, null))
                    .thenThrow(new IllegalStateException("Cannot refund non-completed payment"));

            // When & Then
            mockMvc.perform(post("/api/payments/2/refund"))
                    .andExpect(status().isBadRequest());

            verify(paymentService, times(1)).processRefund(2L, null);
        }
    }

    // =================================================================
    // GET /api/payments/filter - Filter Payments Tests
    // =================================================================
    @Nested
    @DisplayName("GET /api/payments/filter - Filter Payments")
    class FilterPaymentsTests {

        @Test
        @DisplayName("Should filter payments by status")
        void shouldFilterPaymentsByStatus() throws Exception {
            // Given
            when(paymentService.filterPayments(eq(PaymentStatus.COMPLETED), any(), any()))
                    .thenReturn(Arrays.asList(testPayment1));

            // When & Then
            mockMvc.perform(get("/api/payments/filter")
                            .param("status", "COMPLETED"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].status", is("COMPLETED")));

            verify(paymentService, times(1))
                    .filterPayments(eq(PaymentStatus.COMPLETED), any(), any());
        }

        @Test
        @DisplayName("Should filter payments by method")
        void shouldFilterPaymentsByMethod() throws Exception {
            // Given
            when(paymentService.filterPayments(any(), eq(PaymentMethod.CREDIT_CARD), any()))
                    .thenReturn(Arrays.asList(testPayment1));

            // When & Then
            mockMvc.perform(get("/api/payments/filter")
                            .param("method", "CREDIT_CARD"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].method", is("CREDIT_CARD")));

            verify(paymentService, times(1))
                    .filterPayments(any(), eq(PaymentMethod.CREDIT_CARD), any());
        }

        @Test
        @DisplayName("Should filter payments by search term")
        void shouldFilterPaymentsBySearchTerm() throws Exception {
            // Given
            when(paymentService.filterPayments(any(), any(), eq("TXN-001")))
                    .thenReturn(Arrays.asList(testPayment1));

            // When & Then
            mockMvc.perform(get("/api/payments/filter")
                            .param("search", "TXN-001"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].transactionId", is("TXN-001")));

            verify(paymentService, times(1)).filterPayments(any(), any(), eq("TXN-001"));
        }

        @Test
        @DisplayName("Should apply multiple filters")
        void shouldApplyMultipleFilters() throws Exception {
            // Given
            when(paymentService.filterPayments(
                    eq(PaymentStatus.COMPLETED),
                    eq(PaymentMethod.CREDIT_CARD),
                    eq("john")))
                    .thenReturn(Arrays.asList(testPayment1));

            // When & Then
            mockMvc.perform(get("/api/payments/filter")
                            .param("status", "COMPLETED")
                            .param("method", "CREDIT_CARD")
                            .param("search", "john"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)));

            verify(paymentService, times(1)).filterPayments(
                    eq(PaymentStatus.COMPLETED),
                    eq(PaymentMethod.CREDIT_CARD),
                    eq("john"));
        }
    }

    // =================================================================
    // GET /api/payments/statistics - Payment Statistics Tests
    // =================================================================
    @Nested
    @DisplayName("GET /api/payments/statistics - Payment Statistics")
    class PaymentStatisticsTests {

        @Test
        @DisplayName("Should return payment statistics")
        void shouldReturnPaymentStatistics() throws Exception {
            // Given
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalRevenue", new BigDecimal("212.75"));
            stats.put("completedPayments", 1);
            stats.put("pendingPayments", 1);
            stats.put("failedPayments", 0);

            when(paymentService.getPaymentStatistics()).thenReturn(stats);

            // When & Then
            mockMvc.perform(get("/api/payments/statistics"))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.totalRevenue", is(212.75)))
                    .andExpect(jsonPath("$.completedPayments", is(1)))
                    .andExpect(jsonPath("$.pendingPayments", is(1)));

            verify(paymentService, times(1)).getPaymentStatistics();
        }
    }

    // =================================================================
    // Edge Cases Tests
    // =================================================================
    @Nested
    @DisplayName("Edge Cases and Validation")
    class EdgeCaseTests {

        @Test
        @DisplayName("Should handle extremely large payment amounts")
        void shouldHandleLargeAmounts() throws Exception {
            // Given
            testPaymentDTO.setAmount(new BigDecimal("999999999.99"));
            Payment largePayment = new Payment();
            largePayment.setAmount(testPaymentDTO.getAmount());
            when(paymentService.processPayment(any(PaymentDTO.class))).thenReturn(largePayment);

            // When & Then
            mockMvc.perform(post("/api/payments")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testPaymentDTO)))
                    .andExpect(status().isCreated());

            verify(paymentService, times(1)).processPayment(any(PaymentDTO.class));
        }

        @Test
        @DisplayName("Should validate currency format")
        void shouldValidateCurrencyFormat() throws Exception {
            // Given
            testPaymentDTO.setCurrency("INVALID");

            // When & Then
            mockMvc.perform(post("/api/payments")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testPaymentDTO)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should handle concurrent payment processing")
        void shouldHandleConcurrentProcessing() throws Exception {
            // Given
            when(paymentService.processPayment(any(PaymentDTO.class)))
                    .thenThrow(new RuntimeException("Concurrent modification"));

            // When & Then
            mockMvc.perform(post("/api/payments")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testPaymentDTO)))
                    .andExpect(status().isInternalServerError());
        }
    }
}
