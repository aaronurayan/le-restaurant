package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.entity.Delivery;
import com.lerestaurant.le_restaurant_backend.repository.DeliveryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DeliveryServiceTest {

    @Mock
    private DeliveryRepository deliveryRepository;

    @InjectMocks
    private DeliveryService deliveryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUpdateDeliveryStatus_Success() {
        // Arrange
        Long deliveryId = 1L;
        String newStatus = "DELIVERED";
        Delivery delivery = new Delivery();
        delivery.setId(deliveryId);
        delivery.setStatus(Delivery.DeliveryStatus.PENDING);

        when(deliveryRepository.findById(deliveryId)).thenReturn(Optional.of(delivery));
        when(deliveryRepository.save(any(Delivery.class))).thenReturn(delivery);

        // Act
        Delivery updatedDelivery = deliveryService.updateDeliveryStatus(deliveryId, newStatus);

        // Assert
        assertNotNull(updatedDelivery);
        assertEquals(Delivery.DeliveryStatus.DELIVERED, updatedDelivery.getStatus());
        verify(deliveryRepository, times(1)).findById(deliveryId);
        verify(deliveryRepository, times(1)).save(delivery);
    }

    @Test
    void testUpdateDeliveryStatus_DeliveryNotFound() {
        // Arrange
        Long deliveryId = 1L;
        String newStatus = "DELIVERED";

        when(deliveryRepository.findById(deliveryId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            deliveryService.updateDeliveryStatus(deliveryId, newStatus);
        });
        assertEquals("Delivery not found", exception.getMessage());
        verify(deliveryRepository, times(1)).findById(deliveryId);
        verify(deliveryRepository, never()).save(any(Delivery.class));
    }
}