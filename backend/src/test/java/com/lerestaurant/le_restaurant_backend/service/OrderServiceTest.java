package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.OrderCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.OrderDto;
import com.lerestaurant.le_restaurant_backend.dto.OrderItemRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.OrderUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.*;
import com.lerestaurant.le_restaurant_backend.repository.MenuItemRepository;
import com.lerestaurant.le_restaurant_backend.repository.OrderItemRepository;
import com.lerestaurant.le_restaurant_backend.repository.OrderRepository;
import com.lerestaurant.le_restaurant_backend.repository.RestaurantTableRepository;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;
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
 * Unit Tests for OrderService (F105 - Order Management)
 * 
 * This test suite validates the business logic for order management operations
 * including order creation, status updates, and retrieval.
 * 
 * @author Le Restaurant Development Team
 * @module F105-OrderManagement
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("OrderService Tests (F105)")
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MenuItemRepository menuItemRepository;

    @Mock
    private RestaurantTableRepository restaurantTableRepository;

    @InjectMocks
    private OrderService orderService;

    private User testCustomer;
    private MenuItem testMenuItem;
    private RestaurantTable testTable;
    private Order testOrder;
    private OrderCreateRequestDto testOrderCreateRequest;

    @BeforeEach
    void setUp() {
        // Setup test customer
        testCustomer = new User();
        testCustomer.setId(1L);
        testCustomer.setEmail("customer@example.com");
        testCustomer.setFirstName("John");
        testCustomer.setLastName("Doe");
        testCustomer.setRole(User.UserRole.CUSTOMER);

        // Setup test menu item
        testMenuItem = new MenuItem();
        testMenuItem.setId(100L);
        testMenuItem.setName("Burger");
        testMenuItem.setPrice(new BigDecimal("12.50"));
        testMenuItem.setAvailable(true);

        // Setup test table
        testTable = new RestaurantTable();
        testTable.setId(1L);
        testTable.setTableNumber("T1");
        testTable.setCapacity(4);

        // Setup test order
        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setCustomer(testCustomer);
        testOrder.setTable(testTable);
        testOrder.setOrderType(Order.OrderType.DINE_IN);
        testOrder.setStatus(Order.OrderStatus.PENDING);
        testOrder.setSubtotal(new BigDecimal("12.50"));
        testOrder.setTaxAmount(new BigDecimal("1.25"));
        testOrder.setTotalAmount(new BigDecimal("13.75"));
        testOrder.setCreatedAt(OffsetDateTime.now());

        // Setup request DTO
        testOrderCreateRequest = new OrderCreateRequestDto();
        testOrderCreateRequest.setCustomerId(1L);
        testOrderCreateRequest.setTableId(1L);
        testOrderCreateRequest.setOrderType("DINE_IN");
        testOrderCreateRequest.setItems(Arrays.asList(
            new OrderItemRequestDto(100L, 1)
        ));
    }

    // =================================================================
    // Create Order Tests
    // =================================================================
    @Nested
    @DisplayName("Create Order Tests")
    class CreateOrderTests {

        @Test
        @DisplayName("Should create order successfully with valid data")
        void shouldCreateOrderSuccessfully() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
            when(restaurantTableRepository.findById(1L)).thenReturn(Optional.of(testTable));
            when(menuItemRepository.findById(100L)).thenReturn(Optional.of(testMenuItem));
            when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

            // When
            OrderDto createdOrder = orderService.createOrder(testOrderCreateRequest);

            // Then
            assertThat(createdOrder).isNotNull();
            assertThat(createdOrder.getId()).isEqualTo(1L);
            assertThat(createdOrder.getStatus()).isEqualTo("PENDING");
            verify(orderRepository, times(1)).save(any(Order.class));
        }

        @Test
        @DisplayName("Should throw exception when customer not found")
        void shouldThrowExceptionWhenCustomerNotFound() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> orderService.createOrder(testOrderCreateRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Customer not found");

            verify(orderRepository, never()).save(any(Order.class));
        }

        @Test
        @DisplayName("Should throw exception when table not found")
        void shouldThrowExceptionWhenTableNotFound() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
            when(restaurantTableRepository.findById(1L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> orderService.createOrder(testOrderCreateRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Table not found");

            verify(orderRepository, never()).save(any(Order.class));
        }

        @Test
        @DisplayName("Should apply 10% tax to order subtotal")
        void shouldApplyTaxCorrectly() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
            when(restaurantTableRepository.findById(1L)).thenReturn(Optional.of(testTable));
            when(menuItemRepository.findById(100L)).thenReturn(Optional.of(testMenuItem));
            when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

            // When
            OrderDto createdOrder = orderService.createOrder(testOrderCreateRequest);

            // Then
            assertThat(createdOrder.getTaxAmount()).isEqualTo(new BigDecimal("1.25"));
            assertThat(createdOrder.getTotalAmount()).isEqualTo(new BigDecimal("13.75"));
        }

        @Test
        @DisplayName("Should set order status to PENDING on creation")
        void shouldSetOrderStatusToPending() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
            when(restaurantTableRepository.findById(1L)).thenReturn(Optional.of(testTable));
            when(menuItemRepository.findById(100L)).thenReturn(Optional.of(testMenuItem));
            when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

            // When
            OrderDto createdOrder = orderService.createOrder(testOrderCreateRequest);

            // Then
            assertThat(createdOrder.getStatus()).isEqualTo("PENDING");
        }
    }

    // =================================================================
    // Get Order Tests
    // =================================================================
    @Nested
    @DisplayName("Get Order Tests")
    class GetOrderTests {

        @Test
        @DisplayName("Should return order by ID")
        void shouldReturnOrderById() {
            // Given
            when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

            // When
            OrderDto foundOrder = orderService.getOrderById(1L);

            // Then
            assertThat(foundOrder).isNotNull();
            assertThat(foundOrder.getId()).isEqualTo(1L);
            assertThat(foundOrder.getCustomerId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("Should throw exception when order not found")
        void shouldThrowExceptionWhenOrderNotFound() {
            // Given
            when(orderRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> orderService.getOrderById(99L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Order not found");
        }

        @Test
        @DisplayName("Should return all orders")
        void shouldReturnAllOrders() {
            // Given
            List<Order> orders = Arrays.asList(testOrder);
            when(orderRepository.findAll()).thenReturn(orders);

            // When
            List<OrderDto> allOrders = orderService.getAllOrders();

            // Then
            assertThat(allOrders).isNotNull();
            assertThat(allOrders).hasSize(1);
        }

        @Test
        @DisplayName("Should return orders by customer ID")
        void shouldReturnOrdersByCustomerId() {
            // Given
            List<Order> customerOrders = Arrays.asList(testOrder);
            when(orderRepository.findByCustomerId(1L)).thenReturn(customerOrders);

            // When
            List<OrderDto> orders = orderService.getOrdersByCustomerId(1L);

            // Then
            assertThat(orders).isNotNull();
            assertThat(orders).hasSize(1);
            assertThat(orders.get(0).getCustomerId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("Should return orders by status")
        void shouldReturnOrdersByStatus() {
            // Given
            List<Order> pendingOrders = Arrays.asList(testOrder);
            when(orderRepository.findByStatus(Order.OrderStatus.PENDING)).thenReturn(pendingOrders);

            // When
            List<OrderDto> orders = orderService.getOrdersByStatus(Order.OrderStatus.PENDING);

            // Then
            assertThat(orders).isNotNull();
            assertThat(orders).hasSize(1);
            assertThat(orders.get(0).getStatus()).isEqualTo("PENDING");
        }
    }

    // =================================================================
    // Update Order Tests
    // =================================================================
    @Nested
    @DisplayName("Update Order Tests")
    class UpdateOrderTests {

        @Test
        @DisplayName("Should update order status to COMPLETED")
        void shouldUpdateOrderStatusToCompleted() {
            // Given
            testOrder.setStatus(Order.OrderStatus.COMPLETED);
            testOrder.setCompletedAt(OffsetDateTime.now());
            when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
            when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

            // When
            OrderDto updatedOrder = orderService.updateOrderStatus(1L, "COMPLETED");

            // Then
            assertThat(updatedOrder.getStatus()).isEqualTo("COMPLETED");
            assertThat(updatedOrder.getCompletedAt()).isNotNull();
            verify(orderRepository, times(1)).save(any(Order.class));
        }

        @Test
        @DisplayName("Should throw exception when updating non-existent order")
        void shouldThrowExceptionWhenUpdatingNonExistentOrder() {
            // Given
            when(orderRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> orderService.updateOrderStatus(99L, "COMPLETED"))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Order not found");

            verify(orderRepository, never()).save(any(Order.class));
        }
    }

    // =================================================================
    // Delete Order Tests
    // =================================================================
    @Nested
    @DisplayName("Delete Order Tests")
    class DeleteOrderTests {

        @Test
        @DisplayName("Should delete order with PENDING status")
        void shouldDeletePendingOrder() {
            // Given
            testOrder.setStatus(Order.OrderStatus.PENDING);
            when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

            // When
            orderService.deleteOrder(1L);

            // Then
            verify(orderRepository, times(1)).deleteById(1L);
        }

        @Test
        @DisplayName("Should throw exception when deleting completed order")
        void shouldThrowExceptionWhenDeletingCompletedOrder() {
            // Given
            testOrder.setStatus(Order.OrderStatus.COMPLETED);
            when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

            // When & Then
            assertThatThrownBy(() -> orderService.deleteOrder(1L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Cannot delete");

            verify(orderRepository, never()).deleteById(anyLong());
        }

        @Test
        @DisplayName("Should throw exception when deleting non-existent order")
        void shouldThrowExceptionWhenDeletingNonExistentOrder() {
            // Given
            when(orderRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> orderService.deleteOrder(99L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Order not found");

            verify(orderRepository, never()).deleteById(anyLong());
        }
    }
}
