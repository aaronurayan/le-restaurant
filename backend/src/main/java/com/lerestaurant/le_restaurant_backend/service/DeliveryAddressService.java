package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.DeliveryAddressCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.DeliveryAddressDto;
import com.lerestaurant.le_restaurant_backend.entity.DeliveryAddress;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.DeliveryAddressRepository;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Delivery Address Service (F107)
 * 
 * This service handles business logic for delivery address management.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F107-DeliveryManagement
 */
@Service
@Transactional
public class DeliveryAddressService {
    
    private static final Logger logger = LoggerFactory.getLogger(DeliveryAddressService.class);
    
    private final DeliveryAddressRepository deliveryAddressRepository;
    private final UserRepository userRepository;
    
    @Autowired
    public DeliveryAddressService(DeliveryAddressRepository deliveryAddressRepository,
                                 UserRepository userRepository) {
        this.deliveryAddressRepository = deliveryAddressRepository;
        this.userRepository = userRepository;
    }
    
    /**
     * Create new delivery address
     * 
     * @param requestDto Address creation request
     * @return Created address as DTO
     * @throws RuntimeException if user not found
     */
    public DeliveryAddressDto createAddress(DeliveryAddressCreateRequestDto requestDto) {
        logger.info("Creating new delivery address for user ID: {}", requestDto.getUserId());
        
        // Validate user exists
        User user = userRepository.findById(requestDto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + requestDto.getUserId()));
        
        // If this is set as default, unset other defaults for this user
        if (Boolean.TRUE.equals(requestDto.getIsDefault())) {
            deliveryAddressRepository.findByUserId(requestDto.getUserId())
                .forEach(address -> {
                    address.setIsDefault(false);
                    deliveryAddressRepository.save(address);
                });
        }
        
        // Create new address
        DeliveryAddress address = new DeliveryAddress();
        address.setUser(user);
        address.setAddressLine1(requestDto.getAddressLine1());
        address.setAddressLine2(requestDto.getAddressLine2());
        address.setCity(requestDto.getCity());
        address.setState(requestDto.getState());
        address.setPostalCode(requestDto.getPostalCode());
        address.setCountry(requestDto.getCountry());
        address.setIsDefault(requestDto.getIsDefault() != null ? requestDto.getIsDefault() : false);
        
        DeliveryAddress savedAddress = deliveryAddressRepository.save(address);
        logger.info("Created delivery address with ID: {}", savedAddress.getId());
        
        return convertToDto(savedAddress);
    }
    
    /**
     * Get address by ID
     * 
     * @param id Address ID
     * @return Address as DTO
     * @throws RuntimeException if address not found
     */
    public DeliveryAddressDto getAddressById(Long id) {
        logger.info("Fetching delivery address with ID: {}", id);
        
        DeliveryAddress address = deliveryAddressRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Delivery address not found with ID: " + id));
        
        return convertToDto(address);
    }
    
    /**
     * Get all addresses for a user
     * 
     * @param userId User ID
     * @return List of addresses as DTOs
     */
    public List<DeliveryAddressDto> getAddressesByUserId(Long userId) {
        logger.info("Fetching all delivery addresses for user ID: {}", userId);
        
        List<DeliveryAddress> addresses = deliveryAddressRepository.findByUserId(userId);
        return addresses.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Get default address for a user
     * 
     * @param userId User ID
     * @return Default address as DTO, or null if none set
     */
    public DeliveryAddressDto getDefaultAddress(Long userId) {
        logger.info("Fetching default delivery address for user ID: {}", userId);
        
        return deliveryAddressRepository.findByUserIdAndIsDefaultTrue(userId)
            .map(this::convertToDto)
            .orElse(null);
    }
    
    /**
     * Update existing address
     * 
     * @param id Address ID
     * @param requestDto Update request
     * @return Updated address as DTO
     * @throws RuntimeException if address not found
     */
    public DeliveryAddressDto updateAddress(Long id, DeliveryAddressCreateRequestDto requestDto) {
        logger.info("Updating delivery address with ID: {}", id);
        
        DeliveryAddress address = deliveryAddressRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Delivery address not found with ID: " + id));
        
        // If setting as default, unset other defaults for this user
        if (Boolean.TRUE.equals(requestDto.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            deliveryAddressRepository.findByUserId(address.getUser().getId())
                .forEach(addr -> {
                    addr.setIsDefault(false);
                    deliveryAddressRepository.save(addr);
                });
        }
        
        // Update fields
        address.setAddressLine1(requestDto.getAddressLine1());
        address.setAddressLine2(requestDto.getAddressLine2());
        address.setCity(requestDto.getCity());
        address.setState(requestDto.getState());
        address.setPostalCode(requestDto.getPostalCode());
        address.setCountry(requestDto.getCountry());
        if (requestDto.getIsDefault() != null) {
            address.setIsDefault(requestDto.getIsDefault());
        }
        
        DeliveryAddress updatedAddress = deliveryAddressRepository.save(address);
        logger.info("Updated delivery address with ID: {}", id);
        
        return convertToDto(updatedAddress);
    }
    
    /**
     * Set address as default for user
     * 
     * @param id Address ID
     * @return Updated address as DTO
     * @throws RuntimeException if address not found
     */
    public DeliveryAddressDto setAsDefault(Long id) {
        logger.info("Setting delivery address {} as default", id);
        
        DeliveryAddress address = deliveryAddressRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Delivery address not found with ID: " + id));
        
        // Unset all other defaults for this user
        deliveryAddressRepository.findByUserId(address.getUser().getId())
            .forEach(addr -> {
                addr.setIsDefault(false);
                deliveryAddressRepository.save(addr);
            });
        
        // Set this one as default
        address.setIsDefault(true);
        DeliveryAddress updatedAddress = deliveryAddressRepository.save(address);
        
        logger.info("Set address {} as default for user {}", id, address.getUser().getId());
        
        return convertToDto(updatedAddress);
    }
    
    /**
     * Delete address
     * 
     * @param id Address ID
     * @throws RuntimeException if address not found
     */
    public void deleteAddress(Long id) {
        logger.info("Deleting delivery address with ID: {}", id);
        
        if (!deliveryAddressRepository.existsById(id)) {
            throw new RuntimeException("Delivery address not found with ID: " + id);
        }
        
        deliveryAddressRepository.deleteById(id);
        logger.info("Deleted delivery address with ID: {}", id);
    }
    
    /**
     * Convert DeliveryAddress entity to DTO
     * 
     * @param address Address entity
     * @return Address DTO
     */
    private DeliveryAddressDto convertToDto(DeliveryAddress address) {
        DeliveryAddressDto dto = new DeliveryAddressDto();
        dto.setId(address.getId());
        dto.setUserId(address.getUser().getId());
        // Combine first name and last name for full name
        String userName = (address.getUser().getFirstName() != null ? address.getUser().getFirstName() : "") + 
                         " " + 
                         (address.getUser().getLastName() != null ? address.getUser().getLastName() : "");
        dto.setUserName(userName.trim());
        dto.setAddressLine1(address.getAddressLine1());
        dto.setAddressLine2(address.getAddressLine2());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setPostalCode(address.getPostalCode());
        dto.setCountry(address.getCountry());
        dto.setIsDefault(address.getIsDefault());
        dto.setCreatedAt(address.getCreatedAt());
        dto.setUpdatedAt(address.getUpdatedAt());
        return dto;
    }
}
