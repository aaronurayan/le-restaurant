package com.lerestaurant.le_restaurant_backend.dto;

import java.time.OffsetDateTime;

public class LoginHistoryDto {
    private Long id;
    private OffsetDateTime timestamp;
    private String ipAddress;
    private String status;

    public LoginHistoryDto(Long id, OffsetDateTime timestamp, String ipAddress, String status) {
        this.id = id;
        this.timestamp = timestamp;
        this.ipAddress = ipAddress;
        this.status = status;
    }

    public Long getId() { return id; }
    public OffsetDateTime getTimestamp() { return timestamp; }
    public String getIpAddress() { return ipAddress; }
    public String getStatus() { return status; }
}
