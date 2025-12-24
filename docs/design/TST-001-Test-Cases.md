# 07: Overall End-to-End Backend Test Scenarios

**Document Purpose**: To define comprehensive end-to-end (E2E) test scenarios for the Le Restaurant backend, ensuring all features (F100-F109) are fully integrated and function correctly. This document focuses on API interactions and database state changes.

**Last Updated**: 2025-10-23
**Status**: Aligned with complete feature set
**Branch**: main
**Test Focus**: Backend API and Database Integrity

---

## 🎯 Feature Map (F100-F109)

| Feature | Name | Owner | API Endpoints |
|---|---|---|---|
| F100 | User Registration | Junayeed Halim | `POST /api/users/register` |
| F101 | User Authentication | Junayeed Halim | `POST /api/auth/login` |
| F102 | User Management | Jungwook Van | `GET, PUT, DELETE /api/users/{id}` |
| F103 | Menu Display | Mikhail Zhelnin | `GET /api/menu-items` |
| F104 | Menu Management | Mikhail Zhelnin | `POST, PUT, DELETE /api/menu-items` |
| F105 | Order Management | Damaq Zain | `POST, GET /api/orders` |
| F106 | Payment Management | Jungwook Van | `POST /api/payments`, `GET /api/payments/{id}` |
| F107 | Delivery Management | Aaron Urayan | `PUT /api/deliveries/{id}/status` |
| F108 | Table Reservation | Damaq Zain | `POST /api/reservations` |
| F109 | Reservation Management | Aaron Urayan | `PUT /api/reservations/{id}/status` |

---

## 🧪 10 Comprehensive Backend Test Scenarios

Here are 10 end-to-end stories designed to test the integration and business logic of the backend services.

### **Scenario 1: New Customer Full Journey (Happy Path)**
*Story: A new customer signs up, orders food, pays, gets it delivered, and books a table for a future visit.*

1.  **Registration (F100)**: Alice registers via `POST /api/users/register`.
    - **DB Check**: `users` table has a new entry for Alice with `role: 'CUSTOMER'`.
2.  **Login (F101)**: Alice logs in via `POST /api/auth/login`.
    - **API Check**: Receives a valid JWT token.
3.  **Create Order (F105)**: Alice creates an order with 2 menu items via `POST /api/orders`.
    - **DB Check**: `orders` table has a new order with `status: 'PENDING_PAYMENT'`. `order_items` table has 2 corresponding entries.
4.  **Process Payment (F106)**: Alice pays for the order via `POST /api/payments`.
    - **DB Check**: `payments` table has a new entry with `status: 'COMPLETED'`. The `orders` table entry for her order is updated to `status: 'PREPARING'`.
5.  **Manage Delivery (F107)**: A manager updates the delivery status to `OUT_FOR_DELIVERY` and then `DELIVERED` via `PUT /api/deliveries/{id}/status`.
    - **DB Check**: `deliveries` table entry status is updated accordingly.
6.  **Make Reservation (F108)**: Alice books a table via `POST /api/reservations`.
    - **DB Check**: `reservations` table has a new entry with `status: 'PENDING_APPROVAL'`.
7.  **Approve Reservation (F109)**: A manager approves the reservation via `PUT /api/reservations/{id}/status`.
    - **DB Check**: The reservation status is updated to `status: 'CONFIRMED'`.

### **Scenario 2: Manager Manages a User Account**
*Story: A manager views, modifies, and ultimately deletes a problematic user account.*

1.  **User Creation (F100)**: A user "Bob" registers.
2.  **View User (F102)**: A manager (Jungwook) fetches Bob's details via `GET /api/users/{bob_id}`.
    - **API Check**: Receives Bob's user data.
3.  **Update User (F102)**: The manager deactivates Bob's account via `PUT /api/users/{bob_id}` with `status: 'INACTIVE'`.
    - **DB Check**: Bob's entry in the `users` table has `status: 'INACTIVE'`.
4.  **Login Failure (F101)**: Bob attempts to log in.
    - **API Check**: `POST /api/auth/login` returns `401 Unauthorized`.
5.  **Delete User (F102)**: The manager deletes Bob's account via `DELETE /api/users/{bob_id}`.
    - **DB Check**: Bob's entry is removed from the `users` table.

### **Scenario 3: Menu Lifecycle and its Impact on Orders**
*Story: A manager adds a new dish, a customer orders it, the manager updates its price, and finally removes it from the menu.*

1.  **Create Menu Item (F104)**: A manager (Mikhail) adds "Truffle Pasta" for $25 via `POST /api/menu-items`.
    - **DB Check**: `menu_items` table has a new entry for "Truffle Pasta".
2.  **Customer Orders Item (F103, F105)**: A customer views the menu and orders "Truffle Pasta".
    - **DB Check**: A new order is created with an `order_items` entry for "Truffle Pasta" at $25.
3.  **Update Price (F104)**: The manager updates the price to $28 via `PUT /api/menu-items/{id}`.
    - **DB Check**: The price in `menu_items` is now $28.
4.  **New Order with New Price (F105)**: Another customer orders "Truffle Pasta".
    - **DB Check**: The new order's `order_items` entry reflects the $28 price. The original order is unaffected.
5.  **Delete Menu Item (F104)**: The manager deletes "Truffle Pasta".
    - **DB Check**: The item is marked as inactive or removed.
6.  **Order Failure (F105)**: A customer attempts to order the deleted item.
    - **API Check**: `POST /api/orders` returns a `400 Bad Request` or similar error.

### **Scenario 4: Payment Failure and Retry**
*Story: A customer's payment fails, they try again, and the order is processed.*

1.  **Create Order (F105)**: A customer creates an order.
    - **DB Check**: `orders` table shows `status: 'PENDING_PAYMENT'`.
2.  **Payment Fails (F106)**: The customer attempts payment with invalid card details via `POST /api/payments`.
    - **API Check**: Returns a `400 Bad Request`.
    - **DB Check**: `payments` table may log a `FAILED` transaction. The order status remains `PENDING_PAYMENT`.
3.  **Payment Succeeds (F106)**: The customer retries with valid details.
    - **API Check**: Returns `201 Created`.
    - **DB Check**: `payments` table logs a `COMPLETED` transaction. `orders` status updates to `PREPARING`.

### **Scenario 5: Reservation Conflict and Rejection**
*Story: Two customers try to book the last table for the same time slot; one succeeds, the other is rejected.*

1.  **Customer A Reserves (F108)**: Customer A books the last table for 4 at 7 PM via `POST /api/reservations`.
    - **DB Check**: A new reservation is created with `status: 'PENDING_APPROVAL'`.
2.  **Customer B Reserves (F108)**: Before approval, Customer B tries to book the same table slot.
    - **API Check**: The system should either create another `PENDING_APPROVAL` reservation or immediately return a `409 Conflict` if logic prevents overbooking pending requests.
3.  **Manager Approves A (F109)**: A manager (Aaron) approves Customer A's reservation.
    - **DB Check**: Customer A's reservation status becomes `CONFIRMED`.
4.  **Manager Rejects B (F109)**: The manager sees the conflict and rejects Customer B's reservation.
    - **DB Check**: Customer B's reservation status becomes `REJECTED`.

### **Scenario 6: Order Cancellation by Manager**
*Story: A customer places an order, but a manager has to cancel it before it's delivered.*

1.  **Order and Pay (F105, F106)**: A customer successfully places and pays for an order.
    - **DB Check**: Order status is `PREPARING`.
2.  **Manager Cancels (F105/F106)**: A manager cancels the order via a dedicated API endpoint (e.g., `PUT /api/orders/{id}/cancel`).
    - **DB Check**: Order status changes to `CANCELLED`.
    - **Business Logic**: A refund process should be triggered. A `refund` entry might be created in the `payments` table.

### **Scenario 7: Unauthorized Access Attempt**
*Story: A regular customer attempts to access manager-only functionality.*

1.  **Customer Login (F101)**: A customer logs in, obtaining a `CUSTOMER` role JWT.
2.  **Access User Management (F102)**: The customer attempts to call `GET /api/users`.
    - **API Check**: Returns `403 Forbidden`.
3.  **Access Menu Management (F104)**: The customer attempts to call `POST /api/menu-items`.
    - **API Check**: Returns `403 Forbidden`.
4.  **Access Reservation Management (F109)**: The customer attempts to call `PUT /api/reservations/{id}/status`.
    - **API Check**: Returns `403 Forbidden`.

### **Scenario 8: Delivery Driver Workflow**
*Story: A manager assigns a delivery, and the driver updates the status through the journey.*

1.  **Order Confirmed (F105, F106)**: An order is paid for.
    - **DB Check**: A `deliveries` entry is created with `status: 'PENDING_ASSIGNMENT'`.
2.  **Manager Assigns Driver (F107)**: A manager assigns a driver via `PUT /api/deliveries/{id}/assign`.
    - **DB Check**: `deliveries` entry is updated with `driver_id` and `status: 'ASSIGNED'`.
3.  **Driver Updates Status (F107)**: The driver (or system) updates status to `OUT_FOR_DELIVERY` and then `DELIVERED`.
    - **DB Check**: The `status` field in the `deliveries` table is updated at each step.

### **Scenario 9: High-Volume Concurrent Orders**
*Story: Multiple customers place orders for the same limited-stock menu item simultaneously.*

1.  **Setup**: A menu item "Special Dish" has a stock of 1.
2.  **Concurrent Requests (F105)**: Two customers (C1, C2) simultaneously submit `POST /api/orders` for "Special Dish".
3.  **Pessimistic/Optimistic Locking**: The `OrderService` must handle this.
    - **Expected Outcome**: One order (e.g., C1's) is accepted. The other (C2's) fails.
    - **API Check**: C1 gets `201 Created`. C2 gets `409 Conflict` or `400 Bad Request` with an "Item out of stock" message.
    - **DB Check**: Only one order for "Special Dish" is created. The item's stock in `menu_items` is 0.

### **Scenario 10: Full Refund Process**
*Story: A customer's order is delivered incorrectly, and a manager issues a full refund.*

1.  **Order Delivered (F107)**: An order is marked as `DELIVERED`.
2.  **Customer Complaint**: The customer reports an issue.
3.  **Manager Issues Refund (F106)**: A manager (Jungwook) triggers a refund via a dedicated API (e.g., `POST /api/payments/{payment_id}/refund`).
    - **API Check**: Returns `200 OK` with refund details.
    - **DB Check**: The original `payments` entry is updated, or a new `refund` transaction is created linked to the original payment. The order status might be updated to `REFUNDED`.

---

## ✅ Test Assertion Summary

### Database State Assertions
- **User Creation**: `users` table contains the new user with correct role and status.
- **Order Lifecycle**: `orders.status` correctly transitions from `PENDING_PAYMENT` -> `PREPARING` -> `OUT_FOR_DELIVERY` -> `DELIVERED` or `CANCELLED`.
- **Payment Integrity**: `payments` table correctly logs `COMPLETED`, `FAILED`, and `REFUNDED` transactions.
- **Foreign Keys**: `order_items` links to `orders` and `menu_items`. `payments` links to `orders`. `deliveries` links to `orders`.
- **Reservation State**: `reservations.status` transitions from `PENDING_APPROVAL` -> `CONFIRMED` or `REJECTED`.

### API Response Assertions
- **Success Codes**: `200 OK`, `201 Created`, `204 No Content` for successful operations.
- **Error Codes**: `400 Bad Request` for validation errors, `401 Unauthorized` for login failures, `403 Forbidden` for role-based access violations, `404 Not Found` for invalid IDs, and `409 Conflict` for resource conflicts.
- **Data Consistency**: API response bodies (DTOs) accurately reflect the state of the database after an operation.
- **Security**: Endpoints that require authentication return `401` if no token is provided. Manager-only endpoints return `403` for customer roles.

