package com.lerestaurant.le_restaurant_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lerestaurant.le_restaurant_backend.config.TestSecurityConfig;
import com.lerestaurant.le_restaurant_backend.dto.DeliveryDto;
import com.lerestaurant.le_restaurant_backend.dto.DeliveryCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.DeliveryUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.Delivery.DeliveryStatus;
import com.lerestaurant.le_restaurant_backend.service.DeliveryService;
import com.lerestaurant.le_restaurant_backend.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit Tests for DeliveryController (F107 - Delivery Management)
 * 
 * This test suite validates the REST API endpoints for delivery operations
 * including CRUD operations, driver assignment, and status updates.
 * 
 * @author Le Restaurant Development Team
 * @module F107-DeliveryManagement
 */
@WebMvcTest(DeliveryController.class)
@Import(TestSecurityConfig.class)
class DeliveryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private DeliveryService deliveryService;

    // Satisfies the auto-included JwtAuthenticationFilter (depends on JwtUtil).
    @MockBean
    private JwtUtil jwtUtil;

    private DeliveryDto testDelivery;

    @BeforeEach
    void setUp() {
        testDelivery = new DeliveryDto();
        testDelivery.setId(1L);
        testDelivery.setOrderId(100L);
        testDelivery.setStatus(DeliveryStatus.ASSIGNED);
        testDelivery.setAssignedAt(OffsetDateTime.now());
    }

    // =========================================================================
    // GET /api/deliveries - List All Deliveries Tests
    // =========================================================================
    @Nested
    @DisplayName("GET /api/deliveries - List Deliveries")
    class ListDeliveriesTests {

        @Test
        @DisplayName("Should return all deliveries")
        void shouldReturnAllDeliveries() throws Exception {
            DeliveryDto delivery2 = new DeliveryDto();
            delivery2.setId(2L);
            delivery2.setOrderId(101L);
            delivery2.setStatus(DeliveryStatus.IN_TRANSIT);

            List<DeliveryDto> deliveries = Arrays.asList(testDelivery, delivery2);
            when(deliveryService.getAllDeliveries()).thenReturn(deliveries);

            mockMvc.perform(get("/api/deliveries")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(2));

            verify(deliveryService, times(1)).getAllDeliveries();
        }

        @Test
        @DisplayName("Should return empty list when no deliveries exist")
        void shouldReturnEmptyList() throws Exception {
            when(deliveryService.getAllDeliveries()).thenReturn(Collections.emptyList());

            mockMvc.perform(get("/api/deliveries")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(0));
        }
    }

    // =========================================================================
    // GET /api/deliveries/{id} - Get Delivery by ID Tests
    // =========================================================================
    @Nested
    @DisplayName("GET /api/deliveries/{id} - Get Delivery by ID")
    class GetDeliveryByIdTests {

        @Test
        @DisplayName("Should return delivery by ID")
        void shouldReturnDeliveryById() throws Exception {
            when(deliveryService.getDeliveryById(1L)).thenReturn(testDelivery);

            mockMvc.perform(get("/api/deliveries/1")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.orderId").value(100));

            verify(deliveryService, times(1)).getDeliveryById(1L);
        }

        @Test
        @DisplayName("Should return 404 when delivery not found")
        void shouldReturn404WhenDeliveryNotFound() throws Exception {
            when(deliveryService.getDeliveryById(999L))
                    .thenThrow(new RuntimeException("Delivery not found with id: 999"));

            mockMvc.perform(get("/api/deliveries/999")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isNotFound());
        }
    }

    // =========================================================================
    // POST /api/deliveries - Create Delivery Tests
    // =========================================================================
    @Nested
    @DisplayName("POST /api/deliveries - Create Delivery")
    class CreateDeliveryTests {

        @Test
        @DisplayName("Should create delivery successfully")
        void shouldCreateDelivery() throws Exception {
            DeliveryCreateRequestDto createDto = new DeliveryCreateRequestDto();
            createDto.setOrderId(100L);
            createDto.setDeliveryAddressId(1L);

            when(deliveryService.createDelivery(any(DeliveryCreateRequestDto.class)))
                    .thenReturn(testDelivery);

            mockMvc.perform(post("/api/deliveries")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createDto)))
                    .andDo(print())
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(1));

            verify(deliveryService, times(1)).createDelivery(any(DeliveryCreateRequestDto.class));
        }
    }

    // =========================================================================
    // PUT /api/deliveries/{id}/status - Update Delivery Status Tests
    // =========================================================================
    @Nested
    @DisplayName("PUT /api/deliveries/{id}/status - Update Status")
    class UpdateDeliveryStatusTests {

        @Test
        @DisplayName("Should update delivery status successfully")
        void shouldUpdateDeliveryStatus() throws Exception {
            DeliveryUpdateRequestDto updateDto = new DeliveryUpdateRequestDto();
            updateDto.setStatus(DeliveryStatus.IN_TRANSIT);

            DeliveryDto updatedDelivery = new DeliveryDto();
            updatedDelivery.setId(1L);
            updatedDelivery.setStatus(DeliveryStatus.IN_TRANSIT);

            when(deliveryService.updateDeliveryStatus(eq(1L), any(DeliveryUpdateRequestDto.class)))
                    .thenReturn(updatedDelivery);

            mockMvc.perform(put("/api/deliveries/1/status")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("IN_TRANSIT"));

            verify(deliveryService, times(1)).updateDeliveryStatus(eq(1L), any(DeliveryUpdateRequestDto.class));
        }
    }

    // =========================================================================
    // PUT /api/deliveries/{id}/assign/{driverId} - Assign Driver Tests
    // =========================================================================
    @Nested
    @DisplayName("PUT /api/deliveries/{id}/assign/{driverId} - Assign Driver")
    class AssignDriverTests {

        @Test
        @DisplayName("Should assign driver to delivery")
        void shouldAssignDriver() throws Exception {
            DeliveryDto assignedDelivery = new DeliveryDto();
            assignedDelivery.setId(1L);
            assignedDelivery.setStatus(DeliveryStatus.ASSIGNED);

            when(deliveryService.assignDriver(1L, 5L)).thenReturn(assignedDelivery);

            mockMvc.perform(post("/api/deliveries/1/assign-driver/5")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("ASSIGNED"));

            verify(deliveryService, times(1)).assignDriver(1L, 5L);
        }

        @Test
        @DisplayName("Should return 404 when driver not found")
        void shouldReturn404WhenDriverNotFound() throws Exception {
            when(deliveryService.assignDriver(1L, 999L))
                    .thenThrow(new RuntimeException("Driver not found with id: 999"));

            mockMvc.perform(post("/api/deliveries/1/assign-driver/999")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isNotFound());
        }
    }

    // =========================================================================
    // DELETE /api/deliveries/{id} - Delete Delivery Tests
    // =========================================================================
    @Nested
    @DisplayName("DELETE /api/deliveries/{id} - Delete Delivery")
    class DeleteDeliveryTests {

        @Test
        @DisplayName("Should delete delivery successfully")
        void shouldDeleteDelivery() throws Exception {
            doNothing().when(deliveryService).deleteDelivery(1L);

            mockMvc.perform(delete("/api/deliveries/1")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    // DeliveryController.deleteDelivery returns 200 OK with a body (not 204).
                    .andExpect(status().isOk());

            verify(deliveryService, times(1)).deleteDelivery(1L);
        }
    }
}
