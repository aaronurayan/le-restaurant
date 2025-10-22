package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.DeliveryCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.DeliveryDto;
import com.lerestaurant.le_restaurant_backend.dto.DeliveryUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.Delivery;
import com.lerestaurant.le_restaurant_backend.entity.DeliveryAddress;
import com.lerestaurant.le_restaurant_backend.entity.DeliveryDriver;
import com.lerestaurant.le_restaurant_backend.entity.Order;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.DeliveryAddressRepository;
import com.lerestaurant.le_restaurant_backend.repository.DeliveryDriverRepository;
import com.lerestaurant.le_restaurant_backend.repository.DeliveryRepository;
import com.lerestaurant.le_restaurant_backend.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Delivery Service (F107)
 * 
 * This service handles business logic for delivery management.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F107-DeliveryManagement
 */
@Service
@Transactional
public class DeliveryService {
    
    private static final Logger logger = LoggerFactory.getLogger(DeliveryService.class);
    
    private final DeliveryRepository deliveryRepository;
    private final OrderRepository orderRepository;
    private final DeliveryAddressRepository deliveryAddressRepository;
    private final DeliveryDriverRepository deliveryDriverRepository;
    
    @Autowired
    public DeliveryService(DeliveryRepository deliveryRepository,
                          OrderRepository orderRepository,
                          DeliveryAddressRepository deliveryAddressRepository,
                          DeliveryDriverRepository deliveryDriverRepository) {
        this.deliveryRepository = deliveryRepository;
        this.orderRepository = orderRepository;
        this.deliveryAddressRepository = deliveryAddressRepository;
        this.deliveryDriverRepository = deliveryDriverRepository;
    }
    
    /**
     * Create new delivery
     * 
     * @param requestDto Delivery creation request
     * @return Created delivery as DTO
     * @throws RuntimeException if order not found or address not found
     */
    public DeliveryDto createDelivery(DeliveryCreateRequestDto requestDto) {
        logger.info("Creating new delivery for order ID: {}", requestDto.getOrderId());
        
        // Validate order exists
        Order order = orderRepository.findById(requestDto.getOrderId())
            .orElseThrow(() -> new RuntimeException("Order not found with ID: " + requestDto.getOrderId()));
        
        // Validate order type is DELIVERY
        if (order.getOrderType() != Order.OrderType.DELIVERY) {
            throw new RuntimeException("Order type must be DELIVERY to create delivery");
        }
        
        // Validate address exists
        DeliveryAddress address = deliveryAddressRepository.findById(requestDto.getDeliveryAddressId())
            .orElseThrow(() -> new RuntimeException("Delivery address not found with ID: " + requestDto.getDeliveryAddressId()));
        
        // Create new delivery
        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setDeliveryAddress(address);
        delivery.setDeliveryFee(requestDto.getDeliveryFee());
        delivery.setEstimatedDeliveryTimeMinutes(requestDto.getEstimatedDeliveryTimeMinutes());
        delivery.setDeliveryInstructions(requestDto.getDeliveryInstructions());
        delivery.setStatus(Delivery.DeliveryStatus.ASSIGNED); // Default status is ASSIGNED
        
        Delivery savedDelivery = deliveryRepository.save(delivery);
        logger.info("Created delivery with ID: {}", savedDelivery.getId());
        
        return convertToDto(savedDelivery);
    }
    
    /**
     * Get delivery by ID
     * 
     * @param id Delivery ID
     * @return Delivery as DTO
     * @throws RuntimeException if delivery not found
     */
    public DeliveryDto getDeliveryById(Long id) {
        logger.info("Fetching delivery with ID: {}", id);
        
        Delivery delivery = deliveryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Delivery not found with ID: " + id));
        
        return convertToDto(delivery);
    }
    
    /**
     * Get all deliveries
     * 
     * @return List of all deliveries as DTOs
     */
    public List<DeliveryDto> getAllDeliveries() {
        logger.info("Fetching all deliveries");
        
        List<Delivery> deliveries = deliveryRepository.findAll();
        return deliveries.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Get deliveries by status
     * 
     * @param status Delivery status
     * @return List of deliveries with given status
     */
    public List<DeliveryDto> getDeliveriesByStatus(Delivery.DeliveryStatus status) {
        logger.info("Fetching deliveries with status: {}", status);
        
        List<Delivery> deliveries = deliveryRepository.findByStatus(status);
        return deliveries.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Get deliveries by driver
     * 
     * @param driverId Driver (User) ID
     * @return List of deliveries assigned to driver
     */
    public List<DeliveryDto> getDeliveriesByDriver(Long driverId) {
        logger.info("Fetching deliveries for driver ID: {}", driverId);
        
        List<Delivery> deliveries = deliveryRepository.findByDriverId(driverId);
        return deliveries.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Assign driver to delivery
     * 
     * @param id Delivery ID
     * @param driverId DeliveryDriver ID
     * @return Updated delivery as DTO
     * @throws RuntimeException if delivery or driver not found
     */
    public DeliveryDto assignDriver(Long id, Long driverId) {
        logger.info("Assigning driver {} to delivery {}", driverId, id);
        
        Delivery delivery = deliveryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Delivery not found with ID: " + id));
        
        DeliveryDriver driver = deliveryDriverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Delivery driver not found with ID: " + driverId));
        
        // Check driver availability
        if (driver.getStatus() != DeliveryDriver.DriverStatus.AVAILABLE) {
            logger.warn("Driver {} is not available, current status: {}", driverId, driver.getStatus());
        }
        
        delivery.setDriver(driver);
        delivery.setStatus(Delivery.DeliveryStatus.ASSIGNED);
        delivery.setAssignedAt(OffsetDateTime.now());
        
        Delivery updatedDelivery = deliveryRepository.save(delivery);
        logger.info("Assigned driver {} to delivery {}", driverId, id);
        
        return convertToDto(updatedDelivery);
    }
    
    /**
     * Update delivery status
     * 
     * @param id Delivery ID
     * @param requestDto Update request with new status
     * @return Updated delivery as DTO
     * @throws RuntimeException if delivery not found
     */
    public DeliveryDto updateDeliveryStatus(Long id, DeliveryUpdateRequestDto requestDto) {
        logger.info("Updating delivery {} to status: {}", id, requestDto.getStatus());
        
        Delivery delivery = deliveryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Delivery not found with ID: " + id));
        
        // Update driver if provided
        if (requestDto.getDriverId() != null) {
            DeliveryDriver driver = deliveryDriverRepository.findById(requestDto.getDriverId())
                .orElseThrow(() -> new RuntimeException("Delivery driver not found with ID: " + requestDto.getDriverId()));
            delivery.setDriver(driver);
            if (delivery.getAssignedAt() == null) {
                delivery.setAssignedAt(OffsetDateTime.now());
            }
        }
        
        // Update status and corresponding timestamps
        if (requestDto.getStatus() != null) {
            delivery.setStatus(requestDto.getStatus());
            
            switch (requestDto.getStatus()) {
                case ASSIGNED:
                    if (delivery.getAssignedAt() == null) {
                        delivery.setAssignedAt(OffsetDateTime.now());
                    }
                    break;
                case PICKED_UP:
                    delivery.setPickedUpAt(OffsetDateTime.now());
                    break;
                case IN_TRANSIT:
                    // No specific timestamp for IN_TRANSIT
                    break;
                case DELIVERED:
                    delivery.setDeliveredAt(OffsetDateTime.now());
                    break;
                case FAILED:
                    // Log failure reason if provided in instructions
                    break;
                default:
                    break;
            }
        }
        
        // Update instructions if provided
        if (requestDto.getDeliveryInstructions() != null) {
            delivery.setDeliveryInstructions(requestDto.getDeliveryInstructions());
        }
        
        Delivery updatedDelivery = deliveryRepository.save(delivery);
        logger.info("Updated delivery {} to status: {}", id, requestDto.getStatus());
        
        return convertToDto(updatedDelivery);
    }
    
    /**
     * Delete delivery
     * 
     * @param id Delivery ID
     * @throws RuntimeException if delivery not found or already in progress
     */
    public void deleteDelivery(Long id) {
        logger.info("Deleting delivery with ID: {}", id);
        
        Delivery delivery = deliveryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Delivery not found with ID: " + id));
        
        // Only allow deletion if not yet picked up
        if (delivery.getStatus() == Delivery.DeliveryStatus.PICKED_UP ||
            delivery.getStatus() == Delivery.DeliveryStatus.IN_TRANSIT ||
            delivery.getStatus() == Delivery.DeliveryStatus.DELIVERED) {
            throw new RuntimeException("Cannot delete delivery that is already in progress or completed");
        }
        
        deliveryRepository.deleteById(id);
        logger.info("Deleted delivery with ID: {}", id);
    }
    
    /**
     * Convert Delivery entity to DTO
     * 
     * @param delivery Delivery entity
     * @return Delivery DTO
     */
    private DeliveryDto convertToDto(Delivery delivery) {
        DeliveryDto dto = new DeliveryDto();
        dto.setId(delivery.getId());
        
        // Order info
        dto.setOrderId(delivery.getOrder().getId());
        dto.setOrderNumber(delivery.getOrder().getId().toString()); // Or implement order number generation
        dto.setOrderTotal(delivery.getOrder().getTotalAmount());
        
        // Address info
        dto.setAddressId(delivery.getDeliveryAddress().getId());
        String fullAddress = delivery.getDeliveryAddress().getAddressLine1();
        if (delivery.getDeliveryAddress().getAddressLine2() != null && !delivery.getDeliveryAddress().getAddressLine2().isEmpty()) {
            fullAddress += ", " + delivery.getDeliveryAddress().getAddressLine2();
        }
        fullAddress += ", " + delivery.getDeliveryAddress().getCity() + ", " + delivery.getDeliveryAddress().getState() + " " + delivery.getDeliveryAddress().getPostalCode();
        dto.setFullAddress(fullAddress);
        
        // Driver info
        if (delivery.getDriver() != null && delivery.getDriver().getUser() != null) {
            dto.setDriverId(delivery.getDriver().getId());
            User driverUser = delivery.getDriver().getUser();
            String driverName = (driverUser.getFirstName() != null ? driverUser.getFirstName() : "") + 
                               " " + 
                               (driverUser.getLastName() != null ? driverUser.getLastName() : "");
            dto.setDriverName(driverName.trim());
            dto.setDriverPhone(driverUser.getPhoneNumber());
        }
        
        // Delivery details
        dto.setDeliveryFee(delivery.getDeliveryFee());
        dto.setEstimatedDeliveryTimeMinutes(delivery.getEstimatedDeliveryTimeMinutes());
        dto.setStatus(delivery.getStatus());
        dto.setDeliveryInstructions(delivery.getDeliveryInstructions());
        
        // Timestamps
        dto.setAssignedAt(delivery.getAssignedAt());
        dto.setPickedUpAt(delivery.getPickedUpAt());
        dto.setDeliveredAt(delivery.getDeliveredAt());
        dto.setDeliveryPhotoUrl(delivery.getDeliveryPhotoUrl());
        
        return dto;
    }
}
