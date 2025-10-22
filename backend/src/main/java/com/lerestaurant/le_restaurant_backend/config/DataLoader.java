package com.lerestaurant.le_restaurant_backend.config;

import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import com.lerestaurant.le_restaurant_backend.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;

import java.math.BigDecimal;
import java.util.Arrays;

// @Component  // Mock data loading disabled
public class DataLoader implements CommandLineRunner {

    private final MenuItemRepository menuItemRepository;

    @Autowired
    public DataLoader(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // if there is no data, load sample data
        if (menuItemRepository.count() == 0) {
            loadSampleData();
        }
    }

    private void loadSampleData() {
        MenuItem[] menuItems = {
                new MenuItem("Margherita Pizza", "Classic tomato sauce with mozzarella cheese",
                        new BigDecimal("18.99"), "Pizza"),
                new MenuItem("Pepperoni Pizza", "Spicy pepperoni with melted cheese",
                        new BigDecimal("20.99"), "Pizza"),
                new MenuItem("Caesar Salad", "Fresh romaine lettuce with Caesar dressing",
                        new BigDecimal("12.99"), "Salad"),
                new MenuItem("Greek Salad", "Mixed greens with feta cheese and olives",
                        new BigDecimal("13.99"), "Salad"),
                new MenuItem("Spaghetti Carbonara", "Pasta with eggs, cheese, and pancetta",
                        new BigDecimal("16.99"), "Pasta"),
                new MenuItem("Fettuccine Alfredo", "Creamy Alfredo sauce with parmesan",
                        new BigDecimal("17.99"), "Pasta"),
                new MenuItem("Chicken Wings", "Crispy wings with your choice of sauce",
                        new BigDecimal("14.99"), "Appetizer"),
                new MenuItem("Garlic Bread", "Toasted bread with garlic butter",
                        new BigDecimal("6.99"), "Appetizer"),
                new MenuItem("Tiramisu", "Classic Italian dessert with coffee flavor",
                        new BigDecimal("8.99"), "Dessert"),
                new MenuItem("Chocolate Cake", "Rich chocolate cake with ganache",
                        new BigDecimal("7.99"), "Dessert")
        };

        menuItemRepository.saveAll(Arrays.asList(menuItems));
        System.out.println("Sample menu data loaded successfully! 🍕");
    }
}
