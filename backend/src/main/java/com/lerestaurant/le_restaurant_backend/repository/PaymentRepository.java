package com.lerestaurant.le_restaurant_backend.repository;

import com.lerestaurant.le_restaurant_backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByOrderId(Long orderId);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    List<Payment> findByOrderIdAndStatus(Long orderId, Payment.PaymentStatus status);
    
    Optional<Payment> findByTransactionId(String transactionId);
}


