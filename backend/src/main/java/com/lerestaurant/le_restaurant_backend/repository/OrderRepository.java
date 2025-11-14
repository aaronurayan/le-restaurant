package com.lerestaurant.le_restaurant_backend.repository;

import com.lerestaurant.le_restaurant_backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByCustomerId(Long customerId);
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    List<Order> findByOrderType(Order.OrderType orderType);
    
    List<Order> findByCustomerIdAndStatus(Long customerId, Order.OrderStatus status);
    
    List<Order> findByOrderTimeBetween(OffsetDateTime start, OffsetDateTime end);
}
