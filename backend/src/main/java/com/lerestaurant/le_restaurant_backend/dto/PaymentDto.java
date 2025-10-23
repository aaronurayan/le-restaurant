package com.lerestaurant.le_restaurant_backend.dto;

import com.lerestaurant.le_restaurant_backend.entity.Payment;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class PaymentDto {
    private Long id;
    private Long orderId;
    private BigDecimal amount;
    private Payment.PaymentMethod paymentMethod;
    private String transactionId;
    private Payment.PaymentStatus status;
    private String paymentDetails;
    private OffsetDateTime paymentTime;
    private OffsetDateTime processedAt;
    private String gatewayResponse;
    
    // Customer information (F106 Enhancement)
    private Long customerId;
    private String customerName;
    private String customerEmail;

    // Constructors
    public PaymentDto() {}

    public PaymentDto(Long id, Long orderId, BigDecimal amount, Payment.PaymentMethod paymentMethod,
                     String transactionId, Payment.PaymentStatus status, String paymentDetails,
                     OffsetDateTime paymentTime, OffsetDateTime processedAt, String gatewayResponse,
                     Long customerId, String customerName, String customerEmail) {
        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.status = status;
        this.paymentDetails = paymentDetails;
        this.paymentTime = paymentTime;
        this.processedAt = processedAt;
        this.gatewayResponse = gatewayResponse;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Payment.PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(Payment.PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public Payment.PaymentStatus getStatus() { return status; }
    public void setStatus(Payment.PaymentStatus status) { this.status = status; }

    public String getPaymentDetails() { return paymentDetails; }
    public void setPaymentDetails(String paymentDetails) { this.paymentDetails = paymentDetails; }

    public OffsetDateTime getPaymentTime() { return paymentTime; }
    public void setPaymentTime(OffsetDateTime paymentTime) { this.paymentTime = paymentTime; }

    public OffsetDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(OffsetDateTime processedAt) { this.processedAt = processedAt; }

    public String getGatewayResponse() { return gatewayResponse; }
    public void setGatewayResponse(String gatewayResponse) { this.gatewayResponse = gatewayResponse; }
    
    // Customer information getters and setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
}
