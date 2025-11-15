package com.lerestaurant.le_restaurant_backend.config;

import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.MenuItemRepository;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Arrays;

@Component  // Enable data loading
public class DataLoader implements CommandLineRunner {

    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataLoader(MenuItemRepository menuItemRepository, 
                     UserRepository userRepository,
                     PasswordEncoder passwordEncoder) {
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Load users if database is empty
        if (userRepository.count() == 0) {
            loadTestUsers();
        }
        
        // Load menu items if database is empty
        if (menuItemRepository.count() == 0) {
            loadSampleData();
        }
    }

    private void loadTestUsers() {
        String password = "password123";
        
        // Delete existing test users if they exist (to avoid duplicates)
        userRepository.findByEmail("customer@lerestaurant.com").ifPresent(userRepository::delete);
        userRepository.findByEmail("manager@lerestaurant.com").ifPresent(userRepository::delete);
        userRepository.findByEmail("admin@lerestaurant.com").ifPresent(userRepository::delete);
        
        // Create test users with properly encoded passwords
        User customer = new User();
        customer.setEmail("customer@lerestaurant.com");
        customer.setPasswordHash(passwordEncoder.encode(password));
        customer.setFirstName("John");
        customer.setLastName("Customer");
        customer.setPhoneNumber("0412345678");
        customer.setRole(User.UserRole.CUSTOMER);
        customer.setStatus(User.UserStatus.ACTIVE);
        customer.setCreatedAt(OffsetDateTime.now());
        User savedCustomer = userRepository.save(customer);
        
        User manager = new User();
        manager.setEmail("manager@lerestaurant.com");
        manager.setPasswordHash(passwordEncoder.encode(password));
        manager.setFirstName("Jane");
        manager.setLastName("Manager");
        manager.setPhoneNumber("0423456789");
        manager.setRole(User.UserRole.MANAGER);
        manager.setStatus(User.UserStatus.ACTIVE);
        manager.setCreatedAt(OffsetDateTime.now());
        User savedManager = userRepository.save(manager);
        
        User admin = new User();
        admin.setEmail("admin@lerestaurant.com");
        admin.setPasswordHash(passwordEncoder.encode(password));
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setPhoneNumber("0434567890");
        admin.setRole(User.UserRole.ADMIN);
        admin.setStatus(User.UserStatus.ACTIVE);
        admin.setCreatedAt(OffsetDateTime.now());
        User savedAdmin = userRepository.save(admin);
        
        // Verify password encoding works
        boolean customerPasswordValid = passwordEncoder.matches(password, savedCustomer.getPasswordHash());
        boolean managerPasswordValid = passwordEncoder.matches(password, savedManager.getPasswordHash());
        boolean adminPasswordValid = passwordEncoder.matches(password, savedAdmin.getPasswordHash());
        
        System.out.println("========================================");
        System.out.println("Test users loaded successfully! 👤");
        System.out.println("  - customer@lerestaurant.com / password123 (Password valid: " + customerPasswordValid + ")");
        System.out.println("  - manager@lerestaurant.com / password123 (Password valid: " + managerPasswordValid + ")");
        System.out.println("  - admin@lerestaurant.com / password123 (Password valid: " + adminPasswordValid + ")");
        System.out.println("========================================");
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
