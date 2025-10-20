package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.entity.Order;
import com.lerestaurant.le_restaurant_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    //Place a new order
    public Order placeOrder(Order order) {
        order.setOrderTime(OffsetDateTime.now());
        order.setStatus(Order.OrderStatus.PENDING);
        return orderRepository.save(order);
    }

    //Get a specific order by ID
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    //Get all orders for a specific customer
    public List<Order> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }
}
