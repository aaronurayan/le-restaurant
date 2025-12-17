package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.DailyStatisticsDto;
import com.lerestaurant.le_restaurant_backend.dto.PopularItemDto;
import com.lerestaurant.le_restaurant_backend.dto.RevenueStatisticsDto;
import com.lerestaurant.le_restaurant_backend.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Statistics Controller (Phase 4.3)
 * 
 * REST API endpoints for business analytics and dashboard statistics.
 * Base URL: /api/statistics
 */
@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @Autowired
    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    /**
     * Get daily order statistics
     * GET /api/statistics/orders/daily?startDate=2024-01-01&endDate=2024-01-31
     */
    @GetMapping("/orders/daily")
    public ResponseEntity<List<DailyStatisticsDto>> getDailyStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<DailyStatisticsDto> statistics = statisticsService.getDailyStatistics(startDate, endDate);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get monthly order statistics
     * GET /api/statistics/orders/monthly?year=2024&month=1
     */
    @GetMapping("/orders/monthly")
    public ResponseEntity<List<DailyStatisticsDto>> getMonthlyStatistics(
            @RequestParam int year,
            @RequestParam int month) {
        List<DailyStatisticsDto> statistics = statisticsService.getMonthlyStatistics(year, month);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get revenue overview statistics
     * GET /api/statistics/revenue
     */
    @GetMapping("/revenue")
    public ResponseEntity<RevenueStatisticsDto> getRevenueStatistics() {
        RevenueStatisticsDto statistics = statisticsService.getRevenueStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get top 10 popular menu items
     * GET /api/statistics/popular-items?limit=10
     */
    @GetMapping("/popular-items")
    public ResponseEntity<List<PopularItemDto>> getPopularItems(
            @RequestParam(defaultValue = "10") int limit) {
        List<PopularItemDto> items = statisticsService.getPopularItems(limit);
        return ResponseEntity.ok(items);
    }
}
