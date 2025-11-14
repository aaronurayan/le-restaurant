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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.lerestaurant.le_restaurant_backend.dto.OrderCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.OrderDto;
import com.lerestaurant.le_restaurant_backend.dto.OrderItemRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import com.lerestaurant.le_restaurant_backend.entity.Order;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.MenuItemRepository;
import com.lerestaurant.le_restaurant_backend.repository.OrderRepository;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;

/**
 * OrderService Unit Tests
 * 
 * Tests for OrderService business logic including:
 * - Order creation and validation
 * - Order status management
 * - Order item handling
 * - Error handling
 */
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MenuItemRepository menuItemRepository;

    @InjectMocks
    private OrderService orderService;

    private User testCustomer;
    private MenuItem testMenuItem;
    private Order testOrder;

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

        // Setup test menu item
        testMenuItem = new MenuItem();
        testMenuItem.setId(1L);
        testMenuItem.setName("Test Pizza");
        testMenuItem.setPrice(new BigDecimal("20.00"));
        testMenuItem.setCategory("Pizza");
        testMenuItem.setAvailable(true);

        // Setup test order
        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setCustomer(testCustomer);
        testOrder.setTotalAmount(new BigDecimal("40.00"));
        testOrder.setStatus(Order.OrderStatus.PENDING);
        testOrder.setOrderTime(OffsetDateTime.now());
    }

    @Test
    void testCreateOrder_Success() {
        // Arrange
        OrderCreateRequestDto requestDto = new OrderCreateRequestDto();
        requestDto.setCustomerId(1L);
        requestDto.setTipAmount(new BigDecimal("5.00"));
        
        OrderItemRequestDto itemDto = new OrderItemRequestDto();
        itemDto.setMenuItemId(1L);
        itemDto.setQuantity(2);
        requestDto.setItems(List.of(itemDto));

        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(menuItemRepository.findById(1L)).thenReturn(Optional.of(testMenuItem));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        // Act
        OrderDto result = orderService.createOrder(requestDto);

        // Assert
        assertNotNull(result);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void testCreateOrder_CustomerNotFound() {
        // Arrange
        OrderCreateRequestDto requestDto = new OrderCreateRequestDto();
        requestDto.setCustomerId(999L);
        requestDto.setItems(new ArrayList<>());

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orderService.createOrder(requestDto);
        });

        assertTrue(exception.getMessage().contains("Customer not found"));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void testCreateOrder_MenuItemNotFound() {
        // Arrange
        OrderCreateRequestDto requestDto = new OrderCreateRequestDto();
        requestDto.setCustomerId(1L);
        
        OrderItemRequestDto itemDto = new OrderItemRequestDto();
        itemDto.setMenuItemId(999L);
        itemDto.setQuantity(1);
        requestDto.setItems(List.of(itemDto));

        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(menuItemRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orderService.createOrder(requestDto);
        });

        assertTrue(exception.getMessage().contains("Menu item not found"));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void testCreateOrder_EmptyItems() {
        // Arrange
        OrderCreateRequestDto requestDto = new OrderCreateRequestDto();
        requestDto.setCustomerId(1L);
        requestDto.setItems(new ArrayList<>());

        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            orderService.createOrder(requestDto);
        });

        assertTrue(exception.getMessage().contains("Order must have at least one item"));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void testGetOrderById_Success() {
        // Arrange
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

        // Act
        OrderDto result = orderService.getOrderById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testGetOrderById_NotFound() {
        // Arrange
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orderService.getOrderById(999L);
        });

        assertTrue(exception.getMessage().contains("Order not found"));
    }

    @Test
    void testUpdateOrderStatus_Success() {
        // Arrange
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        // Act
        OrderDto result = orderService.updateOrderStatus(1L, Order.OrderStatus.CONFIRMED);

        // Assert
        assertNotNull(result);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void testUpdateOrderStatus_NotFound() {
        // Arrange
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orderService.updateOrderStatus(999L, Order.OrderStatus.CONFIRMED);
        });

        assertTrue(exception.getMessage().contains("Order not found"));
        verify(orderRepository, never()).save(any(Order.class));
    }
}
