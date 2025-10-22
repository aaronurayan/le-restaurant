package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.*;
import com.lerestaurant.le_restaurant_backend.entity.*;
import com.lerestaurant.le_restaurant_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Order Management Service (F105)
 * 
 * This service handles all order-related business logic for F105 Order Management.
 * It provides comprehensive order processing, status management, and calculation.
 * This service is the foundation for F107 Delivery Management.
 * 
 * Features:
 * - Order CRUD operations
 * - Order item management
 * - Total calculation (subtotal, tax, total)
 * - Order status management
 * - Customer validation
 * - Transaction management
 * - Comprehensive logging
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F105-OrderManagement
 */
@Service
@Transactional
public class OrderService {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
    private static final BigDecimal TAX_RATE = new BigDecimal("0.10"); // 10% tax
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final RestaurantTableRepository tableRepository;
    
    @Autowired
    public OrderService(OrderRepository orderRepository,
                       OrderItemRepository orderItemRepository,
                       MenuItemRepository menuItemRepository,
                       UserRepository userRepository,
                       RestaurantTableRepository tableRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
        this.tableRepository = tableRepository;
    }
    
    /**
     * Create a new order
     * 
     * This method creates a new order with items.
     * It validates customer and menu items, calculates totals, and sets initial status.
     * 
     * @param requestDto Order creation request data
     * @return OrderDto Created order data
     * @throws RuntimeException if customer not found or menu items invalid
     */
    public OrderDto createOrder(OrderCreateRequestDto requestDto) {
        logger.info("Creating new order for customer ID: {}", requestDto.getCustomerId());
        
        // Validate customer existence
        User customer = userRepository.findById(requestDto.getCustomerId())
                .orElseThrow(() -> {
                    logger.error("Order creation failed: customer not found - {}", requestDto.getCustomerId());
                    return new RuntimeException("Customer not found with id: " + requestDto.getCustomerId());
                });
        
        // Validate table if provided
        RestaurantTable table = null;
        if (requestDto.getTableId() != null) {
            table = tableRepository.findById(requestDto.getTableId())
                    .orElseThrow(() -> {
                        logger.error("Order creation failed: table not found - {}", requestDto.getTableId());
                        return new RuntimeException("Table not found with id: " + requestDto.getTableId());
                    });
        }
        
        // Validate order has items
        if (requestDto.getItems() == null || requestDto.getItems().isEmpty()) {
            logger.error("Order creation failed: no items provided");
            throw new RuntimeException("Order must contain at least one item");
        }
        
        // Create order entity
        Order order = new Order();
        order.setCustomer(customer);
        order.setTable(table);
        order.setOrderType(requestDto.getOrderType() != null ? requestDto.getOrderType() : Order.OrderType.DINE_IN);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setOrderTime(OffsetDateTime.now());
        order.setSpecialInstructions(requestDto.getSpecialInstructions());
        order.setTipAmount(requestDto.getTipAmount() != null ? requestDto.getTipAmount() : BigDecimal.ZERO);
        
        // Create order items
        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequestDto itemRequest : requestDto.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> {
                        logger.error("Order creation failed: menu item not found - {}", itemRequest.getMenuItemId());
                        return new RuntimeException("Menu item not found with id: " + itemRequest.getMenuItemId());
                    });
            
            // Check menu item availability
            if (!menuItem.isAvailable()) {
                logger.error("Order creation failed: menu item not available - {}", menuItem.getName());
                throw new RuntimeException("Menu item not available: " + menuItem.getName());
            }
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(menuItem.getPrice());
            
            // Calculate item subtotal (getter calculates it automatically)
            BigDecimal itemSubtotal = orderItem.getSubtotal();
            subtotal = subtotal.add(itemSubtotal);
            
            order.getItems().add(orderItem);
        }
        
        // Calculate totals
        order.setSubtotal(subtotal);
        BigDecimal taxAmount = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        order.setTaxAmount(taxAmount);
        BigDecimal totalAmount = subtotal.add(taxAmount).add(order.getTipAmount());
        order.setTotalAmount(totalAmount);
        
        // Set estimated completion (30 minutes from now)
        order.setEstimatedCompletion(OffsetDateTime.now().plusMinutes(30));
        
        // Save order (cascade will save items)
        Order savedOrder = orderRepository.save(order);
        logger.info("Order created successfully with ID: {}", savedOrder.getId());
        
        return convertToDto(savedOrder);
    }
    
    /**
     * Get order by ID
     * 
     * @param id Order ID
     * @return OrderDto Order data
     * @throws RuntimeException if order not found
     */
    public OrderDto getOrderById(Long id) {
        logger.info("Retrieving order with ID: {}", id);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Order not found with ID: {}", id);
                    return new RuntimeException("Order not found with id: " + id);
                });
        return convertToDto(order);
    }
    
    /**
     * Get all orders
     * 
     * @return List<OrderDto> List of all orders
     */
    public List<OrderDto> getAllOrders() {
        logger.info("Retrieving all orders");
        return orderRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get orders by customer ID
     * 
     * @param customerId Customer ID
     * @return List<OrderDto> List of customer's orders
     */
    public List<OrderDto> getOrdersByCustomerId(Long customerId) {
        logger.info("Retrieving orders for customer ID: {}", customerId);
        return orderRepository.findByCustomerId(customerId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get orders by status
     * 
     * @param status Order status
     * @return List<OrderDto> List of orders with specified status
     */
    public List<OrderDto> getOrdersByStatus(Order.OrderStatus status) {
        logger.info("Retrieving orders with status: {}", status);
        return orderRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Update order status
     * 
     * @param id Order ID
     * @param status New status
     * @return OrderDto Updated order data
     * @throws RuntimeException if order not found
     */
    public OrderDto updateOrderStatus(Long id, Order.OrderStatus status) {
        logger.info("Updating order {} status to: {}", id, status);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Order status update failed: order not found - {}", id);
                    return new RuntimeException("Order not found with id: " + id);
                });
        
        order.setStatus(status);
        
        // Set completed timestamp if status is COMPLETED
        if (status == Order.OrderStatus.COMPLETED) {
            order.setCompletedAt(OffsetDateTime.now());
            logger.info("Order {} marked as completed", id);
        }
        
        Order updatedOrder = orderRepository.save(order);
        logger.info("Order {} status updated successfully", id);
        
        return convertToDto(updatedOrder);
    }
    
    /**
     * Update order
     * 
     * @param id Order ID
     * @param requestDto Update request data
     * @return OrderDto Updated order data
     * @throws RuntimeException if order not found
     */
    public OrderDto updateOrder(Long id, OrderUpdateRequestDto requestDto) {
        logger.info("Updating order with ID: {}", id);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Order update failed: order not found - {}", id);
                    return new RuntimeException("Order not found with id: " + id);
                });
        
        if (requestDto.getStatus() != null) {
            order.setStatus(requestDto.getStatus());
            if (requestDto.getStatus() == Order.OrderStatus.COMPLETED) {
                order.setCompletedAt(OffsetDateTime.now());
            }
        }
        
        if (requestDto.getSpecialInstructions() != null) {
            order.setSpecialInstructions(requestDto.getSpecialInstructions());
        }
        
        if (requestDto.getEstimatedCompletion() != null) {
            order.setEstimatedCompletion(requestDto.getEstimatedCompletion());
        }
        
        Order updatedOrder = orderRepository.save(order);
        logger.info("Order {} updated successfully", id);
        
        return convertToDto(updatedOrder);
    }
    
    /**
     * Delete/cancel order
     * 
     * @param id Order ID
     * @throws RuntimeException if order not found or cannot be cancelled
     */
    public void deleteOrder(Long id) {
        logger.info("Deleting/cancelling order with ID: {}", id);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Order deletion failed: order not found - {}", id);
                    return new RuntimeException("Order not found with id: " + id);
                });
        
        // Only allow cancellation if order is PENDING or CONFIRMED
        if (order.getStatus() == Order.OrderStatus.PREPARING ||
            order.getStatus() == Order.OrderStatus.READY ||
            order.getStatus() == Order.OrderStatus.COMPLETED) {
            logger.error("Order deletion failed: order cannot be cancelled in status - {}", order.getStatus());
            throw new RuntimeException("Cannot cancel order in status: " + order.getStatus());
        }
        
        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
        logger.info("Order {} cancelled successfully", id);
    }
    
    /**
     * Convert Order entity to DTO
     * 
     * @param order Order entity
     * @return OrderDto Order DTO
     */
    private OrderDto convertToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setCustomerName(order.getCustomer().getFirstName() + " " + order.getCustomer().getLastName());
        dto.setCustomerEmail(order.getCustomer().getEmail());
        
        if (order.getTable() != null) {
            dto.setTableId(order.getTable().getId());
            dto.setTableNumber(order.getTable().getTableNumber());
        }
        
        dto.setOrderType(order.getOrderType());
        dto.setSubtotal(order.getSubtotal());
        dto.setTaxAmount(order.getTaxAmount());
        dto.setTipAmount(order.getTipAmount());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setSpecialInstructions(order.getSpecialInstructions());
        dto.setOrderTime(order.getOrderTime());
        dto.setEstimatedCompletion(order.getEstimatedCompletion());
        dto.setCompletedAt(order.getCompletedAt());
        
        // Convert order items
        List<OrderItemDto> itemDtos = order.getItems().stream()
                .map(this::convertOrderItemToDto)
                .collect(Collectors.toList());
        dto.setItems(itemDtos);
        
        return dto;
    }
    
    /**
     * Convert OrderItem entity to DTO
     * 
     * @param orderItem OrderItem entity
     * @return OrderItemDto OrderItem DTO
     */
    private OrderItemDto convertOrderItemToDto(OrderItem orderItem) {
        OrderItemDto dto = new OrderItemDto();
        dto.setId(orderItem.getId());
        dto.setMenuItemId(orderItem.getMenuItem().getId());
        dto.setMenuItemName(orderItem.getMenuItem().getName());
        dto.setQuantity(orderItem.getQuantity());
        dto.setUnitPrice(orderItem.getUnitPrice());
        dto.setSubtotal(orderItem.getSubtotal());
        return dto;
    }
}
