# API-001 REST API Specification

> **Document ID**: API-001  
> **Version**: 2.0  
> **Last Updated**: 2025-12-24  
> **Status**: ✅ Current - Matches Implementation

---

## 📋 API Overview

### API Information
| Property | Value |
|----------|-------|
| **Base URL (Local)** | `http://localhost:8080/api` |
| **Base URL (Production)** | `https://le-restaurant.azurewebsites.net/api` |
| **Version** | 2.0 |
| **Protocol** | HTTPS (Production), HTTP (Local) |
| **Authentication** | JWT Bearer Token |
| **Content Type** | `application/json` |

### Available Controllers
| Controller | Base Path | Feature |
|------------|-----------|---------|
| AuthController | `/api/auth` | F100-F101 Authentication |
| UserController | `/api/users` | F102 User Management |
| MenuController | `/api/menu-items` | F103-F104 Menu Management |
| OrderController | `/api/orders` | F105 Order Management |
| PaymentController | `/api/payments` | F106 Payment Processing |
| DeliveryController | `/api/deliveries` | F107 Delivery Management |
| DeliveryAddressController | `/api/delivery-addresses` | F107 Delivery Addresses |
| ReservationController | `/api/reservations` | F108-F109 Reservation |
| CartController | `/api/cart` | Shopping Cart |
| StatisticsController | `/api/statistics` | Dashboard Statistics |
| HealthController | `/api/health` | Health Check |

---

## 🔐 Authentication API (`/api/auth`)

### POST /api/auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER",
    "status": "ACTIVE"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

---

### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 2,
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "role": "CUSTOMER",
    "status": "ACTIVE"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 👤 User Management API (`/api/users`)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get user by ID |
| GET | `/api/users/email/{email}` | Get user by email |
| GET | `/api/users/role/{role}` | Get users by role |
| GET | `/api/users/status/{status}` | Get users by status |
| PUT | `/api/users/{id}` | Update user |
| PUT | `/api/users/{id}/status` | Update user status |
| PUT | `/api/users/{id}/login` | Update last login time |
| DELETE | `/api/users/{id}` | Delete user |
| GET | `/api/users/exists/{email}` | Check email exists |

### UserDto Response
```json
{
  "id": 1,
  "email": "user@example.com",
  "phoneNumber": "+1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CUSTOMER",
  "status": "ACTIVE",
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z",
  "lastLogin": "2025-01-20T14:30:00Z",
  "profileImageUrl": null
}
```

### UserRole Enum
```
CUSTOMER, MANAGER, ADMIN
```

### UserStatus Enum
```
ACTIVE, INACTIVE, SUSPENDED
```

---

## 🍽️ Menu Management API (`/api/menu-items`)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu-items` | Get all menu items |
| GET | `/api/menu-items/{id}` | Get menu item by ID |
| POST | `/api/menu-items` | Create menu item (Manager) |
| PUT | `/api/menu-items/{id}` | Update menu item (Manager) |
| DELETE | `/api/menu-items/{id}` | Delete menu item (Manager) |
| GET | `/api/menu-items/categories` | Get all categories |
| PUT | `/api/menu-items/{id}/image` | Update item image |
| GET | `/api/menu-items/low-stock` | Get low stock items |
| PUT | `/api/menu-items/{id}/stock` | Update stock quantity |

### Query Parameters for GET /api/menu-items
- `category` (string): Filter by category name
- `search` (string): Search by name
- `available` (boolean): Filter by availability

### MenuItemDto Response
```json
{
  "id": 1,
  "name": "Caesar Salad",
  "description": "Fresh romaine lettuce with parmesan",
  "price": 12.99,
  "category": "Appetizers",
  "imageUrl": "https://example.com/caesar.jpg",
  "isAvailable": true,
  "stockQuantity": 50,
  "lowStockThreshold": 10,
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

---

## 🛒 Order Management API (`/api/orders`)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/{id}` | Get order by ID |
| GET | `/api/orders/customer/{customerId}` | Get orders by customer |
| GET | `/api/orders/status/{status}` | Get orders by status |
| PUT | `/api/orders/{id}` | Update order |
| PUT | `/api/orders/{id}/status` | Update order status |
| DELETE | `/api/orders/{id}` | Cancel order |

### OrderCreateRequestDto
```json
{
  "customerId": 1,
  "tableId": 5,
  "orderType": "DINE_IN",
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2
    }
  ],
  "specialInstructions": "No onions please",
  "tipAmount": 5.00
}
```

### OrderDto Response
```json
{
  "id": 1,
  "customerId": 1,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "tableId": 5,
  "tableNumber": "A5",
  "orderType": "DINE_IN",
  "status": "PENDING",
  "items": [...],
  "subtotal": 25.98,
  "taxAmount": 2.60,
  "tipAmount": 5.00,
  "totalAmount": 33.58,
  "specialInstructions": "No onions please",
  "orderTime": "2025-01-20T12:00:00Z",
  "estimatedCompletion": "2025-01-20T12:30:00Z",
  "completedAt": null
}
```

### OrderType Enum
```
DINE_IN, TAKEOUT, DELIVERY
```

### OrderStatus Enum
```
PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED
```

---

## 💳 Payment API (`/api/payments`)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments` | Create payment |
| GET | `/api/payments` | Get all payments |
| GET | `/api/payments/{id}` | Get payment by ID |
| GET | `/api/payments/order/{orderId}` | Get payments by order |
| GET | `/api/payments/status/{status}` | Get payments by status |
| PUT | `/api/payments/{id}/status` | Update payment status |
| POST | `/api/payments/{id}/process` | Process payment |
| POST | `/api/payments/{id}/refund` | Refund payment |
| DELETE | `/api/payments/{id}` | Delete payment |

### PaymentRequestDto
```json
{
  "orderId": 1,
  "amount": 33.58,
  "paymentMethod": "CREDIT_CARD",
  "transactionId": "txn_123456"
}
```

### PaymentStatus Enum
```
PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED, CANCELLED
```

### PaymentMethod Enum
```
CREDIT_CARD, DEBIT_CARD, CASH, DIGITAL_WALLET
```

---

## 🚚 Delivery API (`/api/deliveries`)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/deliveries` | Create delivery |
| GET | `/api/deliveries` | Get all deliveries |
| GET | `/api/deliveries/{id}` | Get delivery by ID |
| GET | `/api/deliveries/order/{orderId}` | Get delivery by order |
| GET | `/api/deliveries/status/{status}` | Get deliveries by status |
| PUT | `/api/deliveries/{id}/status` | Update delivery status |
| PUT | `/api/deliveries/{id}/driver` | Assign driver |
| DELETE | `/api/deliveries/{id}` | Delete delivery |

### DeliveryStatus Enum
```
PENDING, ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED, CANCELLED, FAILED
```

---

## 📍 Delivery Address API (`/api/delivery-addresses`)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/delivery-addresses` | Create address |
| GET | `/api/delivery-addresses` | Get all addresses |
| GET | `/api/delivery-addresses/{id}` | Get address by ID |
| GET | `/api/delivery-addresses/user/{userId}` | Get user's addresses |
| PUT | `/api/delivery-addresses/{id}` | Update address |
| DELETE | `/api/delivery-addresses/{id}` | Delete address |
| PUT | `/api/delivery-addresses/{id}/default` | Set as default |

---

## 📅 Reservation API (`/api/reservations`)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reservations` | Create reservation |
| GET | `/api/reservations` | Get all reservations |
| GET | `/api/reservations/{id}` | Get reservation by ID |
| GET | `/api/reservations/customer/{customerId}` | Get by customer |
| GET | `/api/reservations/status/{status}` | Get by status |
| GET | `/api/reservations/date/{date}` | Get by date |
| PUT | `/api/reservations/{id}` | Update reservation |
| POST | `/api/reservations/{id}/approve` | Approve reservation |
| POST | `/api/reservations/{id}/reject` | Reject reservation |
| POST | `/api/reservations/{id}/cancel` | Cancel reservation |
| DELETE | `/api/reservations/{id}` | Delete reservation |
| GET | `/api/reservations/tables/available` | Get available tables |
| GET | `/api/reservations/timeslots` | Get available time slots |

### ReservationStatus Enum
```
PENDING, CONFIRMED, SEATED, COMPLETED, CANCELLED, NO_SHOW
```

---

## 🛒 Cart API (`/api/cart`)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/{userId}` | Get user's cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update` | Update cart item quantity |
| DELETE | `/api/cart/{userId}/item/{itemId}` | Remove item from cart |
| DELETE | `/api/cart/{userId}/clear` | Clear cart |

---

## 📊 Statistics API (`/api/statistics`)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/statistics/revenue` | Get revenue statistics |
| GET | `/api/statistics/daily` | Get daily statistics |
| GET | `/api/statistics/popular-items` | Get popular menu items |

---

## ❤️ Health Check API (`/api/health`)

### GET /api/health
Check API health status.

**Response:**
```json
{
  "status": "UP",
  "timestamp": "2025-01-20T14:30:00Z"
}
```

---

## 🔧 Error Handling

### Standard Error Response
```json
{
  "error": "Error message here"
}
```

### Validation Error Response (400 Bad Request)
```json
{
  "timestamp": "2025-01-20T14:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  }
}
```

### HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Invalid/missing auth |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 500 | Internal Server Error | Server error |

---

## 🔒 Authentication

### JWT Token Usage
Include token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Structure
- **Algorithm**: HS256
- **Claims**: email, role, iat, exp
- **Expiration**: 24 hours

---

**Document ID**: API-001  
**Created**: 2025-01-15  
**Last Updated**: 2025-12-24  
**Author**: Le Restaurant Development Team
