package com.lerestaurant.le_restaurant_backend.integration;

import com.lerestaurant.le_restaurant_backend.dto.*;
import com.lerestaurant.le_restaurant_backend.entity.*;
import com.lerestaurant.le_restaurant_backend.repository.*;
import com.lerestaurant.le_restaurant_backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

/**
 * Base class for all E2E integration tests
 * Provides common test data setup and helper methods
 * Implements Separation of Concerns principle
 */
@SpringBootTest
public abstract class BaseE2ETest {

    @Autowired
    protected UserService userService;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected OrderService orderService;

    @Autowired
    protected PaymentService paymentService;

    @Autowired
    protected DeliveryService deliveryService;

    @Autowired
    protected ReservationService reservationService;

    @Autowired
    protected MenuService menuService;

    @Autowired
    protected MenuItemRepository menuItemRepository;

    /**
     * Helper: Create a test user (Customer role)
     */
    protected UserDto createTestCustomer(String email, String firstName, String lastName) {
        UserCreateRequestDto dto = new UserCreateRequestDto();
        dto.setEmail(email);
        dto.setPassword("TestPass123!");
        dto.setFirstName(firstName);
        dto.setLastName(lastName);
        dto.setPhoneNumber("+61-400-000-000");
        return userService.createUser(dto);
    }

    /**
     * Helper: Create a test menu item
     */
    protected MenuItem createTestMenuItem(String name, BigDecimal price, String category) {
        MenuItem menuItem = new MenuItem();
        menuItem.setName(name);
        menuItem.setDescription(name + " test description");
        menuItem.setPrice(price);
        menuItem.setCategory(category);
        menuItem.setAvailable(true);
        return menuItemRepository.save(menuItem);
    }

    /**
     * Helper: Create a test order
     */
    protected OrderDto createTestOrder(Long customerId, Long menuItemId, int quantity, BigDecimal price) {
        OrderCreateRequestDto orderDto = new OrderCreateRequestDto();
        orderDto.setCustomerId(customerId);
        orderDto.setOrderType(Order.OrderType.DELIVERY);

        OrderItemRequestDto orderItem = new OrderItemRequestDto();
        orderItem.setMenuItemId(menuItemId);
        orderItem.setQuantity(quantity);

        List<OrderItemRequestDto> items = new ArrayList<>();
        items.add(orderItem);
        orderDto.setItems(items);

        return orderService.createOrder(orderDto);
    }

    /**
     * Helper: Process payment for an order
     */
    protected PaymentDto processPayment(Long orderId, BigDecimal amount) {
        PaymentRequestDto paymentDto = new PaymentRequestDto();
        paymentDto.setOrderId(orderId);
        paymentDto.setAmount(amount);
        paymentDto.setPaymentMethod(Payment.PaymentMethod.CREDIT_CARD);
        return paymentService.createPayment(paymentDto);
    }

    /**
     * Helper: Create a delivery for an order
     */
    protected DeliveryDto createDelivery(Long orderId) {
        DeliveryCreateRequestDto deliveryDto = new DeliveryCreateRequestDto();
        deliveryDto.setOrderId(orderId);
        return deliveryService.createDelivery(deliveryDto);
    }

    /**
     * Helper: Create a reservation
     */
    protected ReservationDto createReservation(Long customerId, LocalDate date, LocalTime time, int guests) {
        ReservationCreateRequestDto reservationDto = new ReservationCreateRequestDto();
        reservationDto.setCustomerId(customerId);
        reservationDto.setNumberOfGuests(guests);
        
        // Combine date and time into OffsetDateTime using system default timezone
        OffsetDateTime reservationDateTime = OffsetDateTime.of(
            date, 
            time, 
            ZoneOffset.UTC
        );
        reservationDto.setReservationDateTime(reservationDateTime);
        reservationDto.setSpecialRequests("Test reservation");
        return reservationService.createReservation(reservationDto);
    }
}
