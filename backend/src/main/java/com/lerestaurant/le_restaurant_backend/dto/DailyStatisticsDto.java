package com.lerestaurant.le_restaurant_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DailyStatisticsDto - Daily order statistics (Phase 4.3)
 */
public class DailyStatisticsDto {
    private LocalDate date;
    private Long orderCount;
    private BigDecimal totalRevenue;
    private BigDecimal averageOrderValue;

    public DailyStatisticsDto() {
    }

    public DailyStatisticsDto(LocalDate date, Long orderCount, BigDecimal totalRevenue) {
        this.date = date;
        this.orderCount = orderCount;
        this.totalRevenue = totalRevenue;
        this.averageOrderValue = orderCount > 0
                ? totalRevenue.divide(BigDecimal.valueOf(orderCount), 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
    }

    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Long orderCount) {
        this.orderCount = orderCount;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getAverageOrderValue() {
        return averageOrderValue;
    }

    public void setAverageOrderValue(BigDecimal averageOrderValue) {
        this.averageOrderValue = averageOrderValue;
    }
}
