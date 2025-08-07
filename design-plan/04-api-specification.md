# 🔌 REST API Specification

> **Reference Document**: Complete API specification for Le Restaurant ordering system with detailed endpoints, request/response schemas, and integration examples.

## 📋 API Overview

### API Information
**Base URL**: `https://api.le-restaurant.com/api/v1`  
**Version**: 1.0  
**Protocol**: HTTPS  
**Authentication**: JWT Bearer Token  
**Content Type**: `application/json`  
**Rate Limiting**: 1000 requests/hour per client  

---

## 🔐 Authentication

### Authentication Flow

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "refreshToken": "refresh_token_here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "CUSTOMER"
    }
  },
  "timestamp": "2025-01-27T10:30:00Z",
  "errors": []
}
```

### Authorization Header
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🍽️ Menu Management API

### Get All Menu Categories

```http
GET /api/v1/menu/categories
```

**Response:**
```json
{
  "success": true,
  "message": "Menu categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Appetizers",
      "description": "Start your meal with our delicious appetizers",
      "displayOrder": 1,
      "isActive": true,
      "itemCount": 8,
      "createdAt": "2025-01-15T09:00:00Z"
    },
    {
      "id": 2,
      "name": "Main Courses",
      "description": "Hearty main dishes to satisfy your appetite",
      "displayOrder": 2,
      "isActive": true,
      "itemCount": 15,
      "createdAt": "2025-01-15T09:00:00Z"
    }
  ],
  "timestamp": "2025-01-27T10:30:00Z",
  "errors": []
}
```

### Get Menu Items by Category

```http
GET /api/v1/menu/categories/{categoryId}/items
```

**Path Parameters:**
- `categoryId` (integer, required): The ID of the menu category

**Query Parameters:**
- `page` (integer, optional): Page number (default: 0)
- `size` (integer, optional): Page size (default: 20)
- `available` (boolean, optional): Filter by availability

**Response:**
```json
{
  "success": true,
  "message": "Menu items retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "categoryId": 1,
        "name": "Caesar Salad",
        "description": "Fresh romaine lettuce with parmesan cheese and croutons",
        "price": 12.99,
        "isAvailable": true,
        "imageUrl": "https://images.le-restaurant.com/caesar-salad.jpg",
        "allergens": ["gluten", "dairy"],
        "nutritionalInfo": {
          "calories": 320,
          "protein": 8,
          "carbs": 15,
          "fat": 25
        },
        "createdAt": "2025-01-15T09:00:00Z",
        "updatedAt": "2025-01-25T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 20,
      "totalElements": 8,
      "totalPages": 1,
      "hasNext": false,
      "hasPrevious": false
    }
  },
  "timestamp": "2025-01-27T10:30:00Z",
  "errors": []
}
```

### Get Menu Item Details

```http
GET /api/v1/menu/items/{itemId}
```

**Path Parameters:**
- `itemId` (integer, required): The ID of the menu item

**Response:**
```json
{
  "success": true,
  "message": "Menu item retrieved successfully",
  "data": {
    "id": 1,
    "categoryId": 1,
    "categoryName": "Appetizers",
    "name": "Caesar Salad",
    "description": "Fresh romaine lettuce with parmesan cheese and croutons",
    "price": 12.99,
    "isAvailable": true,
    "imageUrl": "https://images.le-restaurant.com/caesar-salad.jpg",
    "allergens": ["gluten", "dairy"],
    "nutritionalInfo": {
      "calories": 320,
      "protein": 8,
      "carbs": 15,
      "fat": 25
    },
    "customizations": [
      {
        "id": 1,
        "name": "Dressing",
        "type": "SINGLE_SELECT",
        "required": true,
        "options": [
          {"id": 1, "name": "Caesar", "price": 0.00},
          {"id": 2, "name": "Ranch", "price": 0.50}
        ]
      }
    ],
    "createdAt": "2025-01-15T09:00:00Z",
    "updatedAt": "2025-01-25T14:30:00Z"
  },
  "timestamp": "2025-01-27T10:30:00Z",
  "errors": []
}
```

---

## 🛒 Order Management API

### Create New Order

```http
POST /api/v1/orders
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2,
      "customizations": [
        {
          "customizationId": 1,
          "optionId": 1
        }
      ],
      "specialInstructions": "Extra croutons please"
    },
    {
      "menuItemId": 5,
      "quantity": 1,
      "customizations": [],
      "specialInstructions": ""
    }
  ],
  "deliveryInfo": {
    "type": "PICKUP",
    "address": null,
    "requestedTime": "2025-01-27T12:30:00Z"
  },
  "paymentMethod": "CARD",
  "notes": "Please call when ready"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 12345,
    "orderNumber": "ORD-2025-001",
    "customerId": 1,
    "status": "PENDING",
    "orderDate": "2025-01-27T10:30:00Z",
    "items": [
      {
        "id": 1,
        "menuItemId": 1,
        "menuItemName": "Caesar Salad",
        "quantity": 2,
        "unitPrice": 12.99,
        "customizations": [
          {
            "name": "Dressing",
            "option": "Caesar",
            "price": 0.00
          }
        ],
        "specialInstructions": "Extra croutons please",
        "subtotal": 25.98
      }
    ],
    "pricing": {
      "subtotal": 38.97,
      "tax": 3.90,
      "tip": 5.00,
      "deliveryFee": 0.00,
      "discount": 0.00,
      "total": 47.87
    },
    "deliveryInfo": {
      "type": "PICKUP",
      "estimatedTime": "2025-01-27T12:30:00Z",
      "actualTime": null
    },
    "paymentInfo": {
      "method": "CARD",
      "status": "PENDING",
      "transactionId": null
    },
    "createdAt": "2025-01-27T10:30:00Z",
    "updatedAt": "2025-01-27T10:30:00Z"
  },
  "timestamp": "2025-01-27T10:30:00Z",
  "errors": []
}
```

### Get Order Details

```http
GET /api/v1/orders/{orderId}
Authorization: Bearer {token}
```

**Path Parameters:**
- `orderId` (integer, required): The ID of the order

**Response:**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": 12345,
    "orderNumber": "ORD-2025-001",
    "customerId": 1,
    "customerInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "status": "IN_PREPARATION",
    "orderDate": "2025-01-27T10:30:00Z",
    "items": [
      {
        "id": 1,
        "menuItemId": 1,
        "menuItemName": "Caesar Salad",
        "quantity": 2,
        "unitPrice": 12.99,
        "customizations": [
          {
            "name": "Dressing",
            "option": "Caesar",
            "price": 0.00
          }
        ],
        "specialInstructions": "Extra croutons please",
        "subtotal": 25.98
      }
    ],
    "pricing": {
      "subtotal": 38.97,
      "tax": 3.90,
      "tip": 5.00,
      "deliveryFee": 0.00,
      "discount": 0.00,
      "total": 47.87
    },
    "deliveryInfo": {
      "type": "PICKUP",
      "estimatedTime": "2025-01-27T12:30:00Z",
      "actualTime": null
    },
    "paymentInfo": {
      "method": "CARD",
      "status": "COMPLETED",
      "transactionId": "txn_1234567890"
    },
    "statusHistory": [
      {
        "status": "PENDING",
        "timestamp": "2025-01-27T10:30:00Z",
        "note": "Order placed"
      },
      {
        "status": "CONFIRMED",
        "timestamp": "2025-01-27T10:32:00Z",
        "note": "Order confirmed by restaurant"
      },
      {
        "status": "IN_PREPARATION",
        "timestamp": "2025-01-27T10:35:00Z",
        "note": "Kitchen started preparing order"
      }
    ],
    "createdAt": "2025-01-27T10:30:00Z",
    "updatedAt": "2025-01-27T10:35:00Z"
  },
  "timestamp": "2025-01-27T10:45:00Z",
  "errors": []
}
```

### Update Order Status

```http
PUT /api/v1/orders/{orderId}/status
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "READY_FOR_PICKUP",
  "note": "Order is ready for pickup at counter"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": 12345,
    "orderNumber": "ORD-2025-001",
    "status": "READY_FOR_PICKUP",
    "updatedAt": "2025-01-27T11:15:00Z",
    "estimatedTime": "2025-01-27T12:30:00Z"
  },
  "timestamp": "2025-01-27T11:15:00Z",
  "errors": []
}
```

### Get Orders (with Pagination)

```http
GET /api/v1/orders
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (integer, optional): Page number (default: 0)
- `size` (integer, optional): Page size (default: 20)
- `status` (string, optional): Filter by order status
- `customerId` (integer, optional): Filter by customer ID
- `dateFrom` (string, optional): Filter from date (ISO 8601)
- `dateTo` (string, optional): Filter to date (ISO 8601)

**Response:**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "id": 12345,
        "orderNumber": "ORD-2025-001",
        "customerId": 1,
        "customerName": "John Doe",
        "status": "READY_FOR_PICKUP",
        "orderDate": "2025-01-27T10:30:00Z",
        "total": 47.87,
        "itemCount": 2,
        "deliveryType": "PICKUP",
        "estimatedTime": "2025-01-27T12:30:00Z"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 20,
      "totalElements": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrevious": false
    },
    "summary": {
      "totalOrders": 1,
      "totalRevenue": 47.87,
      "averageOrderValue": 47.87
    }
  },
  "timestamp": "2025-01-27T11:15:00Z",
  "errors": []
}
```

---

## 👤 Customer Management API

### Create Customer

```http
POST /api/v1/customers
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "preferences": {
    "dietaryRestrictions": ["vegetarian"],
    "allergies": ["nuts"],
    "communicationPreferences": {
      "email": true,
      "sms": false,
      "push": true
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "preferences": {
      "dietaryRestrictions": ["vegetarian"],
      "allergies": ["nuts"],
      "communicationPreferences": {
        "email": true,
        "sms": false,
        "push": true
      }
    },
    "stats": {
      "totalOrders": 0,
      "totalSpent": 0.00,
      "averageOrderValue": 0.00,
      "lastOrderDate": null
    },
    "createdAt": "2025-01-27T10:30:00Z",
    "updatedAt": "2025-01-27T10:30:00Z"
  },
  "timestamp": "2025-01-27T10:30:00Z",
  "errors": []
}
```

### Get Customer Orders

```http
GET /api/v1/customers/{customerId}/orders
Authorization: Bearer {token}
```

**Path Parameters:**
- `customerId` (integer, required): The ID of the customer

**Query Parameters:**
- `page` (integer, optional): Page number (default: 0)
- `size` (integer, optional): Page size (default: 20)
- `status` (string, optional): Filter by order status

**Response:**
```json
{
  "success": true,
  "message": "Customer orders retrieved successfully",
  "data": {
    "customer": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "orders": [
      {
        "id": 12345,
        "orderNumber": "ORD-2025-001",
        "status": "COMPLETED",
        "orderDate": "2025-01-27T10:30:00Z",
        "total": 47.87,
        "itemCount": 2
      }
    ],
    "pagination": {
      "page": 0,
      "size": 20,
      "totalElements": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrevious": false
    }
  },
  "timestamp": "2025-01-27T11:15:00Z",
  "errors": []
}
```

---

## 📊 Admin Dashboard API

### Get Dashboard Statistics

```http
GET /api/v1/admin/dashboard/stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "today": {
      "orders": 45,
      "revenue": 1250.75,
      "averageOrderValue": 27.79,
      "pendingOrders": 8,
      "completedOrders": 37
    },
    "thisWeek": {
      "orders": 312,
      "revenue": 8745.50,
      "averageOrderValue": 28.03,
      "topItems": [
        {
          "itemId": 5,
          "itemName": "Margherita Pizza",
          "quantity": 89,
          "revenue": 1245.50
        }
      ]
    },
    "thisMonth": {
      "orders": 1205,
      "revenue": 33567.25,
      "averageOrderValue": 27.85,
      "newCustomers": 156,
      "returningCustomers": 89
    },
    "ordersByStatus": {
      "PENDING": 8,
      "CONFIRMED": 12,
      "IN_PREPARATION": 15,
      "READY_FOR_PICKUP": 5,
      "COMPLETED": 37,
      "CANCELLED": 2
    },
    "revenueByHour": [
      {"hour": 9, "revenue": 125.50},
      {"hour": 10, "revenue": 245.75},
      {"hour": 11, "revenue": 567.25}
    ]
  },
  "timestamp": "2025-01-27T11:15:00Z",
  "errors": []
}
```

---

## 📋 Data Models

### Order Status Enum
```
PENDING          - Order placed, awaiting confirmation
CONFIRMED        - Order confirmed by restaurant
IN_PREPARATION   - Kitchen is preparing the order
READY_FOR_PICKUP - Order is ready for customer pickup
OUT_FOR_DELIVERY - Order is out for delivery
COMPLETED        - Order has been completed
CANCELLED        - Order has been cancelled
REFUNDED         - Order has been refunded
```

### Delivery Type Enum
```
PICKUP    - Customer will pick up the order
DELIVERY  - Order will be delivered to customer
DINE_IN   - Customer will dine in the restaurant
```

### Payment Method Enum
```
CASH         - Cash payment
CARD         - Credit/Debit card
DIGITAL      - Digital wallet (Apple Pay, Google Pay)
BANK_TRANSFER - Bank transfer
```

### Payment Status Enum
```
PENDING    - Payment is pending
PROCESSING - Payment is being processed
COMPLETED  - Payment completed successfully
FAILED     - Payment failed
REFUNDED   - Payment has been refunded
```

---

## 🔍 Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "timestamp": "2025-01-27T11:15:00Z",
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "field": "email",
      "message": "Email address is required",
      "rejectedValue": null
    },
    {
      "code": "VALIDATION_ERROR",
      "field": "items",
      "message": "At least one item is required",
      "rejectedValue": []
    }
  ]
}
```

### HTTP Status Codes

| Status Code | Description | Usage |
|-------------|-------------|-------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 204 | No Content | Successful DELETE requests |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side errors |

### Common Error Codes

```
AUTH_001: Invalid credentials
AUTH_002: Token expired
AUTH_003: Insufficient permissions

VALIDATION_001: Required field missing
VALIDATION_002: Invalid format
VALIDATION_003: Value out of range

BUSINESS_001: Item not available
BUSINESS_002: Order cannot be modified
BUSINESS_003: Payment failed

SYSTEM_001: Database connection error
SYSTEM_002: External service unavailable
SYSTEM_003: Rate limit exceeded
```

---

## 🔧 API Testing Examples

### cURL Examples

#### Create an Order
```bash
curl -X POST "https://api.le-restaurant.com/api/v1/orders" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "customerInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "items": [
      {
        "menuItemId": 1,
        "quantity": 2,
        "customizations": [],
        "specialInstructions": ""
      }
    ],
    "deliveryInfo": {
      "type": "PICKUP",
      "requestedTime": "2025-01-27T12:30:00Z"
    },
    "paymentMethod": "CARD"
  }'
```

#### Get Menu Items
```bash
curl -X GET "https://api.le-restaurant.com/api/v1/menu/categories/1/items?page=0&size=10" \
  -H "Content-Type: application/json"
```

### Postman Collection

```json
{
  "info": {
    "name": "Le Restaurant API",
    "description": "Complete API collection for Le Restaurant ordering system",
    "version": "1.0.0"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{auth_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "https://api.le-restaurant.com/api/v1",
      "type": "string"
    },
    {
      "key": "auth_token",
      "value": "",
      "type": "string"
    }
  ]
}
```

---

## 📈 API Versioning Strategy

### Version Management
- **Current Version**: v1
- **URL Pattern**: `/api/v{version}/`
- **Header Support**: `Accept: application/vnd.le-restaurant.v1+json`
- **Deprecation Policy**: 12 months notice for breaking changes

### Backward Compatibility
- Additive changes (new fields, endpoints) are non-breaking
- Field removal requires new API version
- Data type changes require new API version
- Endpoint removal requires new API version

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Status**: Reference Specification 