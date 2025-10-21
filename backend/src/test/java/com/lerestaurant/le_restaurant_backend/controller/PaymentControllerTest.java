package com.lerestaurant.le_restaurant_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lerestaurant.le_restaurant_backend.dto.PaymentDto;
import com.lerestaurant.le_restaurant_backend.dto.PaymentRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.Payment;
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
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@WebMvcTest(PaymentController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Payment Controller Tests")
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    private PaymentDto testPaymentDto;
    private PaymentRequestDto testPaymentRequest;

    @BeforeEach
    void setUp() {
        // Setup test DTO data
        testPaymentDto = new PaymentDto(
            1L,
            100L,
            new BigDecimal("50.00"),
            Payment.PaymentMethod.CREDIT_CARD,
            "TXN123456",
            Payment.PaymentStatus.COMPLETED,
            "Test payment details",
            OffsetDateTime.now(),
            OffsetDateTime.now(),
            "Gateway success response"
        );

        testPaymentRequest = new PaymentRequestDto();
        testPaymentRequest.setOrderId(100L);
        testPaymentRequest.setAmount(new BigDecimal("50.00"));
        testPaymentRequest.setPaymentMethod(Payment.PaymentMethod.CREDIT_CARD);
        testPaymentRequest.setPaymentDetails("Test payment details");
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
            PaymentDto testPaymentDto2 = new PaymentDto(
                2L,
                101L,
                new BigDecimal("75.00"),
                Payment.PaymentMethod.DEBIT_CARD,
                "TXN123457",
                Payment.PaymentStatus.PENDING,
                null,
                OffsetDateTime.now(),
                null,
                null
            );
            List<PaymentDto> payments = Arrays.asList(testPaymentDto, testPaymentDto2);
            when(paymentService.getAllPayments()).thenReturn(payments);

            // When & Then
            mockMvc.perform(get("/api/payments")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(2)))
                    .andExpect(jsonPath("$[0].orderId", is(100)))
                    .andExpect(jsonPath("$[0].amount", is(50.00)))
                    .andExpect(jsonPath("$[1].orderId", is(101)))
                    .andExpect(jsonPath("$[1].amount", is(75.00)));

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
            when(paymentService.getPaymentById(1L)).thenReturn(testPaymentDto);

            // When & Then
            mockMvc.perform(get("/api/payments/1"))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", is(1)))
                    .andExpect(jsonPath("$.orderId", is(100)))
                    .andExpect(jsonPath("$.amount", is(50.00)))
                    .andExpect(jsonPath("$.paymentMethod", is("CREDIT_CARD")))
                    .andExpect(jsonPath("$.status", is("COMPLETED")));

            verify(paymentService, times(1)).getPaymentById(1L);
        }

        @Test
        @DisplayName("Should return 404 when payment not found")
        void shouldReturn404WhenPaymentNotFound() throws Exception {
            // Given
            when(paymentService.getPaymentById(999L)).thenThrow(new RuntimeException("Payment not found with id: 999"));

            // When & Then
            mockMvc.perform(get("/api/payments/999"))
                    .andExpect(status().isNotFound());

            verify(paymentService, times(1)).getPaymentById(999L);
        }
    }

    // =================================================================
    // POST /api/payments - Create Payment Tests
    // =================================================================
    @Nested
    @DisplayName("POST /api/payments - Create Payment")
    class CreatePaymentTests {

        @Test
        @DisplayName("Should create new payment successfully")
        void shouldCreatePayment() throws Exception {
            // Given
            PaymentDto createdPayment = new PaymentDto(
                3L,
                testPaymentRequest.getOrderId(),
                testPaymentRequest.getAmount(),
                testPaymentRequest.getPaymentMethod(),
                "TXN123458",
                Payment.PaymentStatus.PENDING,
                testPaymentRequest.getPaymentDetails(),
                OffsetDateTime.now(),
                null,
                null
            );
            when(paymentService.createPayment(any(PaymentRequestDto.class))).thenReturn(createdPayment);

            // When & Then
            mockMvc.perform(post("/api/payments")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testPaymentRequest)))
                    .andDo(print())
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id", is(3)))
                    .andExpect(jsonPath("$.orderId", is(100)))
                    .andExpect(jsonPath("$.amount", is(50.00)))
                    .andExpect(jsonPath("$.status", is("PENDING")));

            verify(paymentService, times(1)).createPayment(any(PaymentRequestDto.class));
        }

        @Test
        @DisplayName("Should return 400 when order ID is missing")
        void shouldReturn400WhenOrderIdIsMissing() throws Exception {
            // Given
            testPaymentRequest.setOrderId(null);
            when(paymentService.createPayment(any(PaymentRequestDto.class)))
                    .thenThrow(new RuntimeException("Order ID is required"));

            // When & Then
            mockMvc.perform(post("/api/payments")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testPaymentRequest)))
                    .andExpect(status().isBadRequest());

            verify(paymentService, times(1)).createPayment(any(PaymentRequestDto.class));
        }

        @Test
        @DisplayName("Should return 400 when amount is invalid")
        void shouldReturn400WhenAmountIsInvalid() throws Exception {
            // Given
            testPaymentRequest.setAmount(new BigDecimal("-10.00"));
            when(paymentService.createPayment(any(PaymentRequestDto.class)))
                    .thenThrow(new RuntimeException("Amount must be positive"));

            // When & Then
            mockMvc.perform(post("/api/payments")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testPaymentRequest)))
                    .andExpect(status().isBadRequest());

            verify(paymentService, times(1)).createPayment(any(PaymentRequestDto.class));
        }

        @Test
        @DisplayName("Should return 400 when order not found")
        void shouldReturn400WhenOrderNotFound() throws Exception {
            // Given
            when(paymentService.createPayment(any(PaymentRequestDto.class)))
                    .thenThrow(new RuntimeException("Order not found with id: 100"));

            // When & Then
            mockMvc.perform(post("/api/payments")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testPaymentRequest)))
                    .andExpect(status().isBadRequest());

            verify(paymentService, times(1)).createPayment(any(PaymentRequestDto.class));
        }
    }

    // =================================================================
    // PUT /api/payments/{id}/status - Update Payment Status Tests
    // =================================================================
    @Nested
    @DisplayName("PUT /api/payments/{id}/status - Update Payment Status")
    class UpdatePaymentStatusTests {

        @Test
        @DisplayName("Should update payment status to COMPLETED successfully")
        void shouldUpdatePaymentStatusToCompleted() throws Exception {
            // Given
            PaymentDto updatedPayment = new PaymentDto(
                1L,
                100L,
                new BigDecimal("50.00"),
                Payment.PaymentMethod.CREDIT_CARD,
                "TXN123456",
                Payment.PaymentStatus.COMPLETED,
                "Test payment details",
                OffsetDateTime.now(),
                OffsetDateTime.now(),
                "Gateway success response"
            );
            when(paymentService.updatePaymentStatus(1L, Payment.PaymentStatus.COMPLETED)).thenReturn(updatedPayment);

            // When & Then
            mockMvc.perform(put("/api/payments/1/status")
                            .param("status", "COMPLETED"))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", is(1)))
                    .andExpect(jsonPath("$.status", is("COMPLETED")));

            verify(paymentService, times(1)).updatePaymentStatus(1L, Payment.PaymentStatus.COMPLETED);
        }

        @Test
        @DisplayName("Should update payment status to FAILED successfully")
        void shouldUpdatePaymentStatusToFailed() throws Exception {
            // Given
            PaymentDto failedPayment = new PaymentDto(
                1L,
                100L,
                new BigDecimal("50.00"),
                Payment.PaymentMethod.CREDIT_CARD,
                "TXN123456",
                Payment.PaymentStatus.FAILED,
                "Test payment details",
                OffsetDateTime.now(),
                null,
                "Gateway error response"
            );
            when(paymentService.updatePaymentStatus(1L, Payment.PaymentStatus.FAILED)).thenReturn(failedPayment);

            // When & Then
            mockMvc.perform(put("/api/payments/1/status")
                            .param("status", "FAILED"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status", is("FAILED")));

            verify(paymentService, times(1)).updatePaymentStatus(1L, Payment.PaymentStatus.FAILED);
        }

        @Test
        @DisplayName("Should return 404 when payment not found")
        void shouldReturn404WhenPaymentNotFoundForStatusUpdate() throws Exception {
            // Given
            when(paymentService.updatePaymentStatus(999L, Payment.PaymentStatus.COMPLETED))
                    .thenThrow(new RuntimeException("Payment not found with id: 999"));

            // When & Then
            mockMvc.perform(put("/api/payments/999/status")
                            .param("status", "COMPLETED"))
                    .andExpect(status().isNotFound());

            verify(paymentService, times(1)).updatePaymentStatus(999L, Payment.PaymentStatus.COMPLETED);
        }
    }

    // =================================================================
    // POST /api/payments/{id}/process - Process Payment Tests
    // =================================================================
    @Nested
    @DisplayName("POST /api/payments/{id}/process - Process Payment")
    class ProcessPaymentTests {

        @Test
        @DisplayName("Should process payment successfully")
        void shouldProcessPayment() throws Exception {
            // Given
            PaymentDto processedPayment = new PaymentDto(
                1L,
                100L,
                new BigDecimal("50.00"),
                Payment.PaymentMethod.CREDIT_CARD,
                "TXN123456",
                Payment.PaymentStatus.COMPLETED,
                "Test payment details",
                OffsetDateTime.now(),
                OffsetDateTime.now(),
                "Payment processed successfully"
            );
            when(paymentService.processPayment(1L)).thenReturn(processedPayment);

            // When & Then
            mockMvc.perform(post("/api/payments/1/process"))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", is(1)))
                    .andExpect(jsonPath("$.status", is("COMPLETED")))
                    .andExpect(jsonPath("$.gatewayResponse", is("Payment processed successfully")));

            verify(paymentService, times(1)).processPayment(1L);
        }

        @Test
        @DisplayName("Should return 404 when payment not found for processing")
        void shouldReturn404WhenPaymentNotFoundForProcessing() throws Exception {
            // Given
            when(paymentService.processPayment(999L))
                    .thenThrow(new RuntimeException("Payment not found with id: 999"));

            // When & Then
            mockMvc.perform(post("/api/payments/999/process"))
                    .andExpect(status().isNotFound());

            verify(paymentService, times(1)).processPayment(999L);
        }
    }

    // =================================================================
    // DELETE /api/payments/{id} - Delete Payment Tests
    // =================================================================
    @Nested
    @DisplayName("DELETE /api/payments/{id} - Delete Payment")
    class DeletePaymentTests {

        @Test
        @DisplayName("Should delete payment successfully")
        void shouldDeletePayment() throws Exception {
            // Given
            doNothing().when(paymentService).deletePayment(1L);

            // When & Then
            mockMvc.perform(delete("/api/payments/1"))
                    .andExpect(status().isNoContent());

            verify(paymentService, times(1)).deletePayment(1L);
        }

        @Test
        @DisplayName("Should return 404 when deleting non-existent payment")
        void shouldReturn404WhenDeletingNonExistentPayment() throws Exception {
            // Given
            doThrow(new RuntimeException("Payment not found with id: 999"))
                    .when(paymentService).deletePayment(999L);

            // When & Then
            mockMvc.perform(delete("/api/payments/999"))
                    .andExpect(status().isNotFound());

            verify(paymentService, times(1)).deletePayment(999L);
        }
    }

    // =================================================================
    // GET /api/payments/order/{orderId} - Get Payments by Order Tests
    // =================================================================
    @Nested
    @DisplayName("GET /api/payments/order/{orderId} - Get Payments by Order")
    class GetPaymentsByOrderTests {

        @Test
        @DisplayName("Should return payments for specific order")
        void shouldReturnPaymentsByOrder() throws Exception {
            // Given
            List<PaymentDto> orderPayments = Arrays.asList(testPaymentDto);
            when(paymentService.getPaymentsByOrderId(100L)).thenReturn(orderPayments);

            // When & Then
            mockMvc.perform(get("/api/payments/order/100"))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].orderId", is(100)))
                    .andExpect(jsonPath("$[0].amount", is(50.00)));

            verify(paymentService, times(1)).getPaymentsByOrderId(100L);
        }

        @Test
        @DisplayName("Should return empty list when no payments for order")
        void shouldReturnEmptyListForOrder() throws Exception {
            // Given
            when(paymentService.getPaymentsByOrderId(999L)).thenReturn(Arrays.asList());

            // When & Then
            mockMvc.perform(get("/api/payments/order/999"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(0)));

            verify(paymentService, times(1)).getPaymentsByOrderId(999L);
        }
    }

    // =================================================================
    // GET /api/payments/status/{status} - Get Payments by Status Tests
    // =================================================================
    @Nested
    @DisplayName("GET /api/payments/status/{status} - Get Payments by Status")
    class GetPaymentsByStatusTests {

        @Test
        @DisplayName("Should return payments with COMPLETED status")
        void shouldReturnPaymentsByCompletedStatus() throws Exception {
            // Given
            List<PaymentDto> completedPayments = Arrays.asList(testPaymentDto);
            when(paymentService.getPaymentsByStatus(Payment.PaymentStatus.COMPLETED)).thenReturn(completedPayments);

            // When & Then
            mockMvc.perform(get("/api/payments/status/COMPLETED"))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].status", is("COMPLETED")));

            verify(paymentService, times(1)).getPaymentsByStatus(Payment.PaymentStatus.COMPLETED);
        }

        @Test
        @DisplayName("Should return payments with PENDING status")
        void shouldReturnPaymentsByPendingStatus() throws Exception {
            // Given
            when(paymentService.getPaymentsByStatus(Payment.PaymentStatus.PENDING)).thenReturn(Arrays.asList());

            // When & Then
            mockMvc.perform(get("/api/payments/status/PENDING"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(0)));

            verify(paymentService, times(1)).getPaymentsByStatus(Payment.PaymentStatus.PENDING);
        }
    }
}
