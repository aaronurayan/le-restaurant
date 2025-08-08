# 🎭 Mock Data Setup Guide for Le Restaurant

## Overview
This guide provides **comprehensive mock data setup** for the Le Restaurant application, including realistic sample data for users, menus, tables, reservations, and orders. Designed for **testing, development, and demonstration purposes**.

---

## 📊 Mock Data Structure

### Data Categories
- **Users**: Customers, Staff, and Managers
- **Restaurant Operations**: Tables, Menu Items, Categories
- **Business Data**: Reservations, Orders, Reviews
- **System Data**: Sessions, Logs, Settings

### Data Volume (Recommended)
- **Users**: 50 customers, 15 staff, 5 managers
- **Menu Items**: 40 dishes across 6 categories
- **Tables**: 20 tables of various sizes
- **Reservations**: 100 reservations (past and future)
- **Orders**: 200 orders with line items

---

## 🗄️ Database Mock Data Scripts

### 1. User Mock Data

#### Flyway Migration: `V11__Insert_mock_users.sql`
```sql
-- Insert Mock Managers
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, user_type, email_verified, is_active) VALUES
('john.manager@lerestaurant.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'John', 'Smith', '+1-555-0101', 'MANAGER', 1, 1),
('sarah.admin@lerestaurant.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Sarah', 'Johnson', '+1-555-0102', 'MANAGER', 1, 1),
('mike.owner@lerestaurant.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Mike', 'Rodriguez', '+1-555-0103', 'MANAGER', 1, 1),
('lisa.supervisor@lerestaurant.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Lisa', 'Chen', '+1-555-0104', 'MANAGER', 1, 1),
('david.gm@lerestaurant.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'David', 'Wilson', '+1-555-0105', 'MANAGER', 1, 1);

-- Insert Mock Staff Members
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, user_type, email_verified, is_active) VALUES
('anna.waiter@lerestaurant.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Anna', 'Davis', '+1-555-0201', 'STAFF', 1, 1),
('carlos.chef@lerestaurant.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Carlos', 'Martinez', '+1-555-0202', 'STAFF', 1, 1),
('emily.server@lerestaurant.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Emily', 'Brown', '+1-555-0203', 'STAFF', 1, 1),
('james.cook@lerestaurant.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'James', 'Taylor', '+1-555-0204', 'STAFF', 1, 1),
('maria.hostess@lerestaurant.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Maria', 'Garcia', '+1-555-0205', 'STAFF', 1, 1),
('tom.bartender@lerestaurant.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Tom', 'Anderson', '+1-555-0206', 'STAFF', 1, 1),
('sophie.server@lerestaurant.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Sophie', 'White', '+1-555-0207', 'STAFF', 1, 1),
('alex.busser@lerestaurant.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Alex', 'Thompson', '+1-555-0208', 'STAFF', 1, 1);

-- Insert Mock Customers
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, user_type, email_verified, is_active) VALUES
('alice.customer@gmail.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Alice', 'Johnson', '+1-555-1001', 'CUSTOMER', 1, 1),
('bob.smith@yahoo.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Bob', 'Smith', '+1-555-1002', 'CUSTOMER', 1, 1),
('carol.williams@outlook.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Carol', 'Williams', '+1-555-1003', 'CUSTOMER', 1, 1),
('daniel.jones@gmail.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Daniel', 'Jones', '+1-555-1004', 'CUSTOMER', 1, 1),
('eva.miller@hotmail.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Eva', 'Miller', '+1-555-1005', 'CUSTOMER', 1, 1),
('frank.wilson@gmail.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Frank', 'Wilson', '+1-555-1006', 'CUSTOMER', 1, 1),
('grace.moore@yahoo.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Grace', 'Moore', '+1-555-1007', 'CUSTOMER', 1, 1),
('henry.taylor@outlook.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Henry', 'Taylor', '+1-555-1008', 'CUSTOMER', 1, 1),
('iris.anderson@gmail.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Iris', 'Anderson', '+1-555-1009', 'CUSTOMER', 1, 1),
('jack.thomas@hotmail.com', '$2a$10$N.zmdr9k7uOLQvQHbh/Ca.JbHDwpscAjjO4VMKZOUm2dqfPu2RjcO', 'Jack', 'Thomas', '+1-555-1010', 'CUSTOMER', 1, 1);

-- Note: Password for all mock users is "password123"
```

### 2. Manager Details

#### Flyway Migration: `V12__Insert_mock_managers.sql`
```sql
-- Insert Manager Details
INSERT INTO managers (user_id, employee_id, department, security_level, assigned_at) VALUES
((SELECT id FROM users WHERE email = 'john.manager@lerestaurant.com'), 'MGR001', 'Operations', 'ADMIN', DATEADD(day, -180, GETUTCDATE())),
((SELECT id FROM users WHERE email = 'sarah.admin@lerestaurant.com'), 'MGR002', 'Administration', 'ADMIN', DATEADD(day, -150, GETUTCDATE())),
((SELECT id FROM users WHERE email = 'mike.owner@lerestaurant.com'), 'MGR003', 'Executive', 'ADMIN', DATEADD(day, -365, GETUTCDATE())),
((SELECT id FROM users WHERE email = 'lisa.supervisor@lerestaurant.com'), 'MGR004', 'Service', 'ELEVATED', DATEADD(day, -120, GETUTCDATE())),
((SELECT id FROM users WHERE email = 'david.gm@lerestaurant.com'), 'MGR005', 'General Management', 'ADMIN', DATEADD(day, -200, GETUTCDATE()));
```

### 3. Staff Details

#### Flyway Migration: `V13__Insert_mock_staff.sql`
```sql
-- Insert Staff Details
INSERT INTO staff_members (user_id, employee_id, position, department, hire_date, employment_status, manager_id, hourly_rate) VALUES
((SELECT id FROM users WHERE email = 'anna.waiter@lerestaurant.com'), 'STF001', 'Server', 'Service', DATEADD(day, -90, GETUTCDATE()), 'ACTIVE', (SELECT id FROM managers WHERE employee_id = 'MGR004'), 15.50),
((SELECT id FROM users WHERE email = 'carlos.chef@lerestaurant.com'), 'STF002', 'Head Chef', 'Kitchen', DATEADD(day, -200, GETUTCDATE()), 'ACTIVE', (SELECT id FROM managers WHERE employee_id = 'MGR001'), 25.00),
((SELECT id FROM users WHERE email = 'emily.server@lerestaurant.com'), 'STF003', 'Server', 'Service', DATEADD(day, -60, GETUTCDATE()), 'ACTIVE', (SELECT id FROM managers WHERE employee_id = 'MGR004'), 14.75),
((SELECT id FROM users WHERE email = 'james.cook@lerestaurant.com'), 'STF004', 'Line Cook', 'Kitchen', DATEADD(day, -45, GETUTCDATE()), 'ACTIVE', (SELECT id FROM managers WHERE employee_id = 'MGR001'), 18.00),
((SELECT id FROM users WHERE email = 'maria.hostess@lerestaurant.com'), 'STF005', 'Host', 'Service', DATEADD(day, -75, GETUTCDATE()), 'ACTIVE', (SELECT id FROM managers WHERE employee_id = 'MGR004'), 13.50),
((SELECT id FROM users WHERE email = 'tom.bartender@lerestaurant.com'), 'STF006', 'Bartender', 'Bar', DATEADD(day, -120, GETUTCDATE()), 'ACTIVE', (SELECT id FROM managers WHERE employee_id = 'MGR001'), 16.25),
((SELECT id FROM users WHERE email = 'sophie.server@lerestaurant.com'), 'STF007', 'Server', 'Service', DATEADD(day, -30, GETUTCDATE()), 'ACTIVE', (SELECT id FROM managers WHERE employee_id = 'MGR004'), 14.50),
((SELECT id FROM users WHERE email = 'alex.busser@lerestaurant.com'), 'STF008', 'Busser', 'Service', DATEADD(day, -15, GETUTCDATE()), 'ACTIVE', (SELECT id FROM managers WHERE employee_id = 'MGR004'), 12.00);
```

### 4. Customer Details

#### Flyway Migration: `V14__Insert_mock_customers.sql`
```sql
-- Insert Customer Details
INSERT INTO customers (user_id, date_of_birth, preferred_contact, marketing_consent, loyalty_tier, last_visit) VALUES
((SELECT id FROM users WHERE email = 'alice.customer@gmail.com'), '1990-05-15', 'EMAIL', 1, 'GOLD', DATEADD(day, -5, GETUTCDATE())),
((SELECT id FROM users WHERE email = 'bob.smith@yahoo.com'), '1985-08-22', 'PHONE', 0, 'SILVER', DATEADD(day, -12, GETUTCDATE())),
((SELECT id FROM users WHERE email = 'carol.williams@outlook.com'), '1992-03-10', 'EMAIL', 1, 'PLATINUM', DATEADD(day, -3, GETUTCDATE())),
((SELECT id FROM users WHERE email = 'daniel.jones@gmail.com'), '1988-11-30', 'SMS', 1, 'BRONZE', DATEADD(day, -20, GETUTCDATE())),
((SELECT id FROM users WHERE email = 'eva.miller@hotmail.com'), '1995-07-18', 'EMAIL', 1, 'SILVER', DATEADD(day, -8, GETUTCDATE())),
((SELECT id FROM users WHERE email = 'frank.wilson@gmail.com'), '1982-12-05', 'PHONE', 0, 'GOLD', DATEADD(day, -15, GETUTCDATE())),
((SELECT id FROM users WHERE email = 'grace.moore@yahoo.com'), '1991-09-25', 'EMAIL', 1, 'BRONZE', DATEADD(day, -25, GETUTCDATE())),
((SELECT id FROM users WHERE email = 'henry.taylor@outlook.com'), '1987-04-12', 'SMS', 1, 'PLATINUM', DATEADD(day, -2, GETUTCDATE())),
((SELECT id FROM users WHERE email = 'iris.anderson@gmail.com'), '1993-06-08', 'EMAIL', 1, 'SILVER', DATEADD(day, -10, GETUTCDATE())),
((SELECT id FROM users WHERE email = 'jack.thomas@hotmail.com'), '1989-01-20', 'PHONE', 0, 'BRONZE', DATEADD(day, -30, GETUTCDATE()));
```

---

## 🍽️ Restaurant Operations Mock Data

### 5. Menu Categories and Items

#### Flyway Migration: `V15__Insert_mock_menu_data.sql`
```sql
-- Create Menu Categories Table
CREATE TABLE menu_categories (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Insert Menu Categories
INSERT INTO menu_categories (name, description, display_order) VALUES
('Appetizers', 'Start your meal with our delicious appetizers', 1),
('Soups & Salads', 'Fresh soups and crisp salads', 2),
('Main Courses', 'Our signature main dishes', 3),
('Pasta & Risotto', 'Italian classics made fresh', 4),
('Desserts', 'Sweet endings to your meal', 5),
('Beverages', 'Drinks, wines, and cocktails', 6);

-- Create Menu Items Table
CREATE TABLE menu_items (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    ingredients NVARCHAR(1000),
    allergens NVARCHAR(200),
    is_vegetarian BIT DEFAULT 0,
    is_vegan BIT DEFAULT 0,
    is_gluten_free BIT DEFAULT 0,
    calories INT,
    prep_time_minutes INT,
    is_available BIT DEFAULT 1,
    image_url NVARCHAR(500),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (category_id) REFERENCES menu_categories(id)
);

-- Insert Appetizers
INSERT INTO menu_items (category_id, name, description, price, ingredients, allergens, is_vegetarian, calories, prep_time_minutes) VALUES
(1, 'Bruschetta Trio', 'Three varieties of our classic bruschetta with fresh tomatoes, basil, and mozzarella', 12.95, 'Bread, tomatoes, basil, mozzarella, olive oil, garlic', 'Gluten, Dairy', 1, 280, 10),
(1, 'Calamari Rings', 'Golden fried squid rings served with marinara sauce', 14.50, 'Squid, flour, marinara sauce, lemon', 'Gluten, Seafood', 0, 320, 12),
(1, 'Spinach Artichoke Dip', 'Creamy dip served with tortilla chips', 11.75, 'Spinach, artichokes, cream cheese, tortilla chips', 'Dairy', 1, 380, 8),
(1, 'Buffalo Wings', 'Spicy chicken wings with blue cheese dip', 13.25, 'Chicken wings, buffalo sauce, blue cheese', 'Dairy', 0, 450, 15);

-- Insert Soups & Salads
INSERT INTO menu_items (category_id, name, description, price, ingredients, allergens, is_vegetarian, calories, prep_time_minutes) VALUES
(2, 'Caesar Salad', 'Crisp romaine lettuce with parmesan cheese and croutons', 9.95, 'Romaine lettuce, parmesan, croutons, caesar dressing', 'Gluten, Dairy, Eggs', 1, 220, 5),
(2, 'Tomato Basil Soup', 'Rich and creamy tomato soup with fresh basil', 7.50, 'Tomatoes, cream, basil, onions, garlic', 'Dairy', 1, 180, 10),
(2, 'Mediterranean Salad', 'Mixed greens with olives, feta cheese, and olive oil dressing', 11.25, 'Mixed greens, olives, feta, tomatoes, cucumber', 'Dairy', 1, 190, 7),
(2, 'Chicken Noodle Soup', 'Classic comfort soup with tender chicken and vegetables', 8.75, 'Chicken, noodles, carrots, celery, onions', 'Gluten', 0, 210, 12);

-- Insert Main Courses
INSERT INTO menu_items (category_id, name, description, price, ingredients, allergens, is_vegetarian, calories, prep_time_minutes) VALUES
(3, 'Grilled Salmon', 'Atlantic salmon with lemon herb butter and seasonal vegetables', 24.95, 'Salmon, lemon, herbs, seasonal vegetables', 'Fish', 0, 420, 20),
(3, 'Ribeye Steak', '12oz ribeye steak cooked to perfection with garlic mashed potatoes', 32.50, 'Ribeye steak, potatoes, garlic, butter', 'Dairy', 0, 680, 25),
(3, 'Chicken Parmesan', 'Breaded chicken breast with marinara sauce and mozzarella', 19.75, 'Chicken breast, breadcrumbs, marinara, mozzarella', 'Gluten, Dairy', 0, 520, 18),
(3, 'Vegetarian Burger', 'House-made veggie patty with avocado and sweet potato fries', 16.25, 'Veggie patty, avocado, lettuce, tomato, sweet potatoes', 'Gluten', 1, 480, 15);

-- Insert Pasta & Risotto
INSERT INTO menu_items (category_id, name, description, price, ingredients, allergens, is_vegetarian, calories, prep_time_minutes) VALUES
(4, 'Spaghetti Carbonara', 'Classic Italian pasta with eggs, pancetta, and parmesan', 17.50, 'Spaghetti, eggs, pancetta, parmesan, black pepper', 'Gluten, Dairy, Eggs', 0, 580, 12),
(4, 'Mushroom Risotto', 'Creamy arborio rice with wild mushrooms and truffle oil', 18.95, 'Arborio rice, wild mushrooms, truffle oil, parmesan', 'Dairy', 1, 420, 20),
(4, 'Penne Arrabbiata', 'Spicy tomato sauce with garlic and red peppers', 15.75, 'Penne pasta, tomatoes, garlic, red peppers, olive oil', 'Gluten', 1, 380, 10),
(4, 'Seafood Linguine', 'Linguine with shrimp, scallops, and clams in white wine sauce', 26.50, 'Linguine, shrimp, scallops, clams, white wine', 'Gluten, Seafood', 0, 620, 18);

-- Insert Desserts
INSERT INTO menu_items (category_id, name, description, price, ingredients, allergens, is_vegetarian, calories, prep_time_minutes) VALUES
(5, 'Tiramisu', 'Classic Italian dessert with coffee-soaked ladyfingers', 8.95, 'Ladyfingers, mascarpone, coffee, cocoa powder', 'Gluten, Dairy, Eggs', 1, 320, 5),
(5, 'Chocolate Lava Cake', 'Warm chocolate cake with molten center and vanilla ice cream', 9.50, 'Chocolate, flour, eggs, butter, vanilla ice cream', 'Gluten, Dairy, Eggs', 1, 480, 8),
(5, 'Cheesecake', 'New York style cheesecake with berry compote', 7.75, 'Cream cheese, graham crackers, berries, sugar', 'Gluten, Dairy, Eggs', 1, 420, 3),
(5, 'Gelato Trio', 'Three scoops of artisan gelato - vanilla, chocolate, and strawberry', 6.25, 'Milk, cream, sugar, natural flavors', 'Dairy', 1, 280, 2);

-- Insert Beverages
INSERT INTO menu_items (category_id, name, description, price, ingredients, allergens, is_vegetarian, calories, prep_time_minutes) VALUES
(6, 'House Wine (Glass)', 'Red or white wine selection', 8.50, 'Grapes, sulfites', 'Sulfites', 1, 120, 1),
(6, 'Craft Beer', 'Local brewery selection on tap', 6.75, 'Barley, hops, yeast', 'Gluten', 1, 150, 1),
(6, 'Fresh Lemonade', 'Freshly squeezed lemon juice with mint', 4.25, 'Lemons, sugar, water, mint', 'None', 1, 80, 3),
(6, 'Espresso', 'Double shot of premium espresso', 3.50, 'Coffee beans', 'None', 1, 5, 2);
```

### 6. Tables and Seating

#### Flyway Migration: `V16__Insert_mock_tables.sql`
```sql
-- Create Tables Table
CREATE TABLE restaurant_tables (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    table_number NVARCHAR(10) NOT NULL UNIQUE,
    seating_capacity INT NOT NULL,
    table_type NVARCHAR(20) DEFAULT 'STANDARD' CHECK (table_type IN ('STANDARD', 'BOOTH', 'BAR', 'OUTDOOR', 'PRIVATE')),
    location_area NVARCHAR(50),
    is_available BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Insert Restaurant Tables
INSERT INTO restaurant_tables (table_number, seating_capacity, table_type, location_area) VALUES
('T01', 2, 'STANDARD', 'Main Dining'),
('T02', 4, 'STANDARD', 'Main Dining'),
('T03', 4, 'STANDARD', 'Main Dining'),
('T04', 6, 'STANDARD', 'Main Dining'),
('T05', 2, 'STANDARD', 'Main Dining'),
('T06', 8, 'STANDARD', 'Main Dining'),
('B01', 4, 'BOOTH', 'Side Area'),
('B02', 4, 'BOOTH', 'Side Area'),
('B03', 6, 'BOOTH', 'Side Area'),
('B04', 4, 'BOOTH', 'Side Area'),
('BR01', 2, 'BAR', 'Bar Area'),
('BR02', 2, 'BAR', 'Bar Area'),
('BR03', 3, 'BAR', 'Bar Area'),
('OUT01', 4, 'OUTDOOR', 'Patio'),
('OUT02', 4, 'OUTDOOR', 'Patio'),
('OUT03', 6, 'OUTDOOR', 'Patio'),
('OUT04', 2, 'OUTDOOR', 'Patio'),
('PVT01', 10, 'PRIVATE', 'Private Room'),
('PVT02', 12, 'PRIVATE', 'Private Room'),
('PVT03', 8, 'PRIVATE', 'Private Room');
```

---

## 🎯 Java Mock Data Generator

### MockDataService.java
```java
@Service
@Transactional
public class MockDataService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${app.mock-data.enabled:false}")
    private boolean mockDataEnabled;
    
    @PostConstruct
    public void initializeMockData() {
        if (mockDataEnabled && userRepository.count() == 0) {
            log.info("Initializing mock data...");
            createMockUsers();
            createMockReservations();
            createMockOrders();
            log.info("Mock data initialization completed");
        }
    }
    
    private void createMockUsers() {
        // Create mock managers
        createMockManager("john.manager@lerestaurant.com", "John", "Smith", "MGR001", "Operations");
        createMockManager("sarah.admin@lerestaurant.com", "Sarah", "Johnson", "MGR002", "Administration");
        
        // Create mock staff
        createMockStaff("anna.waiter@lerestaurant.com", "Anna", "Davis", "STF001", "Server", "Service");
        createMockStaff("carlos.chef@lerestaurant.com", "Carlos", "Martinez", "STF002", "Head Chef", "Kitchen");
        
        // Create mock customers
        createMockCustomer("alice.customer@gmail.com", "Alice", "Johnson", "GOLD");
        createMockCustomer("bob.smith@yahoo.com", "Bob", "Smith", "SILVER");
    }
    
    private void createMockManager(String email, String firstName, String lastName, String employeeId, String department) {
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhoneNumber(generatePhoneNumber());
        user.setUserType(UserType.MANAGER);
        user.setEmailVerified(true);
        user.setIsActive(true);
        
        User savedUser = userRepository.save(user);
        
        Manager manager = new Manager();
        manager.setUser(savedUser);
        manager.setEmployeeId(employeeId);
        manager.setDepartment(department);
        manager.setSecurityLevel(SecurityLevel.ADMIN);
        
        // Save manager details
    }
    
    private void createMockStaff(String email, String firstName, String lastName, String employeeId, String position, String department) {
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhoneNumber(generatePhoneNumber());
        user.setUserType(UserType.STAFF);
        user.setEmailVerified(true);
        user.setIsActive(true);
        
        User savedUser = userRepository.save(user);
        
        StaffMember staff = new StaffMember();
        staff.setUser(savedUser);
        staff.setEmployeeId(employeeId);
        staff.setPosition(position);
        staff.setDepartment(department);
        staff.setHireDate(LocalDate.now().minusDays(new Random().nextInt(365)));
        staff.setEmploymentStatus(EmploymentStatus.ACTIVE);
        staff.setHourlyRate(BigDecimal.valueOf(15.00 + new Random().nextDouble() * 10));
        
        // Save staff details
    }
    
    private void createMockCustomer(String email, String firstName, String lastName, String loyaltyTier) {
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhoneNumber(generatePhoneNumber());
        user.setUserType(UserType.CUSTOMER);
        user.setEmailVerified(true);
        user.setIsActive(true);
        
        User savedUser = userRepository.save(user);
        
        Customer customer = new Customer();
        customer.setUser(savedUser);
        customer.setDateOfBirth(generateRandomBirthDate());
        customer.setPreferredContact(PreferredContact.EMAIL);
        customer.setMarketingConsent(new Random().nextBoolean());
        customer.setLoyaltyTier(LoyaltyTier.valueOf(loyaltyTier));
        customer.setLastVisit(LocalDateTime.now().minusDays(new Random().nextInt(30)));
        
        // Save customer details
    }
    
    private String generatePhoneNumber() {
        Random random = new Random();
        return String.format("+1-555-%04d", random.nextInt(10000));
    }
    
    private LocalDate generateRandomBirthDate() {
        Random random = new Random();
        int year = 1980 + random.nextInt(25); // Ages 18-43
        int month = 1 + random.nextInt(12);
        int day = 1 + random.nextInt(28);
        return LocalDate.of(year, month, day);
    }
}
```

---

## 🔧 Mock Data Configuration

### application-dev.yml
```yaml
spring:
  profiles: dev
  
app:
  mock-data:
    enabled: true
    
# Enable SQL logging for development
logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

### MockDataConfiguration.java
```java
@Configuration
@Profile("dev")
public class MockDataConfiguration {
    
    @Bean
    @ConditionalOnProperty(value = "app.mock-data.enabled", havingValue = "true")
    public MockDataService mockDataService() {
        return new MockDataService();
    }
    
    @EventListener
    @Async
    public void handleApplicationReady(ApplicationReadyEvent event) {
        // Additional mock data setup if needed
    }
}
```

---

## 🧪 Testing with Mock Data

### MockDataController.java (Development Only)
```java
@RestController
@RequestMapping("/api/dev/mock-data")
@Profile("dev")
public class MockDataController {
    
    @Autowired
    private MockDataService mockDataService;
    
    @PostMapping("/reset")
    public ResponseEntity<String> resetMockData() {
        mockDataService.clearAllData();
        mockDataService.initializeMockData();
        return ResponseEntity.ok("Mock data reset completed");
    }
    
    @PostMapping("/users/{count}")
    public ResponseEntity<String> generateUsers(@PathVariable int count) {
        mockDataService.generateRandomUsers(count);
        return ResponseEntity.ok(String.format("Generated %d users", count));
    }
    
    @PostMapping("/reservations/{count}")
    public ResponseEntity<String> generateReservations(@PathVariable int count) {
        mockDataService.generateRandomReservations(count);
        return ResponseEntity.ok(String.format("Generated %d reservations", count));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getDataStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("users", mockDataService.getUserCount());
        stats.put("reservations", mockDataService.getReservationCount());
        stats.put("orders", mockDataService.getOrderCount());
        return ResponseEntity.ok(stats);
    }
}
```

---

## 📊 Mock Data Validation

### Data Quality Checks
```java
@Component
public class MockDataValidator {
    
    @Autowired
    private UserRepository userRepository;
    
    public void validateMockData() {
        // Check user distribution
        long managerCount = userRepository.countByUserType(UserType.MANAGER);
        long staffCount = userRepository.countByUserType(UserType.STAFF);
        long customerCount = userRepository.countByUserType(UserType.CUSTOMER);
        
        assert managerCount >= 3 : "Should have at least 3 managers";
        assert staffCount >= 5 : "Should have at least 5 staff members";
        assert customerCount >= 10 : "Should have at least 10 customers";
        
        // Check email uniqueness
        long totalUsers = userRepository.count();
        long uniqueEmails = userRepository.countDistinctEmails();
        assert totalUsers == uniqueEmails : "All emails should be unique";
        
        // Check password encryption
        List<User> users = userRepository.findAll();
        for (User user : users) {
            assert !user.getPasswordHash().equals("password123") : "Passwords should be encrypted";
        }
    }
}
```

---

## 🚀 Deployment Commands

### Generate Mock Data in Azure
```bash
# Enable mock data for development environment
az webapp config appsettings set \
  --resource-group le-restaurant-rg \
  --name le-restaurant-app-[YOUR-INITIALS] \
  --settings \
  SPRING_PROFILES_ACTIVE="azure,dev" \
  APP_MOCK_DATA_ENABLED="true"

# Restart application to trigger mock data generation
az webapp restart \
  --resource-group le-restaurant-rg \
  --name le-restaurant-app-[YOUR-INITIALS]

# Check logs to verify mock data creation
az webapp log tail \
  --resource-group le-restaurant-rg \
  --name le-restaurant-app-[YOUR-INITIALS]
```

---

## 📋 Mock Data Checklist

### Setup Checklist
- [ ] Flyway migration scripts created
- [ ] MockDataService implemented
- [ ] Configuration properties set
- [ ] Development profile enabled
- [ ] Database connection verified

### Validation Checklist
- [ ] All user types created (Manager, Staff, Customer)
- [ ] Passwords properly encrypted
- [ ] Email addresses unique
- [ ] Phone numbers formatted correctly
- [ ] Relationships properly established

### Testing Checklist
- [ ] Login with mock users successful
- [ ] User roles working correctly
- [ ] Data appears in admin dashboard
- [ ] Mock API endpoints functional
- [ ] Performance acceptable with mock data

---

This comprehensive mock data setup provides realistic test data for development, testing, and demonstration of the Le Restaurant application. 