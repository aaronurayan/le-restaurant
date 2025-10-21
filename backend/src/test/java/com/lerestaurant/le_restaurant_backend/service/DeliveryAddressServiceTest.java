package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.DeliveryAddressCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.DeliveryAddressDto;
import com.lerestaurant.le_restaurant_backend.entity.DeliveryAddress;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.DeliveryAddressRepository;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit Tests for DeliveryAddressService (F107 - Delivery Management)
 * 
 * This test suite validates the business logic for delivery address management operations
 * including address creation, retrieval, updates, and deletion.
 * 
 * @author Le Restaurant Development Team
 * @module F107-DeliveryManagement
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("DeliveryAddressService Tests (F107)")
class DeliveryAddressServiceTest {

    @Mock
    private DeliveryAddressRepository deliveryAddressRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DeliveryAddressService deliveryAddressService;

    private User testUser;
    private DeliveryAddress testAddress;
    private DeliveryAddressCreateRequestDto testAddressCreateRequest;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("customer@example.com");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setPhoneNumber("0412345678");

        // Setup test delivery address
        testAddress = new DeliveryAddress();
        testAddress.setId(1L);
        testAddress.setUser(testUser);
        testAddress.setAddressLine1("123 Main St");
        testAddress.setAddressLine2("Apt 4B");
        testAddress.setCity("Sydney");
        testAddress.setState("NSW");
        testAddress.setPostalCode("2000");
        testAddress.setCountry("Australia");
        testAddress.setIsDefault(true);

        // Setup request DTO
        testAddressCreateRequest = new DeliveryAddressCreateRequestDto();
        testAddressCreateRequest.setUserId(1L);
        testAddressCreateRequest.setAddressLine1("123 Main St");
        testAddressCreateRequest.setAddressLine2("Apt 4B");
        testAddressCreateRequest.setCity("Sydney");
        testAddressCreateRequest.setState("NSW");
        testAddressCreateRequest.setPostalCode("2000");
        testAddressCreateRequest.setCountry("Australia");
        testAddressCreateRequest.setIsDefault(true);
    }

    // =================================================================
    // Create Address Tests
    // =================================================================
    @Nested
    @DisplayName("Create Address Tests")
    class CreateAddressTests {

        @Test
        @DisplayName("Should create address successfully with valid data")
        void shouldCreateAddressSuccessfully() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(deliveryAddressRepository.findByUserId(1L)).thenReturn(Arrays.asList());
            when(deliveryAddressRepository.save(any(DeliveryAddress.class))).thenReturn(testAddress);

            // When
            DeliveryAddressDto createdAddress = deliveryAddressService.createAddress(testAddressCreateRequest);

            // Then
            assertThat(createdAddress).isNotNull();
            assertThat(createdAddress.getId()).isEqualTo(1L);
            assertThat(createdAddress.getAddressLine1()).isEqualTo("123 Main St");
            assertThat(createdAddress.getCity()).isEqualTo("Sydney");
            verify(deliveryAddressRepository, times(1)).save(any(DeliveryAddress.class));
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> deliveryAddressService.createAddress(testAddressCreateRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("User not found");

            verify(deliveryAddressRepository, never()).save(any(DeliveryAddress.class));
        }

        @Test
        @DisplayName("Should unset other default addresses when creating new default address")
        void shouldUnsetOtherDefaultAddresses() {
            // Given
            DeliveryAddress existingDefaultAddress = new DeliveryAddress();
            existingDefaultAddress.setId(2L);
            existingDefaultAddress.setUser(testUser);
            existingDefaultAddress.setIsDefault(true);

            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(deliveryAddressRepository.findByUserId(1L)).thenReturn(Arrays.asList(existingDefaultAddress));
            when(deliveryAddressRepository.save(any(DeliveryAddress.class))).thenReturn(testAddress);

            // When
            deliveryAddressService.createAddress(testAddressCreateRequest);

            // Then
            verify(deliveryAddressRepository, times(2)).save(any(DeliveryAddress.class)); // Once for unset, once for new
            assertThat(existingDefaultAddress.getIsDefault()).isFalse();
        }

        @Test
        @DisplayName("Should create non-default address when isDefault is false")
        void shouldCreateNonDefaultAddress() {
            // Given
            testAddressCreateRequest.setIsDefault(false);
            testAddress.setIsDefault(false);
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(deliveryAddressRepository.findByUserId(1L)).thenReturn(Arrays.asList());
            when(deliveryAddressRepository.save(any(DeliveryAddress.class))).thenReturn(testAddress);

            // When
            DeliveryAddressDto createdAddress = deliveryAddressService.createAddress(testAddressCreateRequest);

            // Then
            assertThat(createdAddress).isNotNull();
            assertThat(createdAddress.getIsDefault()).isNotNull();
            assertThat(createdAddress.getIsDefault()).isFalse();
            verify(deliveryAddressRepository, times(1)).save(any(DeliveryAddress.class));
        }
    }

    // =================================================================
    // Get Address Tests
    // =================================================================
    @Nested
    @DisplayName("Get Address Tests")
    class GetAddressTests {

        @Test
        @DisplayName("Should return address by ID")
        void shouldReturnAddressById() {
            // Given
            when(deliveryAddressRepository.findById(1L)).thenReturn(Optional.of(testAddress));

            // When
            DeliveryAddressDto foundAddress = deliveryAddressService.getAddressById(1L);

            // Then
            assertThat(foundAddress).isNotNull();
            assertThat(foundAddress.getId()).isEqualTo(1L);
            assertThat(foundAddress.getUserId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("Should throw exception when address not found")
        void shouldThrowExceptionWhenAddressNotFound() {
            // Given
            when(deliveryAddressRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> deliveryAddressService.getAddressById(99L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Delivery address not found");
        }

        @Test
        @DisplayName("Should return all addresses for user")
        void shouldReturnAddressesByUserId() {
            // Given
            List<DeliveryAddress> userAddresses = Arrays.asList(testAddress);
            when(deliveryAddressRepository.findByUserId(1L)).thenReturn(userAddresses);

            // When
            List<DeliveryAddressDto> addresses = deliveryAddressService.getAddressesByUserId(1L);

            // Then
            assertThat(addresses).isNotNull();
            assertThat(addresses).hasSize(1);
            assertThat(addresses.get(0).getUserId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("Should return empty list when user has no addresses")
        void shouldReturnEmptyListWhenNoAddresses() {
            // Given
            when(deliveryAddressRepository.findByUserId(99L)).thenReturn(Arrays.asList());

            // When
            List<DeliveryAddressDto> addresses = deliveryAddressService.getAddressesByUserId(99L);

            // Then
            assertThat(addresses).isNotNull();
            assertThat(addresses).isEmpty();
        }
    }

    // =================================================================
    // Update Address Tests
    // =================================================================
    @Nested
    @DisplayName("Update Address Tests")
    class UpdateAddressTests {

        @Test
        @DisplayName("Should update address successfully")
        void shouldUpdateAddressSuccessfully() {
            // Given
            DeliveryAddressCreateRequestDto updateRequest = new DeliveryAddressCreateRequestDto();
            updateRequest.setAddressLine1("456 New St");
            updateRequest.setCity("Melbourne");
            updateRequest.setState("VIC");
            updateRequest.setPostalCode("3000");
            updateRequest.setCountry("Australia");
            updateRequest.setIsDefault(false);

            testAddress.setAddressLine1("456 New St");
            testAddress.setCity("Melbourne");

            when(deliveryAddressRepository.findById(1L)).thenReturn(Optional.of(testAddress));
            when(deliveryAddressRepository.save(any(DeliveryAddress.class))).thenReturn(testAddress);

            // When
            DeliveryAddressDto updatedAddress = deliveryAddressService.updateAddress(1L, updateRequest);

            // Then
            assertThat(updatedAddress).isNotNull();
            assertThat(updatedAddress.getAddressLine1()).isEqualTo("456 New St");
            assertThat(updatedAddress.getCity()).isEqualTo("Melbourne");
            verify(deliveryAddressRepository, times(1)).save(any(DeliveryAddress.class));
        }

        @Test
        @DisplayName("Should throw exception when updating non-existent address")
        void shouldThrowExceptionWhenUpdatingNonExistentAddress() {
            // Given
            DeliveryAddressCreateRequestDto updateRequest = new DeliveryAddressCreateRequestDto();
            when(deliveryAddressRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> deliveryAddressService.updateAddress(99L, updateRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Delivery address not found");

            verify(deliveryAddressRepository, never()).save(any(DeliveryAddress.class));
        }
    }

    // =================================================================
    // Delete Address Tests
    // =================================================================
    @Nested
    @DisplayName("Delete Address Tests")
    class DeleteAddressTests {

        @Test
        @DisplayName("Should delete address successfully")
        void shouldDeleteAddressSuccessfully() {
            // Given
            when(deliveryAddressRepository.existsById(1L)).thenReturn(true);

            // When
            deliveryAddressService.deleteAddress(1L);

            // Then
            verify(deliveryAddressRepository, times(1)).deleteById(1L);
        }

        @Test
        @DisplayName("Should throw exception when deleting non-existent address")
        void shouldThrowExceptionWhenDeletingNonExistentAddress() {
            // Given
            when(deliveryAddressRepository.existsById(99L)).thenReturn(false);

            // When & Then
            assertThatThrownBy(() -> deliveryAddressService.deleteAddress(99L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Delivery address not found");

            verify(deliveryAddressRepository, never()).deleteById(anyLong());
        }
    }
}
