package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.DeliveryCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.DeliveryDto;
import com.lerestaurant.le_restaurant_backend.dto.DeliveryUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.*;
import com.lerestaurant.le_restaurant_backend.repository.DeliveryAddressRepository;
import com.lerestaurant.le_restaurant_backend.repository.DeliveryDriverRepository;
import com.lerestaurant.le_restaurant_backend.repository.DeliveryRepository;
import com.lerestaurant.le_restaurant_backend.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit Tests for DeliveryService (F107 - Delivery Management)
 * 
 * This test suite validates the business logic for delivery management operations
 * including delivery creation, driver assignment, status updates, and retrieval.
 * 
 * @author Le Restaurant Development Team
 * @module F107-DeliveryManagement
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("DeliveryService Tests (F107)")
class DeliveryServiceTest {

    @Mock
    private DeliveryRepository deliveryRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private DeliveryAddressRepository deliveryAddressRepository;

    @Mock
    private DeliveryDriverRepository deliveryDriverRepository;

    @InjectMocks
    private DeliveryService deliveryService;

    private Order testOrder;
    private DeliveryAddress testAddress;
    private DeliveryDriver testDriver;
    private User testCustomer;
    private User testDriverUser;
    private Delivery testDelivery;
    private DeliveryCreateRequestDto testDeliveryCreateRequest;

    @BeforeEach
    void setUp() {
        // Setup test customer
        testCustomer = new User();
        testCustomer.setId(1L);
        testCustomer.setEmail("customer@example.com");
        testCustomer.setFirstName("John");
        testCustomer.setLastName("Doe");

        // Setup test driver user
        testDriverUser = new User();
        testDriverUser.setId(10L);
        testDriverUser.setEmail("driver@example.com");
        testDriverUser.setFirstName("Driver");
        testDriverUser.setLastName("Smith");
        testDriverUser.setPhoneNumber("0412345678");

        // Setup test order (DELIVERY type)
        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setCustomer(testCustomer);
        testOrder.setOrderType(Order.OrderType.DELIVERY);
        testOrder.setStatus(Order.OrderStatus.CONFIRMED);
        testOrder.setSubtotal(new BigDecimal("25.00"));
        testOrder.setTaxAmount(new BigDecimal("2.50"));
        testOrder.setTotalAmount(new BigDecimal("32.50"));

        // Setup test delivery address
        testAddress = new DeliveryAddress();
        testAddress.setId(1L);
        testAddress.setUser(testCustomer);
        testAddress.setAddressLine1("123 Main St");
        testAddress.setCity("Sydney");
        testAddress.setState("NSW");
        testAddress.setPostalCode("2000");
        testAddress.setCountry("Australia");

        // Setup test delivery driver
        testDriver = new DeliveryDriver();
        testDriver.setId(1L);
        testDriver.setUser(testDriverUser);
        testDriver.setVehicleType("Motorcycle");
        testDriver.setLicensePlate("ABC123");
        testDriver.setStatus(DeliveryDriver.DriverStatus.AVAILABLE);

        // Setup test delivery
        testDelivery = new Delivery();
        testDelivery.setId(1L);
        testDelivery.setOrder(testOrder);
        testDelivery.setDeliveryAddress(testAddress);
        testDelivery.setDriver(testDriver);
        testDelivery.setDeliveryFee(new BigDecimal("5.00"));
        testDelivery.setEstimatedDeliveryTimeMinutes(30);
        testDelivery.setStatus(Delivery.DeliveryStatus.ASSIGNED);
        testDelivery.setDeliveryInstructions("Ring doorbell twice");
        testDelivery.setAssignedAt(OffsetDateTime.now());

        // Setup request DTO
        testDeliveryCreateRequest = new DeliveryCreateRequestDto();
        testDeliveryCreateRequest.setOrderId(1L);
        testDeliveryCreateRequest.setDeliveryAddressId(1L);
        testDeliveryCreateRequest.setDeliveryFee(new BigDecimal("5.00"));
        testDeliveryCreateRequest.setEstimatedDeliveryTimeMinutes(30);
        testDeliveryCreateRequest.setDeliveryInstructions("Ring doorbell twice");
    }

    // =================================================================
    // Create Delivery Tests
    // =================================================================
    @Nested
    @DisplayName("Create Delivery Tests")
    class CreateDeliveryTests {

        @Test
        @DisplayName("Should create delivery successfully with valid data")
        void shouldCreateDeliverySuccessfully() {
            // Given
            when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
            when(deliveryAddressRepository.findById(1L)).thenReturn(Optional.of(testAddress));
            when(deliveryRepository.save(any(Delivery.class))).thenReturn(testDelivery);

            // When
            DeliveryDto createdDelivery = deliveryService.createDelivery(testDeliveryCreateRequest);

            // Then
            assertThat(createdDelivery).isNotNull();
            assertThat(createdDelivery.getId()).isEqualTo(1L);
            assertThat(createdDelivery.getStatus()).isEqualTo(Delivery.DeliveryStatus.ASSIGNED);
            assertThat(createdDelivery.getDeliveryFee()).isEqualByComparingTo(new BigDecimal("5.00"));
            verify(deliveryRepository, times(1)).save(any(Delivery.class));
        }

        @Test
        @DisplayName("Should throw exception when order not found")
        void shouldThrowExceptionWhenOrderNotFound() {
            // Given
            when(orderRepository.findById(1L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> deliveryService.createDelivery(testDeliveryCreateRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Order not found");

            verify(deliveryRepository, never()).save(any(Delivery.class));
        }

        @Test
        @DisplayName("Should throw exception when order type is not DELIVERY")
        void shouldThrowExceptionWhenOrderTypeNotDelivery() {
            // Given
            testOrder.setOrderType(Order.OrderType.DINE_IN);
            when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

            // When & Then
            assertThatThrownBy(() -> deliveryService.createDelivery(testDeliveryCreateRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Order type must be DELIVERY");

            verify(deliveryRepository, never()).save(any(Delivery.class));
        }

        @Test
        @DisplayName("Should throw exception when delivery address not found")
        void shouldThrowExceptionWhenAddressNotFound() {
            // Given
            when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
            when(deliveryAddressRepository.findById(1L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> deliveryService.createDelivery(testDeliveryCreateRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Delivery address not found");

            verify(deliveryRepository, never()).save(any(Delivery.class));
        }

        @Test
        @DisplayName("Should set default status to ASSIGNED on creation")
        void shouldSetDefaultStatusToAssigned() {
            // Given
            when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
            when(deliveryAddressRepository.findById(1L)).thenReturn(Optional.of(testAddress));
            when(deliveryRepository.save(any(Delivery.class))).thenReturn(testDelivery);

            // When
            DeliveryDto createdDelivery = deliveryService.createDelivery(testDeliveryCreateRequest);

            // Then
            assertThat(createdDelivery.getStatus()).isEqualTo(Delivery.DeliveryStatus.ASSIGNED);
        }
    }

    // =================================================================
    // Get Delivery Tests
    // =================================================================
    @Nested
    @DisplayName("Get Delivery Tests")
    class GetDeliveryTests {

        @Test
        @DisplayName("Should return delivery by ID")
        void shouldReturnDeliveryById() {
            // Given
            when(deliveryRepository.findById(1L)).thenReturn(Optional.of(testDelivery));

            // When
            DeliveryDto foundDelivery = deliveryService.getDeliveryById(1L);

            // Then
            assertThat(foundDelivery).isNotNull();
            assertThat(foundDelivery.getId()).isEqualTo(1L);
            assertThat(foundDelivery.getOrderId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("Should throw exception when delivery not found")
        void shouldThrowExceptionWhenDeliveryNotFound() {
            // Given
            when(deliveryRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> deliveryService.getDeliveryById(99L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Delivery not found");
        }

        @Test
        @DisplayName("Should return all deliveries")
        void shouldReturnAllDeliveries() {
            // Given
            List<Delivery> deliveries = Arrays.asList(testDelivery);
            when(deliveryRepository.findAll()).thenReturn(deliveries);

            // When
            List<DeliveryDto> allDeliveries = deliveryService.getAllDeliveries();

            // Then
            assertThat(allDeliveries).isNotNull();
            assertThat(allDeliveries).hasSize(1);
        }

        @Test
        @DisplayName("Should return deliveries by status")
        void shouldReturnDeliveriesByStatus() {
            // Given
            List<Delivery> assignedDeliveries = Arrays.asList(testDelivery);
            when(deliveryRepository.findByStatus(Delivery.DeliveryStatus.ASSIGNED)).thenReturn(assignedDeliveries);

            // When
            List<DeliveryDto> deliveries = deliveryService.getDeliveriesByStatus(Delivery.DeliveryStatus.ASSIGNED);

            // Then
            assertThat(deliveries).isNotNull();
            assertThat(deliveries).hasSize(1);
            assertThat(deliveries.get(0).getStatus()).isEqualTo(Delivery.DeliveryStatus.ASSIGNED);
        }

        @Test
        @DisplayName("Should return deliveries by driver")
        void shouldReturnDeliveriesByDriver() {
            // Given
            List<Delivery> driverDeliveries = Arrays.asList(testDelivery);
            when(deliveryRepository.findByDriverId(1L)).thenReturn(driverDeliveries);

            // When
            List<DeliveryDto> deliveries = deliveryService.getDeliveriesByDriver(1L);

            // Then
            assertThat(deliveries).isNotNull();
            assertThat(deliveries).hasSize(1);
            assertThat(deliveries.get(0).getDriverId()).isEqualTo(1L);
        }
    }

    // =================================================================
    // Assign Driver Tests
    // =================================================================
    @Nested
    @DisplayName("Assign Driver Tests")
    class AssignDriverTests {

        @Test
        @DisplayName("Should assign driver to delivery successfully")
        void shouldAssignDriverSuccessfully() {
            // Given
            testDelivery.setDriver(null); // Start without driver
            testDelivery.setStatus(Delivery.DeliveryStatus.ASSIGNED);
            when(deliveryRepository.findById(1L)).thenReturn(Optional.of(testDelivery));
            when(deliveryDriverRepository.findById(1L)).thenReturn(Optional.of(testDriver));
            when(deliveryRepository.save(any(Delivery.class))).thenAnswer(invocation -> {
                Delivery delivery = invocation.getArgument(0);
                delivery.setDriver(testDriver);
                delivery.setAssignedAt(OffsetDateTime.now());
                return delivery;
            });

            // When
            DeliveryDto updatedDelivery = deliveryService.assignDriver(1L, 1L);

            // Then
            assertThat(updatedDelivery).isNotNull();
            assertThat(updatedDelivery.getDriverId()).isEqualTo(1L);
            assertThat(updatedDelivery.getAssignedAt()).isNotNull();
            verify(deliveryRepository, times(1)).save(any(Delivery.class));
        }

        @Test
        @DisplayName("Should throw exception when delivery not found for driver assignment")
        void shouldThrowExceptionWhenDeliveryNotFoundForAssignment() {
            // Given
            when(deliveryRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> deliveryService.assignDriver(99L, 1L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Delivery not found");

            verify(deliveryRepository, never()).save(any(Delivery.class));
        }

        @Test
        @DisplayName("Should throw exception when driver not found")
        void shouldThrowExceptionWhenDriverNotFound() {
            // Given
            when(deliveryRepository.findById(1L)).thenReturn(Optional.of(testDelivery));
            when(deliveryDriverRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> deliveryService.assignDriver(1L, 99L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Delivery driver not found");

            verify(deliveryRepository, never()).save(any(Delivery.class));
        }
    }

    // =================================================================
    // Update Delivery Status Tests
    // =================================================================
    @Nested
    @DisplayName("Update Delivery Status Tests")
    class UpdateDeliveryStatusTests {

        @Test
        @DisplayName("Should update delivery status to PICKED_UP")
        void shouldUpdateStatusToPickedUp() {
            // Given
            DeliveryUpdateRequestDto updateRequest = new DeliveryUpdateRequestDto();
            updateRequest.setStatus(Delivery.DeliveryStatus.PICKED_UP);

            testDelivery.setStatus(Delivery.DeliveryStatus.PICKED_UP);
            testDelivery.setPickedUpAt(OffsetDateTime.now());

            when(deliveryRepository.findById(1L)).thenReturn(Optional.of(testDelivery));
            when(deliveryRepository.save(any(Delivery.class))).thenReturn(testDelivery);

            // When
            DeliveryDto updatedDelivery = deliveryService.updateDeliveryStatus(1L, updateRequest);

            // Then
            assertThat(updatedDelivery.getStatus()).isEqualTo(Delivery.DeliveryStatus.PICKED_UP);
            assertThat(updatedDelivery.getPickedUpAt()).isNotNull();
            verify(deliveryRepository, times(1)).save(any(Delivery.class));
        }

        @Test
        @DisplayName("Should update delivery status to DELIVERED")
        void shouldUpdateStatusToDelivered() {
            // Given
            DeliveryUpdateRequestDto updateRequest = new DeliveryUpdateRequestDto();
            updateRequest.setStatus(Delivery.DeliveryStatus.DELIVERED);

            testDelivery.setStatus(Delivery.DeliveryStatus.DELIVERED);
            testDelivery.setDeliveredAt(OffsetDateTime.now());

            when(deliveryRepository.findById(1L)).thenReturn(Optional.of(testDelivery));
            when(deliveryRepository.save(any(Delivery.class))).thenReturn(testDelivery);

            // When
            DeliveryDto updatedDelivery = deliveryService.updateDeliveryStatus(1L, updateRequest);

            // Then
            assertThat(updatedDelivery.getStatus()).isEqualTo(Delivery.DeliveryStatus.DELIVERED);
            assertThat(updatedDelivery.getDeliveredAt()).isNotNull();
            verify(deliveryRepository, times(1)).save(any(Delivery.class));
        }

        @Test
        @DisplayName("Should throw exception when updating non-existent delivery")
        void shouldThrowExceptionWhenUpdatingNonExistentDelivery() {
            // Given
            DeliveryUpdateRequestDto updateRequest = new DeliveryUpdateRequestDto();
            updateRequest.setStatus(Delivery.DeliveryStatus.DELIVERED);
            when(deliveryRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> deliveryService.updateDeliveryStatus(99L, updateRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Delivery not found");

            verify(deliveryRepository, never()).save(any(Delivery.class));
        }
    }

    // =================================================================
    // Delete Delivery Tests
    // =================================================================
    @Nested
    @DisplayName("Delete Delivery Tests")
    class DeleteDeliveryTests {

        @Test
        @DisplayName("Should delete delivery successfully")
        void shouldDeleteDeliverySuccessfully() {
            // Given
            testDelivery.setStatus(Delivery.DeliveryStatus.ASSIGNED); // Only ASSIGNED or FAILED can be deleted
            when(deliveryRepository.findById(1L)).thenReturn(Optional.of(testDelivery));

            // When
            deliveryService.deleteDelivery(1L);

            // Then
            verify(deliveryRepository, times(1)).deleteById(1L);
        }

        @Test
        @DisplayName("Should throw exception when deleting non-existent delivery")
        void shouldThrowExceptionWhenDeletingNonExistentDelivery() {
            // Given
            when(deliveryRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> deliveryService.deleteDelivery(99L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Delivery not found");

            verify(deliveryRepository, never()).deleteById(anyLong());
        }
    }
}
