# 📚 Le Restaurant - Naming Conventions Dictionary

## Overview
This document defines **comprehensive naming conventions** for the Le Restaurant project, covering Java classes, variables, methods, database elements, and general coding standards.

---

## 🎯 General Naming Principles

### Core Rules
- **English Only**: All names must be in English
- **Descriptive Names**: Names should clearly describe purpose/function
- **No Abbreviations**: Avoid abbreviations unless widely accepted (ID, URL, API)
- **Consistent Casing**: Follow Java naming conventions strictly
- **No Underscores**: Use camelCase instead of snake_case (except constants)

### Naming Pattern
```
[Domain][Action][Subject][Type]
Example: userRegistrationService, customerAuthenticationController
```

---

## 📁 Package Naming

### Package Structure
```java
com.lerestaurant
├── controller          // REST controllers
├── service            // Business logic services  
├── repository         // Data access repositories
├── entity             // JPA entities
├── dto                // Data transfer objects
├── config             // Configuration classes
├── security           // Security components
├── util               // Utility classes
├── exception          // Custom exceptions
└── constant           // Application constants
```

### Package Naming Rules
- **All lowercase**
- **Singular nouns**
- **No underscores or hyphens**

---

## 🏗️ Class Naming Dictionary

### Entity Classes
| Purpose | Naming Pattern | Example | Notes |
|---------|---------------|---------|-------|
| User entities | `[Type]` | `User`, `Manager`, `Customer` | Singular noun |
| Business entities | `[BusinessConcept]` | `MenuItem`, `RestaurantTable`, `Reservation` | Clear business concept |
| Audit entities | `[Entity]Log` | `SecurityLog`, `AuditLog` | Event tracking |
| Lookup entities | `[Category]` | `MenuCategory`, `TableType` | Classification tables |

```java
// ✅ Good Examples
public class User { }
public class MenuItem { }
public class RestaurantTable { }
public class EmailVerification { }
public class PasswordReset { }

// ❌ Bad Examples  
public class user { }           // Wrong case
public class MenuI { }          // Abbreviation
public class Table { }          // Too generic
public class Email_Verification { }  // Underscore
```

### Controller Classes
| Purpose | Naming Pattern | Example | Notes |
|---------|---------------|---------|-------|
| REST controllers | `[Entity]Controller` | `UserController`, `AuthController` | Clear endpoint grouping |
| View controllers | `[View]ViewController` | `DashboardViewController` | For Thymeleaf views |
| API controllers | `[API][Entity]Controller` | `ApiUserController` | API-specific controllers |

```java
// ✅ Good Examples
@RestController
public class UserController { }

@RestController  
public class AuthenticationController { }

@Controller
public class DashboardViewController { }

// ❌ Bad Examples
public class UserCtrl { }       // Abbreviation
public class Users { }          // Plural
public class UserAPI { }        // Wrong suffix
```

### Service Classes
| Purpose | Naming Pattern | Example | Notes |
|---------|---------------|---------|-------|
| Business services | `[Entity]Service` | `UserService`, `ReservationService` | Core business logic |
| Utility services | `[Function]Service` | `EmailService`, `TokenService` | Support services |
| Integration services | `[External]IntegrationService` | `PaymentIntegrationService` | External systems |

```java
// ✅ Good Examples
@Service
public class UserRegistrationService { }

@Service
public class EmailNotificationService { }

@Service
public class JwtTokenService { }

// ❌ Bad Examples
public class UserSvc { }        // Abbreviation
public class UserBusiness { }   // Unclear suffix
public class UserLogic { }      // Generic term
```

### Repository Classes
| Purpose | Naming Pattern | Example | Notes |
|---------|---------------|---------|-------|
| JPA repositories | `[Entity]Repository` | `UserRepository`, `MenuItemRepository` | Data access layer |
| Custom repositories | `[Entity]CustomRepository` | `UserCustomRepository` | Custom query methods |

```java
// ✅ Good Examples
public interface UserRepository extends JpaRepository<User, Long> { }
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> { }
public interface ReservationCustomRepository { }

// ❌ Bad Examples
public interface UserRepo { }   // Abbreviation
public interface UserDAO { }    // Different pattern
public interface Users { }      // Plural
```

### DTO Classes
| Purpose | Naming Pattern | Example | Notes |
|---------|---------------|---------|-------|
| Request DTOs | `[Entity][Action]Request` | `UserRegistrationRequest`, `LoginRequest` | Incoming data |
| Response DTOs | `[Entity][Action]Response` | `UserProfileResponse`, `AuthResponse` | Outgoing data |
| Internal DTOs | `[Entity]Dto` | `UserDto`, `MenuItemDto` | Internal transfers |

```java
// ✅ Good Examples
public class UserRegistrationRequest { }
public class UserProfileResponse { }
public class MenuItemDto { }
public class ReservationCreateRequest { }

// ❌ Bad Examples
public class UserRegReq { }     // Abbreviation
public class UserForm { }       // Unclear purpose
public class UserData { }       // Generic term
```

---

## 🔧 Method Naming Dictionary

### CRUD Operations
| Operation | Naming Pattern | Example | Return Type |
|-----------|---------------|---------|-------------|
| Create | `create[Entity]` | `createUser()`, `createReservation()` | Entity or ID |
| Read (Single) | `find[Entity]By[Criteria]` | `findUserByEmail()`, `findReservationById()` | Optional<Entity> |
| Read (Multiple) | `findAll[Entities]` | `findAllUsers()`, `findAllActiveReservations()` | List<Entity> |
| Update | `update[Entity]` | `updateUser()`, `updateReservationStatus()` | Entity |
| Delete | `delete[Entity]By[Criteria]` | `deleteUserById()`, `deleteExpiredTokens()` | void or boolean |

```java
// ✅ Good Examples - Service Methods
public User createUser(UserRegistrationRequest request) { }
public Optional<User> findUserByEmail(String email) { }
public List<User> findAllActiveUsers() { }
public User updateUserProfile(Long userId, UserProfileRequest request) { }
public void deleteUserById(Long userId) { }

// ✅ Good Examples - Repository Methods  
Optional<User> findByEmail(String email);
List<User> findByUserTypeAndIsActive(UserType userType, Boolean isActive);
void deleteByIdAndUserType(Long id, UserType userType);
boolean existsByEmail(String email);

// ❌ Bad Examples
public User saveUser() { }      // Ambiguous (create or update?)
public User getUser() { }       // Too generic
public List<User> users() { }   // Not descriptive
public void removeUser() { }    // Inconsistent with delete pattern
```

### Business Logic Methods
| Purpose | Naming Pattern | Example | Notes |
|---------|---------------|---------|-------|
| Authentication | `authenticate[Type]` | `authenticateUser()`, `authenticateManager()` | Login operations |
| Authorization | `authorize[Action]` | `authorizeAccess()`, `authorizeOperation()` | Permission checks |
| Validation | `validate[Subject]` | `validatePassword()`, `validateEmail()` | Input validation |
| Processing | `process[Action]` | `processRegistration()`, `processPayment()` | Business workflows |
| Generation | `generate[Item]` | `generateToken()`, `generateReport()` | Create items |

```java
// ✅ Good Examples
public AuthenticationResult authenticateUser(String email, String password) { }
public boolean authorizeManagerAccess(Long userId, String resource) { }
public ValidationResult validatePasswordStrength(String password) { }
public void processUserRegistration(UserRegistrationRequest request) { }
public String generateVerificationToken(Long userId) { }

// ❌ Bad Examples
public boolean auth(String email, String password) { }     // Abbreviation
public boolean canAccess() { }                             // Too generic
public boolean checkPwd() { }                              // Abbreviation
public void doRegistration() { }                           // Unclear prefix
public String newToken() { }                               // Ambiguous
```

---

## 📊 Variable Naming Dictionary

### Field Variables
| Type | Naming Pattern | Example | Notes |
|------|---------------|---------|-------|
| Entity IDs | `[entity]Id` | `userId`, `reservationId`, `menuItemId` | Long type |
| Boolean flags | `is[State]` or `has[Property]` | `isActive`, `hasPermission`, `isVerified` | Boolean type |
| Collections | `[entity]List` or `[entity]s` | `userList`, `reservations`, `menuItems` | List/Set type |
| Counters | `[entity]Count` | `userCount`, `totalReservations` | Integer type |
| Status/State | `[entity]Status` | `reservationStatus`, `paymentStatus` | Enum type |

```java
// ✅ Good Examples - Entity Fields
@Entity
public class User {
    private Long userId;
    private String firstName;
    private String lastName;
    private String emailAddress;
    private String phoneNumber;
    private UserType userType;
    private Boolean isActive;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

// ✅ Good Examples - Service Fields
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final TokenGenerator tokenGenerator;
}

// ❌ Bad Examples
private Long id;                    // Too generic
private String fName;               // Abbreviation
private String email_address;       // Underscore
private Boolean active;             // Missing 'is' prefix
private List<User> usersList;       // Redundant suffix
```

### Method Variables
| Type | Naming Pattern | Example | Notes |
|------|---------------|---------|-------|
| Parameters | `[descriptiveName]` | `userEmail`, `reservationDate`, `menuItemPrice` | Clear purpose |
| Local variables | `[descriptiveName]` | `existingUser`, `hashedPassword`, `verificationToken` | Descriptive |
| Loop variables | `[entity]` or `index` | `user`, `reservation`, `menuItemIndex` | Singular form |
| Temporary | `temp[Purpose]` | `tempPassword`, `tempEmail` | Short-lived |

```java
// ✅ Good Examples
public User registerUser(String userEmail, String plainPassword, String firstName) {
    Optional<User> existingUser = userRepository.findByEmail(userEmail);
    String hashedPassword = passwordEncoder.encode(plainPassword);
    String verificationToken = tokenGenerator.generateToken();
    
    for (User user : userList) {
        if (user.getEmail().equals(userEmail)) {
            // process user
        }
    }
    
    return savedUser;
}

// ❌ Bad Examples  
public User registerUser(String e, String p, String n) {        // Single letters
    User u = userRepository.findByEmail(e);                     // Abbreviation
    String pwd = passwordEncoder.encode(p);                     // Abbreviation
    String token1 = tokenGenerator.generateToken();             // Numbered suffix
    
    for (User item : userList) {                                // Generic name
        // process
    }
}
```

---

## 🗄️ Database Naming Dictionary

### Table Names
| Purpose | Naming Pattern | Example | Notes |
|---------|---------------|---------|-------|
| Entity tables | `[entities]` | `users`, `menu_items`, `reservations` | Plural, snake_case |
| Junction tables | `[entity1]_[entity2]` | `user_roles`, `reservation_menu_items` | Many-to-many |
| Audit tables | `[entity]_audit` | `users_audit`, `reservations_audit` | Change tracking |
| Lookup tables | `[category]_types` | `user_types`, `reservation_statuses` | Reference data |

```sql
-- ✅ Good Examples
CREATE TABLE users ( ... );
CREATE TABLE menu_items ( ... );
CREATE TABLE restaurant_tables ( ... );
CREATE TABLE email_verifications ( ... );
CREATE TABLE password_resets ( ... );
CREATE TABLE user_sessions ( ... );
CREATE TABLE security_logs ( ... );
CREATE TABLE audit_logs ( ... );

-- ❌ Bad Examples
CREATE TABLE User ( ... );         -- Wrong case
CREATE TABLE menuitem ( ... );     -- Missing underscore
CREATE TABLE tbl_users ( ... );    -- Unnecessary prefix
CREATE TABLE user ( ... );         -- Singular
```

### Column Names
| Type | Naming Pattern | Example | Notes |
|------|---------------|---------|-------|
| Primary keys | `id` | `id` | Always BIGINT IDENTITY |
| Foreign keys | `[table]_id` | `user_id`, `menu_item_id` | Reference to other table |
| Booleans | `is_[state]` | `is_active`, `is_verified` | BIT type |
| Timestamps | `[action]_at` | `created_at`, `updated_at`, `deleted_at` | DATETIME2 type |
| Enums | `[category]_type` | `user_type`, `reservation_status` | NVARCHAR with CHECK |

```sql
-- ✅ Good Examples
CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    phone_number NVARCHAR(20),
    user_type NVARCHAR(20) NOT NULL,
    is_active BIT DEFAULT 1,
    email_verified BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- ❌ Bad Examples
CREATE TABLE users (
    ID int,                         -- Wrong type and case
    Email varchar(255),             -- Wrong case
    pwd varchar(255),               -- Abbreviation
    firstName varchar(100),         -- camelCase in database
    active bit,                     -- Missing 'is_' prefix
    CreatedDate datetime            -- Wrong case and suffix
);
```

### Index Names
| Type | Naming Pattern | Example | Notes |
|------|---------------|---------|-------|
| Primary key | `PK_[table]` | `PK_users`, `PK_menu_items` | Clustered index |
| Foreign key | `FK_[table]_[referenced_table]` | `FK_reservations_users` | Foreign key constraint |
| Unique index | `UQ_[table]_[column]` | `UQ_users_email` | Unique constraint |
| Regular index | `IX_[table]_[column(s)]` | `IX_users_user_type`, `IX_reservations_date` | Performance index |

```sql
-- ✅ Good Examples
CREATE INDEX IX_users_email ON users(email);
CREATE INDEX IX_users_user_type ON users(user_type);
CREATE INDEX IX_reservations_date ON reservations(reservation_date);
CREATE INDEX IX_menu_items_category ON menu_items(category_id);

-- Foreign Key Constraints
ALTER TABLE reservations ADD CONSTRAINT FK_reservations_users 
    FOREIGN KEY (user_id) REFERENCES users(id);

-- Unique Constraints  
ALTER TABLE users ADD CONSTRAINT UQ_users_email UNIQUE(email);

-- ❌ Bad Examples
CREATE INDEX idx1 ON users(email);                    -- Generic name
CREATE INDEX user_email_index ON users(email);        -- Inconsistent pattern
CREATE INDEX users_email_idx ON users(email);         -- Mixed convention
```

---

## 📡 API Endpoint Naming Dictionary

### RESTful URL Patterns
| Operation | HTTP Method | URL Pattern | Example | Notes |
|-----------|-------------|-------------|---------|-------|
| Get all | GET | `/api/[entities]` | `GET /api/users` | Plural resource |
| Get one | GET | `/api/[entities]/{id}` | `GET /api/users/123` | Specific resource |
| Create | POST | `/api/[entities]` | `POST /api/users` | New resource |
| Update full | PUT | `/api/[entities]/{id}` | `PUT /api/users/123` | Replace resource |
| Update partial | PATCH | `/api/[entities]/{id}` | `PATCH /api/users/123` | Modify resource |
| Delete | DELETE | `/api/[entities]/{id}` | `DELETE /api/users/123` | Remove resource |

### Nested Resources
| Pattern | Example | Purpose |
|---------|---------|---------|
| `/api/[parent]/{id}/[children]` | `/api/users/123/reservations` | User's reservations |
| `/api/[parent]/{id}/[children]/{id}` | `/api/users/123/reservations/456` | Specific user reservation |
| `/api/[entities]/[action]` | `/api/auth/login`, `/api/users/search` | Special operations |

### Query Parameters
| Type | Pattern | Example | Purpose |
|------|---------|---------|---------|
| Filtering | `?[field]=[value]` | `?userType=CUSTOMER&isActive=true` | Filter results |
| Sorting | `?sortBy=[field]&sortDir=[asc\|desc]` | `?sortBy=createdAt&sortDir=desc` | Sort results |
| Pagination | `?page=[num]&size=[num]` | `?page=0&size=20` | Paginate results |
| Search | `?search=[term]` | `?search=john` | Text search |

```
// ✅ Good Examples - RESTful APIs
GET    /api/users                           // Get all users
GET    /api/users/123                       // Get user by ID
POST   /api/users                           // Create new user
PUT    /api/users/123                       // Update user completely
PATCH  /api/users/123                       // Update user partially
DELETE /api/users/123                       // Delete user

GET    /api/users/123/reservations          // Get user's reservations
POST   /api/users/123/reservations          // Create reservation for user
GET    /api/users/123/reservations/456      // Get specific user reservation

// Authentication & Special Operations
POST   /api/auth/login                      // User login
POST   /api/auth/logout                     // User logout
POST   /api/auth/refresh                    // Refresh token
POST   /api/users/123/reset-password        // Reset user password
POST   /api/users/123/verify-email          // Verify user email

// Filtering and Pagination
GET    /api/users?userType=CUSTOMER&isActive=true&page=0&size=20
GET    /api/reservations?date=2025-01-01&status=CONFIRMED&sortBy=createdAt

// ❌ Bad Examples
GET    /api/getUsers                        // Verb in URL
POST   /api/createUser                      // Verb in URL
GET    /api/user/123                        // Singular resource
DELETE /api/users/delete/123                // Redundant verb
GET    /api/users-search?name=john          // Inconsistent pattern
POST   /api/user_login                      // Underscore and singular
```

---

## 🔧 Configuration Naming Dictionary

### Application Properties
| Type | Naming Pattern | Example | Notes |
|------|---------------|---------|-------|
| Database | `spring.datasource.[property]` | `spring.datasource.url` | Spring Boot standard |
| Security | `app.security.[property]` | `app.security.jwt-secret` | Custom security config |
| Email | `app.email.[property]` | `app.email.smtp-host` | Email configuration |
| File Upload | `app.upload.[property]` | `app.upload.max-file-size` | Upload settings |
| Business | `app.business.[property]` | `app.business.reservation-window` | Business rules |

```properties
# ✅ Good Examples - application.yml
spring:
  datasource:
    url: ${AZURE_SQL_CONNECTION_STRING}
    username: ${AZURE_SQL_USERNAME}
    password: ${AZURE_SQL_PASSWORD}
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    
app:
  security:
    jwt-secret: ${JWT_SECRET}
    jwt-expiration: 86400000
    password-reset-expiration: 3600000
    
  email:
    smtp-host: ${SMTP_HOST}
    smtp-port: ${SMTP_PORT}
    from-address: noreply@lerestaurant.com
    
  business:
    reservation-window-days: 30
    max-party-size: 12
    cancellation-window-hours: 24

# ❌ Bad Examples
app:
  jwtSecret: secret                         // Wrong case
  emailHost: smtp.gmail.com                 // Inconsistent grouping
  maxFileSize: 10MB                         // Wrong grouping
  business_rules:                           // Underscore
    reservationWindow: 30                   // Should be grouped properly
```

### Environment Variables
| Type | Naming Pattern | Example | Notes |
|------|---------------|---------|-------|
| Database | `[DB]_[PROPERTY]` | `AZURE_SQL_USERNAME`, `AZURE_SQL_PASSWORD` | Database credentials |
| External API | `[SERVICE]_[PROPERTY]` | `SENDGRID_API_KEY`, `STRIPE_SECRET_KEY` | Third-party services |
| Security | `[SECURITY]_[PROPERTY]` | `JWT_SECRET`, `ENCRYPTION_KEY` | Security keys |
| Azure | `AZURE_[SERVICE]_[PROPERTY]` | `AZURE_KEYVAULT_URI`, `AZURE_STORAGE_ACCOUNT` | Azure services |

```bash
# ✅ Good Examples
export AZURE_SQL_CONNECTION_STRING="jdbc:sqlserver://..."
export AZURE_SQL_USERNAME="sqladmin"
export AZURE_SQL_PASSWORD="SecurePassword123!"
export JWT_SECRET="mySecretJwtKey"
export SENDGRID_API_KEY="SG.xxxxx"
export AZURE_KEYVAULT_URI="https://keyvault.vault.azure.net/"

# ❌ Bad Examples
export dbUrl="jdbc:..."                    // Wrong case
export sql_username="admin"                // Underscore and generic
export jwtkey="secret"                     // Missing separator
export apiKey="xxx"                        // Too generic
```

---

## ✅ Naming Validation Checklist

### Before Committing Code
- [ ] **Class names** follow PascalCase and are descriptive
- [ ] **Method names** follow camelCase and start with verb
- [ ] **Variable names** follow camelCase and are descriptive
- [ ] **Package names** are all lowercase and singular
- [ ] **Database objects** follow snake_case convention
- [ ] **API endpoints** follow RESTful conventions
- [ ] **Configuration properties** follow hierarchical naming
- [ ] **No abbreviations** used (except standard ones)
- [ ] **Boolean variables** start with is/has/can
- [ ] **Collections** use plural forms appropriately

### Code Review Checklist
- [ ] Names are self-documenting
- [ ] Consistent naming patterns across similar components
- [ ] No Hungarian notation or prefixes
- [ ] Names follow domain language (restaurant terminology)
- [ ] Acronyms are properly cased (ID, URL, API, not Id, Url, Api)

This naming dictionary ensures consistency across the entire Le Restaurant project and helps maintain high code quality standards. 