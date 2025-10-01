package com.lerestaurant.le_restaurant_backend.dto;

import com.lerestaurant.le_restaurant_backend.entity.Payment;
import java.math.BigDecimal;

public class PaymentRequestDto {
    private Long orderId;
    private BigDecimal amount;
    private Payment.PaymentMethod paymentMethod;
    private String paymentDetails;

    // Constructors
    public PaymentRequestDto() {}

    public PaymentRequestDto(Long orderId, BigDecimal amount, Payment.PaymentMethod paymentMethod, String paymentDetails) {
        this.orderId = orderId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentDetails = paymentDetails;
    }

    // Getters and Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Payment.PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(Payment.PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentDetails() { return paymentDetails; }
    public void setPaymentDetails(String paymentDetails) { this.paymentDetails = paymentDetails; }
}
