package com.lerestaurant.le_restaurant_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Data
public class Delivery {
    public enum DeliveryStatus {
        ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delivery_id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(optional = false)
    @JoinColumn(name = "delivery_address_id")
    private DeliveryAddress deliveryAddress;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private DeliveryDriver driver;

    @Column(name = "delivery_fee", precision = 10, scale = 2)
    private BigDecimal deliveryFee = BigDecimal.ZERO;

    @Column(name = "estimated_delivery_time_minutes")
    private Integer estimatedDeliveryTimeMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus status = DeliveryStatus.ASSIGNED;

    @Column(name = "delivery_instructions", columnDefinition = "TEXT")
    private String deliveryInstructions;

    @Column(name = "assigned_at")
    private OffsetDateTime assignedAt;

    @Column(name = "picked_up_at")
    private OffsetDateTime pickedUpAt;

    @Column(name = "delivered_at")
    private OffsetDateTime deliveredAt;

    @Column(name = "delivery_photo_url")
    private String deliveryPhotoUrl;

    // Note: customerName, phoneNumber, address are redundant as they can be accessed via:
    // - order.customer (for customer info)
    // - deliveryAddress (for address info)
    // Keeping these fields for backward compatibility and performance (denormalization)
    // Consider removing if not actively used
    @Transient
    private String customerName;
    
    @Transient
    private String phoneNumber;
    
    @Transient
    private String address;

    @ElementCollection
    private List<String> orderedItems;
}
