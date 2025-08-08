# 🏗️ System Architecture Design

> **Reference Document**: Technical architecture specification for Le Restaurant ordering system with Azure DevOps integration.

## 📐 Architecture Overview

### System Architecture Pattern
**Pattern**: Layered Architecture with Microservices Readiness  
**Style**: RESTful API with MVC Frontend  
**Deployment**: Cloud-Native on Azure Platform  

---

## 🏛️ Architectural Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      Presentation Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Web Client    │  │  Mobile Client  │  │  Admin Portal   │ │
│  │   (React/HTML)  │  │   (Future)      │  │    (React)      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway Layer                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              Spring Boot REST API                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │ │
│  │  │ Controllers │  │ Middleware  │  │  Security/Auth      │ │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Business Logic Layer                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Menu Service  │  │  Order Service  │  │Customer Service │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Access Layer                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Menu Repository│  │ Order Repository│  │Customer Repo    │ │
│  │  (Spring Data)  │  │ (Spring Data)   │  │ (Spring Data)   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Database Layer                          │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   Azure SQL Database                       │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Component Architecture

### Backend Components

#### 1. Controller Layer
```java
@RestController
@RequestMapping("/api/v1")
public class OrderController {
    // REST endpoints for order management
}

@RestController
@RequestMapping("/api/v1/menu")
public class MenuController {
    // REST endpoints for menu operations
}
```

#### 2. Service Layer
```java
@Service
public class OrderService {
    // Business logic for order processing
    // Order validation, calculation, status management
}

@Service
public class MenuService {
    // Business logic for menu management
    // Menu item availability, pricing logic
}
```

#### 3. Repository Layer
```java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Data access methods for orders
}

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    // Data access methods for menu items
}
```

### Frontend Components

#### 1. React Components Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Navigation.jsx
│   ├── menu/
│   │   ├── MenuList.jsx
│   │   ├── MenuItem.jsx
│   │   └── MenuCategory.jsx
│   ├── order/
│   │   ├── Cart.jsx
│   │   ├── OrderSummary.jsx
│   │   └── OrderStatus.jsx
│   └── admin/
│       ├── Dashboard.jsx
│       ├── OrderManagement.jsx
│       └── MenuManagement.jsx
├── services/
│   ├── api.js
│   ├── orderService.js
│   └── menuService.js
├── utils/
│   ├── constants.js
│   └── helpers.js
└── styles/
    ├── global.css
    └── components.css
```

---

## 💾 Data Architecture

### Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Customer     │     │      Order      │     │   OrderItem     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │────▶│ id (PK)         │────▶│ id (PK)         │
│ name            │     │ customer_id (FK)│     │ order_id (FK)   │
│ email           │     │ order_date      │     │ menu_item_id(FK)│
│ phone           │     │ status          │     │ quantity        │
│ created_at      │     │ total_amount    │     │ unit_price      │
└─────────────────┘     │ created_at      │     │ subtotal        │
                        │ updated_at      │     └─────────────────┘
                        └─────────────────┘              │
                                 │                       │
                                 ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   MenuCategory  │     │    MenuItem     │◄────┤                 │
├─────────────────┤     ├─────────────────┤     └─────────────────┘
│ id (PK)         │────▶│ id (PK)         │
│ name            │     │ category_id (FK)│
│ description     │     │ name            │
│ display_order   │     │ description     │
│ is_active       │     │ price           │
└─────────────────┘     │ is_available    │
                        │ image_url       │
                        │ created_at      │
                        │ updated_at      │
                        └─────────────────┘
```

### Database Schema

#### Tables Structure

**customers**
```sql
CREATE TABLE customers (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) UNIQUE,
    phone NVARCHAR(20),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
```

**menu_categories**
```sql
CREATE TABLE menu_categories (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);
```

**menu_items**
```sql
CREATE TABLE menu_items (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    is_available BIT DEFAULT 1,
    image_url NVARCHAR(500),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (category_id) REFERENCES menu_categories(id)
);
```

**orders**
```sql
CREATE TABLE orders (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    customer_id BIGINT,
    order_date DATETIME2 DEFAULT GETDATE(),
    status NVARCHAR(50) DEFAULT 'PENDING',
    total_amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

**order_items**
```sql
CREATE TABLE order_items (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

---

## 🔌 API Architecture

### REST API Endpoints

#### Menu Management
```
GET    /api/v1/menu/categories          # Get all menu categories
GET    /api/v1/menu/categories/{id}     # Get specific category
GET    /api/v1/menu/items               # Get all menu items
GET    /api/v1/menu/items/{id}          # Get specific menu item
GET    /api/v1/menu/categories/{id}/items # Get items by category
```

#### Order Management
```
POST   /api/v1/orders                   # Create new order
GET    /api/v1/orders/{id}              # Get order details
PUT    /api/v1/orders/{id}/status       # Update order status
GET    /api/v1/orders                   # Get orders (with pagination)
DELETE /api/v1/orders/{id}              # Cancel order
```

#### Customer Management
```
POST   /api/v1/customers                # Create customer
GET    /api/v1/customers/{id}           # Get customer details
PUT    /api/v1/customers/{id}           # Update customer
GET    /api/v1/customers/{id}/orders    # Get customer orders
```

### API Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response payload
  },
  "timestamp": "2025-01-27T10:30:00Z",
  "errors": []
}
```

---

## ☁️ Azure Architecture

### Azure Services Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                        Azure Cloud Services                    │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Azure DevOps  │  │  App Service    │  │  SQL Database   │ │
│  │   - Pipelines   │  │  - Web App      │  │  - Azure SQL    │ │
│  │   - Repos       │  │  - Auto Scale   │  │  - Backup       │ │
│  │   - Artifacts   │  │  - SSL/Custom   │  │  - Monitoring   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ App Insights    │  │  Key Vault      │  │  Storage Acc    │ │
│  │ - Monitoring    │  │  - Secrets      │  │  - Static Files │ │
│  │ - Logging       │  │  - Certificates │  │  - Backups      │ │
│  │ - Analytics     │  │  - Config       │  │  - Logs         │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Deployment Architecture

#### Production Environment
- **Azure App Service**: Host Spring Boot application
- **Azure SQL Database**: Production database with backup
- **Application Insights**: Monitoring and telemetry
- **Azure Key Vault**: Secure configuration management

#### Development/Staging Environment
- **Azure App Service (Dev Slot)**: Development deployment
- **Azure SQL Database (Dev)**: Development database
- **Shared Application Insights**: Development monitoring

---

## 🔒 Security Architecture

### Security Layers

1. **Network Security**
   - HTTPS enforcement
   - Azure App Service security features
   - SQL Database firewall rules

2. **Application Security**
   - Spring Security configuration
   - JWT token authentication
   - Input validation and sanitization
   - CORS configuration

3. **Data Security**
   - Database encryption at rest
   - Connection string encryption
   - Sensitive data masking

### Security Implementation
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/v1/menu/**").permitAll()
                .requestMatchers("/api/v1/orders/**").authenticated()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
            )
            .oauth2ResourceServer().jwt();
        return http.build();
    }
}
```

---

## 📊 Performance Architecture

### Performance Considerations

1. **Database Optimization**
   - Proper indexing strategy
   - Connection pooling
   - Query optimization

2. **Caching Strategy**
   - Menu items caching (Redis future)
   - Application-level caching
   - Browser caching for static assets

3. **Scalability**
   - Azure App Service auto-scaling
   - Database scaling options
   - CDN for static content

### Monitoring and Metrics
- Application response time
- Database query performance
- Error rates and exceptions
- User activity analytics

---

## 🔄 Integration Architecture

### External Integrations (Future)
- Payment processing (Stripe/PayPal)
- Email notifications (SendGrid)
- SMS notifications (Twilio)
- Analytics (Google Analytics)

### Internal Integrations
- Azure DevOps for CI/CD
- Application Insights for monitoring
- Key Vault for configuration

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Status**: Reference Architecture 