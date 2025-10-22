package com.lerestaurant.le_restaurant_backend.testdata;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import com.lerestaurant.le_restaurant_backend.dto.MenuItemDto;

public class TestMenuItems {
    public static final MenuItemDto PIZZA_MARGHERITA = new MenuItemDto(
        1L,
        "Pizza Margherita",
        "Classic Neapolitan pizza with tomato sauce, mozzarella, and basil",
        new BigDecimal("12.99"),
        "PIZZA",
        true
    );

    public static final MenuItemDto CHICKEN_ALFREDO = new MenuItemDto(
        2L,
        "Chicken Alfredo",
        "Fettuccine pasta with creamy alfredo sauce and grilled chicken",
        new BigDecimal("15.99"),
        "PASTA",
        true
    );

    public static final MenuItemDto CAESAR_SALAD = new MenuItemDto(
        3L,
        "Caesar Salad",
        "Fresh romaine lettuce with caesar dressing, croutons, and parmesan",
        new BigDecimal("8.99"),
        "SALAD",
        true
    );

    public static final MenuItemDto COCA_COLA = new MenuItemDto(
        4L,
        "Coca Cola",
        "330ml soft drink",
        new BigDecimal("2.99"),
        "BEVERAGES",
        true
    );

    public static final List<MenuItemDto> ALL_ITEMS = Arrays.asList(
        PIZZA_MARGHERITA,
        CHICKEN_ALFREDO,
        CAESAR_SALAD,
        COCA_COLA
    );
}