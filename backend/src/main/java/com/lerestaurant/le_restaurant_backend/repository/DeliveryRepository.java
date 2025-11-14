package com.lerestaurant.le_restaurant_backend.repository;

import com.lerestaurant.le_restaurant_backend.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByStatus(Delivery.DeliveryStatus status);
    
    List<Delivery> findByDriverId(Long driverId);
    
    List<Delivery> findByOrderId(Long orderId);
    
    List<Delivery> findByStatusAndDriverId(Delivery.DeliveryStatus status, Long driverId);
}


