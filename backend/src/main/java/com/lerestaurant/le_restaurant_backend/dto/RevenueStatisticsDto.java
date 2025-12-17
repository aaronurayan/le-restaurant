package com.lerestaurant.le_restaurant_backend.dto;

import java.math.BigDecimal;

/**
 * RevenueStatisticsDto - Revenue overview statistics (Phase 4.3)
 */
public class RevenueStatisticsDto {
    private BigDecimal todayRevenue;
    private BigDecimal weekRevenue;
    private BigDecimal monthRevenue;
    private BigDecimal totalRevenue;
    private Long todayOrderCount;
    private Long weekOrderCount;
    private Long monthOrderCount;
    private Long totalOrderCount;
    private BigDecimal averageOrderValue;

    public RevenueStatisticsDto() {
    }

    // Getters and Setters
    public BigDecimal getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(BigDecimal todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public BigDecimal getWeekRevenue() {
        return weekRevenue;
    }

    public void setWeekRevenue(BigDecimal weekRevenue) {
        this.weekRevenue = weekRevenue;
    }

    public BigDecimal getMonthRevenue() {
        return monthRevenue;
    }

    public void setMonthRevenue(BigDecimal monthRevenue) {
        this.monthRevenue = monthRevenue;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Long getTodayOrderCount() {
        return todayOrderCount;
    }

    public void setTodayOrderCount(Long todayOrderCount) {
        this.todayOrderCount = todayOrderCount;
    }

    public Long getWeekOrderCount() {
        return weekOrderCount;
    }

    public void setWeekOrderCount(Long weekOrderCount) {
        this.weekOrderCount = weekOrderCount;
    }

    public Long getMonthOrderCount() {
        return monthOrderCount;
    }

    public void setMonthOrderCount(Long monthOrderCount) {
        this.monthOrderCount = monthOrderCount;
    }

    public Long getTotalOrderCount() {
        return totalOrderCount;
    }

    public void setTotalOrderCount(Long totalOrderCount) {
        this.totalOrderCount = totalOrderCount;
    }

    public BigDecimal getAverageOrderValue() {
        return averageOrderValue;
    }

    public void setAverageOrderValue(BigDecimal averageOrderValue) {
        this.averageOrderValue = averageOrderValue;
    }
}
