package com.lerestaurant.le_restaurant_backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "payment_refunds")
public class PaymentRefund {

    public enum RefundStatus { PENDING, COMPLETED, FAILED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refund_id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @Column(name = "refund_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal refundAmount;

    @Column(name = "refund_reason", columnDefinition = "TEXT")
    private String refundReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RefundStatus status = RefundStatus.PENDING;

    @Column(name = "refund_requested")
    private OffsetDateTime refundRequested;

    @Column(name = "refund_processed")
    private OffsetDateTime refundProcessed;

    @ManyToOne
    @JoinColumn(name = "processed_by_user_id")
    private User processedBy;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }
    public BigDecimal getRefundAmount() { return refundAmount; }
    public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }
    public String getRefundReason() { return refundReason; }
    public void setRefundReason(String refundReason) { this.refundReason = refundReason; }
    public RefundStatus getStatus() { return status; }
    public void setStatus(RefundStatus status) { this.status = status; }
    public OffsetDateTime getRefundRequested() { return refundRequested; }
    public void setRefundRequested(OffsetDateTime refundRequested) { this.refundRequested = refundRequested; }
    public OffsetDateTime getRefundProcessed() { return refundProcessed; }
    public void setRefundProcessed(OffsetDateTime refundProcessed) { this.refundProcessed = refundProcessed; }
    public User getProcessedBy() { return processedBy; }
    public void setProcessedBy(User processedBy) { this.processedBy = processedBy; }
}


