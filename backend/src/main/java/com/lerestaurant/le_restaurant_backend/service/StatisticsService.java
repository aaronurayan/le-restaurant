package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.DailyStatisticsDto;
import com.lerestaurant.le_restaurant_backend.dto.PopularItemDto;
import com.lerestaurant.le_restaurant_backend.dto.RevenueStatisticsDto;
import com.lerestaurant.le_restaurant_backend.entity.Order;
import com.lerestaurant.le_restaurant_backend.entity.OrderItem;
import com.lerestaurant.le_restaurant_backend.repository.OrderRepository;
import com.lerestaurant.le_restaurant_backend.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Statistics Service (Phase 4.3)
 * 
 * Provides business analytics and dashboard statistics for managers.
 */
@Service
@Transactional(readOnly = true)
public class StatisticsService {

    private static final Logger logger = LoggerFactory.getLogger(StatisticsService.class);

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Autowired
    public StatisticsService(OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    /**
     * Get daily order statistics for a date range
     */
    public List<DailyStatisticsDto> getDailyStatistics(LocalDate startDate, LocalDate endDate) {
        logger.info("Fetching daily statistics from {} to {}", startDate, endDate);

        List<Order> orders = getCompletedOrdersBetween(startDate, endDate);

        Map<LocalDate, List<Order>> ordersByDate = orders.stream()
                .collect(Collectors.groupingBy(o -> o.getOrderTime().toLocalDate()));

        List<DailyStatisticsDto> statistics = new ArrayList<>();
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            List<Order> dayOrders = ordersByDate.getOrDefault(current, Collections.emptyList());
            long count = dayOrders.size();
            BigDecimal revenue = dayOrders.stream()
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            statistics.add(new DailyStatisticsDto(current, count, revenue));
            current = current.plusDays(1);
        }

        return statistics;
    }

    /**
     * Get monthly order statistics
     */
    public List<DailyStatisticsDto> getMonthlyStatistics(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        return getDailyStatistics(startDate, endDate);
    }

    /**
     * Get revenue overview statistics
     */
    public RevenueStatisticsDto getRevenueStatistics() {
        logger.info("Fetching revenue statistics");

        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(7);
        LocalDate monthStart = today.withDayOfMonth(1);

        RevenueStatisticsDto stats = new RevenueStatisticsDto();

        // Today's stats
        List<Order> todayOrders = getCompletedOrdersBetween(today, today);
        stats.setTodayOrderCount((long) todayOrders.size());
        stats.setTodayRevenue(calculateRevenue(todayOrders));

        // Week's stats
        List<Order> weekOrders = getCompletedOrdersBetween(weekStart, today);
        stats.setWeekOrderCount((long) weekOrders.size());
        stats.setWeekRevenue(calculateRevenue(weekOrders));

        // Month's stats
        List<Order> monthOrders = getCompletedOrdersBetween(monthStart, today);
        stats.setMonthOrderCount((long) monthOrders.size());
        stats.setMonthRevenue(calculateRevenue(monthOrders));

        // Total stats (all completed orders)
        List<Order> allOrders = orderRepository.findByStatus(Order.OrderStatus.COMPLETED);
        stats.setTotalOrderCount((long) allOrders.size());
        stats.setTotalRevenue(calculateRevenue(allOrders));

        // Average order value
        if (allOrders.size() > 0) {
            stats.setAverageOrderValue(stats.getTotalRevenue()
                    .divide(BigDecimal.valueOf(allOrders.size()), 2, RoundingMode.HALF_UP));
        } else {
            stats.setAverageOrderValue(BigDecimal.ZERO);
        }

        return stats;
    }

    /**
     * Get top 10 popular menu items
     */
    public List<PopularItemDto> getPopularItems(int limit) {
        logger.info("Fetching top {} popular items", limit);

        List<OrderItem> allItems = orderItemRepository.findAll();

        Map<Long, PopularItemDto> itemStats = new HashMap<>();

        for (OrderItem item : allItems) {
            // Only count items from completed orders
            if (item.getOrder().getStatus() != Order.OrderStatus.COMPLETED) {
                continue;
            }

            Long menuItemId = item.getMenuItem().getId();
            PopularItemDto stats = itemStats.getOrDefault(menuItemId,
                    new PopularItemDto(
                            menuItemId,
                            item.getMenuItem().getName(),
                            item.getMenuItem().getCategory(),
                            0L,
                            BigDecimal.ZERO));

            stats.setOrderCount(stats.getOrderCount() + item.getQuantity());
            stats.setTotalRevenue(stats.getTotalRevenue().add(item.getSubtotal()));
            itemStats.put(menuItemId, stats);
        }

        return itemStats.values().stream()
                .sorted((a, b) -> Long.compare(b.getOrderCount(), a.getOrderCount()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    // Helper methods
    private List<Order> getCompletedOrdersBetween(LocalDate startDate, LocalDate endDate) {
        OffsetDateTime start = startDate.atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime end = endDate.plusDays(1).atStartOfDay().atOffset(ZoneOffset.UTC);

        return orderRepository.findAll().stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.COMPLETED)
                .filter(o -> !o.getOrderTime().isBefore(start) && o.getOrderTime().isBefore(end))
                .collect(Collectors.toList());
    }

    private BigDecimal calculateRevenue(List<Order> orders) {
        return orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
