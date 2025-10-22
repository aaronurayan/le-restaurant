package com.lerestaurant.le_restaurant_backend.dto;

import java.util.List;

/**
 * Table DTO for availability responses (F108)
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-22
 * @module F108-TableReservation
 */
public class TableDto {

    private String id;
    private String number;
    private Integer capacity;
    private String location;
    private Boolean isAvailable;
    private List<String> features;

    public TableDto() {
    }

    public TableDto(String id, String number, Integer capacity, String location, Boolean isAvailable,
            List<String> features) {
        this.id = id;
        this.number = number;
        this.capacity = capacity;
        this.location = location;
        this.isAvailable = isAvailable;
        this.features = features;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }
}
