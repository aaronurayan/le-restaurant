# 07 Overall End-to-End Test Case

**Document Purpose**: Comprehensive end-to-end test scenario for implemented features in `main` branch for AI analysis and test automation.

**Last Updated**: 2025-10-21  
**Status**: Updated for Current Implementation  
**Branch**: main  
**Excluded Features**: F103, F104 (Menu features - in development by Mikhail Zhelnin)

---

## 🎯 Feature Map (Testing Scope)

| Feature | Name | Description | Owner | Type | Status |
|---------|------|-------------|-------|------|--------|
| F100 | User Registration | Customers create new account with email/password | Junayeed Halim | Customer | ✅ Implemented |
| F101 | User Authentication | Registered customers log in to their account | Junayeed Halim | Customer | ✅ Implemented |
| F102 | User Management (Manager) | Managers view, edit, delete customer accounts | Jungwook Van | Manager | ✅ Implemented |
| F103 | Menu Display | View food items by category, search, filter | Mikhail Zhelnin | Customer | 🚧 **EXCLUDED - In Development** |
| F104 | Menu Management (Manager) | Create, update, delete menu items & prices | Mikhail Zhelnin | Manager | 🚧 **EXCLUDED - In Development** |
| F105 | Order Management | Create, submit orders with payment system | Damaq Zain | Customer | ✅ Implemented |
| F106 | Payment Management | Handle customer payments, transaction processing | Jungwook Van | Manager | ✅ Implemented |
| F107 | Delivery Management | Manage deliveries, assign personnel, track status | Aaron Urayan | Manager | ✅ Implemented |
| F108 | Table Reservation | Book tables for specific date, time, guests | Damaq Zain | Customer | ✅ Implemented |
| F109 | Reservation Management (Manager) | View, approve, deny, manage reservations | Aaron Urayan | Manager | ✅ Implemented |

**Test Coverage**: 8/10 features (80%) - Menu features excluded until branch merge

---

## 📋 Test Scenario Breakdown

### **Actor Profiles**

**Customer**: Alice (New User)
- Initial Status: Not registered
- Goal: Sign up, place order (with hardcoded menu items), make payment, track delivery, book table
- **Note**: Menu browsing functionality excluded until F103/F104 merge

**Manager 1**: Jungwook (User & Payment Manager)
- Initial Status: Logged in
- Responsibility: Verify users, monitor payments, manage user accounts

**Manager 2**: Aaron (Delivery & Reservation Manager)
- Initial Status: Logged in
- Responsibility: Approve reservations, assign deliveries, update status

**Test Data Prerequisites**:
- Hardcoded menu items available for order testing (bypassing F103/F104)
- Pre-configured delivery addresses
- Available table inventory for reservation testing

---

## 🔄 Complete Test Flow (Revised for Current Implementation)

### **PHASE 1: Database Seeding & Test Data Preparation**

#### Step 1.1 - Test Data Seeding (Backend Setup)
```
Actor: System/Test Suite
Precondition: Backend running, H2 database initialized

Actions:
  1.1.1 | Seed hardcoded menu items (bypassing F103/F104)
         SQL/Data:
           INSERT INTO menu_items VALUES 
             (1, 'Grilled Chicken', 24.99, 'MAIN', true, 'chicken.jpg'),
             (2, 'Caesar Salad', 12.99, 'STARTER', true, 'salad.jpg'),
             (3, 'Chocolate Cake', 8.99, 'DESSERT', true, 'cake.jpg'),
             (4, 'Coca Cola', 3.50, 'BEVERAGE', true, 'coke.jpg');
         Expected: 4 menu items available for order testing
  
  1.1.2 | Seed manager accounts
         Data:
           - Email: jungwook@lerestaurant.com, Role: MANAGER (User & Payment Mgmt)
           - Email: aaron@lerestaurant.com, Role: MANAGER (Delivery & Reservation Mgmt)
         Expected: 2 manager accounts ready for authentication
  
  1.1.3 | Seed available tables for reservation
         Data:
           - Table IDs: T1, T2, T3, T4
           - Capacity: 2, 4, 6, 8 guests
           - Availability: ALL AVAILABLE
         Expected: Table inventory ready for F108 reservation testing
  
  1.1.4 | Verify backend health
         Request: GET http://localhost:8080/actuator/health
         Expected: HTTP 200, status: "UP"
```

**Feature Coverage**: Database setup (no feature-specific logic)
**Note**: Menu items are hardcoded for testing until F103/F104 integration

---

### **PHASE 2: Customer Onboarding & Journey**

#### Step 2.1 - User Registration (F100)
```
Actor: Alice (New Customer)
Precondition: Not registered in system

Actions:
  2.1.1 | Alice visits website homepage
         Expected: Registration link visible, website loads
  
  2.1.2 | Click "Sign Up" button
         Expected: Registration form displayed with fields:
           - Email
           - Password
           - Confirm Password
  
  2.1.3 | Fill registration form
         Input:
           - Email: alice@example.com
           - Password: SecurePass123!
           - Confirm: SecurePass123!
         Expected: Form validation passes
  
  2.1.4 | Click "Create Account" button
         Expected: 
           - Account created (HTTP 201)
           - Alice's record inserted into 'users' table
           - Status: ACTIVE
           - Role: CUSTOMER
           - Email verified or pending
```

**Feature Coverage**: F100 (user registration)

---

#### Step 2.2 - User Authentication & Login (F101)
```
Actor: Alice
Precondition: Account created in Step 2.1

Actions:
  2.2.1 | Alice on login page
         Expected: Login form visible (Email, Password fields)
  
  2.2.2 | Enter credentials
         Input:
           - Email: alice@example.com
           - Password: SecurePass123!
  
  2.2.3 | Click "Log In"
         Expected:
           - Session created
           - JWT token generated (if applicable)
           - Redirected to dashboard
           - Navigation bar shows "Hello, Alice"
```

**Feature Coverage**: F101 (authentication)

---

#### Step 2.6 - Reservation Booking (F108)
```
Actor: Alice
Precondition: Authenticated, order placed and paid

Actions:
  2.6.1 | Create reservation via CustomerReservationList
         Input (ReservationCreateRequestDto):
           - userId: Alice's user ID
           - partySize: 4
           - reservationDate: "2025-11-01"
           - reservationTime: "19:00:00"
           - specialRequests: "Window seat preferred, celebrating birthday"
         Expected: 
           - API POST /api/reservations returns HTTP 201
           - Reservation created with PENDING_APPROVAL status
  
  2.6.2 | Verify reservation created
         Request: GET /api/reservations/{reservationId}
         Expected:
           - Reservation ID: RES-123001
           - Status: PENDING_APPROVAL
           - Party size: 4 guests
           - Date: 2025-11-01
           - Time: 19:00
           - Special requests recorded
           - Customer: Alice (alice.johnson@gmail.com)
  
  2.6.3 | Verify reservation in customer list
         Request: GET /api/reservations/user/{userId}
         Expected:
           - Reservation RES-123001 visible in list
           - Status indicator: "Pending Approval"
           - Date/time displayed correctly
           - Edit/Cancel buttons available (for pending reservations)
```

**Feature Coverage**: F108 (reservation booking)
**Components Tested**: 
- Backend: ReservationController, ReservationService
- Frontend: CustomerReservationList, ReservationForm
- Business Logic: Reservation validation, status management

---

#### Step 2.4 - Order Creation & Management (F105) **[MODIFIED - No Menu UI]**
```
Actor: Alice (Logged in)
Precondition: Seeded menu items available (ID: 1-Chicken, 2-Salad, 3-Cake, 4-Coke)
Test Approach: Direct API call OR order form with hardcoded item selection

Actions:
  2.4.1 | Create order via Order Management Panel
         Input (OrderCreateRequestDto):
           - customerId: Alice's user ID
           - items: [
               { menuItemId: 1, quantity: 1, price: 24.99 },  // Grilled Chicken
               { menuItemId: 4, quantity: 2, price: 3.50 }    // Coca Cola x2
             ]
           - orderType: "DELIVERY"
           - totalAmount: 31.99 (24.99 + 3.50×2)
         Expected: API POST /api/orders returns HTTP 201
  
  2.4.2 | Verify order created
         Request: GET /api/orders/{orderId}
         Expected:
           - Order status: PENDING
           - Order ID: ORD-789456
           - Customer ID matches Alice
           - Items count: 2 distinct items, 3 total quantity
           - Total amount: $31.99
  
  2.4.3 | Add delivery address
         Input (DeliveryAddressCreateRequestDto):
           - orderId: ORD-789456
           - street: "123 Main St"
           - city: "Sydney"
           - state: "NSW"
           - zipCode: "2000"
           - phone: "+61-455-123-456"
           - specialInstructions: "Leave at front door"
         Expected: 
           - API POST /api/delivery-addresses returns HTTP 201
           - Address linked to order
  
  2.4.4 | Proceed to payment
         Expected:
           - Order status remains PENDING
           - Payment amount: $31.99
           - Payment page loads with order summary
```

**Feature Coverage**: F105 (order management)
**Testing Method**: Backend API testing + Frontend OrderManagementPanel component
**Note**: Bypasses menu browsing UI (F103/F104) - uses hardcoded menu item IDs

---

#### Step 2.5 - Payment Processing (F106)
```
Actor: Alice
Precondition: Order created (ORD-789456), total = $31.99

Actions:
  2.5.1 | Create payment via PaymentManagementPanel
         Input (PaymentCreateRequestDto):
           - orderId: "ORD-789456"
           - amount: 31.99
           - paymentMethod: "CREDIT_CARD"
           - cardDetails: {
               cardholderName: "Alice Johnson",
               cardNumber: "4532111122223333",
               expiryDate: "12/25",
               cvv: "123"
             }
         Expected: 
           - API POST /api/payments returns HTTP 201
           - Payment processing initiated
  
  2.5.2 | Verify payment success
         Request: GET /api/payments/{paymentId}
         Expected:
           - Payment status: COMPLETED
           - Transaction ID: TXN-555888
           - Amount: $31.99
           - Timestamp recorded
           - Payment method: CREDIT_CARD
  
  2.5.3 | Verify order status updated
         Request: GET /api/orders/ORD-789456
         Expected:
           - Order status changed: PENDING → CONFIRMED
           - Payment ID linked to order
           - Confirmation timestamp recorded
  
  2.5.4 | Payment confirmation displayed
         Expected (Frontend):
           - Success message: "Payment successful!"
           - Order ID: ORD-789456
           - Transaction ID: TXN-555888
           - Estimated delivery: "30-45 minutes"
           - Track order button visible
```

**Feature Coverage**: F106 (payment management)
**Components Tested**: 
- Backend: PaymentController, PaymentService
- Frontend: PaymentManagementPanel, PaymentVerification
- Integration: Order status update after payment

---

### **PHASE 3: Manager Operations & Order Processing**

#### Step 3.1 - User Management Verification (F102)
```
Actor: Jungwook (User & Payment Manager)
Precondition: Alice registered and logged in

Actions:
  3.1.1 | Manager logs in
         Expected: Manager dashboard loaded
  
  3.1.2 | Navigate to "User Management"
         Expected: User list displays all customers
  
  3.1.3 | Search for "alice@example.com"
         Expected:
           - Alice's record found in list
           - User details visible:
             * Name: Alice
             * Email: alice@example.com
             * Status: ACTIVE
             * Role: CUSTOMER
             * Registration Date: 2025-10-20
  
  3.1.4 | Click on Alice's record to view details
         Expected:
           - Profile page shows:
             * Account info
             * Order history (1 order: ORD-789456)
             * Registration date
             * Last login
  
  3.1.5 | Verify no edit/delete actions needed
         Expected: Confirm Alice's account is valid
```

**Feature Coverage**: F102 (user management)

---

#### Step 3.2 - Payment Verification (F106)
```
Actor: Jungwook (User & Payment Manager)
Precondition: Alice's payment completed (TXN-555888), order ORD-789456 confirmed

Actions:
  3.2.1 | Access payment records via API
         Request: GET /api/payments
         Expected: 
           - HTTP 200 with list of all payments
           - Transaction TXN-555888 visible in list
  
  3.2.2 | Retrieve specific payment details
         Request: GET /api/payments/{paymentId}
         Expected:
           - Payment ID: PAY-555888
           - Order ID: ORD-789456
           - Customer: Alice Johnson (USR-123456)
           - Amount: $31.99
           - Status: COMPLETED
           - Payment Method: CREDIT_CARD
           - Card Last 4 Digits: 3333
           - Transaction Date: 2025-10-20T14:45:00Z
           - Gateway Response: "SUCCESS"
  
  3.2.3 | Filter payments by order
         Request: GET /api/payments?orderId=ORD-789456
         Expected:
           - Only payment TXN-555888 returned
           - Matches order total ($31.99)
  
  3.2.4 | Verify payment-order linkage
         Request: GET /api/orders/ORD-789456
         Expected:
           - Order status: CONFIRMED
           - Payment ID: PAY-555888 linked
           - No payment discrepancies detected
```

**Feature Coverage**: F106 (payment management, monitoring)
**Components Tested**: 
- Backend: PaymentController, PaymentService
- Frontend: PaymentManagementPanel, PaymentVerification
- Data Integrity: Payment-Order relationship validation

---

#### Step 3.3 - Reservation Approval (F109)
```
Actor: Aaron (Delivery & Reservation Manager)
Precondition: Alice's reservation created (RES-123001, Status: PENDING_APPROVAL)

Actions:
  3.3.1 | Access pending reservations
         Request: GET /api/reservations?status=PENDING_APPROVAL
         Expected:
           - HTTP 200 with list of pending reservations
           - Reservation RES-123001 visible
  
  3.3.2 | Retrieve reservation details
         Request: GET /api/reservations/RES-123001
         Expected:
           - Reservation ID: RES-123001
           - Customer: Alice Johnson (USR-123456)
           - Party Size: 4 guests
           - Date: 2025-11-01
           - Time: 19:00
           - Special Requests: "Window seat preferred, celebrating birthday"
           - Status: PENDING_APPROVAL
           - Created At: 2025-10-20T15:00:00Z
  
  3.3.3 | Check table availability
         Action: Verify sufficient capacity
         Expected:
           - Available tables: T3 (capacity 6) or T4 (capacity 8)
           - Time slot 19:00 not double-booked
  
  3.3.4 | Approve reservation
         Request: PUT /api/reservations/RES-123001/approve
         Input (ReservationApprovalDto):
           - status: "CONFIRMED"
           - assignedTableId: "T3"
           - managerNotes: "Window seat assigned, birthday setup arranged"
         Expected:
           - HTTP 200: Reservation approved
           - Status: PENDING_APPROVAL → CONFIRMED
           - Table T3 assigned
           - Notification sent to Alice (future enhancement)
  
  3.3.5 | Verify approval persisted
         Request: GET /api/reservations/RES-123001
         Expected:
           - Status: CONFIRMED
           - Assigned Table: T3
           - Manager Notes recorded
           - Approval Timestamp: 2025-10-20T15:10:00Z
```

**Feature Coverage**: F109 (reservation management, approval/rejection)
**Components Tested**: 
- Backend: ReservationController, ReservationService
- Frontend: ReservationApprovalPanel, ReservationDetails
- Business Logic: Table availability check, status transitions

---

#### Step 3.4 - Delivery Assignment & Status Updates (F107)
```
Actor: Aaron (Delivery & Reservation Manager)
Precondition: Order confirmed (ORD-789456), Payment completed (PAY-555888)

Actions:
  3.4.1 | Access active deliveries
         Request: GET /api/deliveries?status=PENDING
         Expected:
           - HTTP 200 with list of orders awaiting delivery assignment
           - Order ORD-789456 visible
  
  3.4.2 | Retrieve delivery details
         Request: GET /api/deliveries/order/ORD-789456
         Expected:
           - Order ID: ORD-789456
           - Customer: Alice Johnson (USR-123456)
           - Items: Grilled Chicken (1), Coca Cola (2)
           - Total: $31.99
           - Delivery Address:
             * Street: 123 Main St
             * City: Sydney
             * State: NSW
             * Zip: 2000
             * Phone: +61-455-123-456
             * Special Instructions: "Leave at front door"
           - Status: PENDING
           - Order Created: 2025-10-20T14:45:00Z
  
  3.4.3 | Assign delivery driver
         Request: PUT /api/deliveries/{deliveryId}/assign
         Input (DeliveryAssignmentDto):
           - driverId: "DRV-001"
           - driverName: "John Smith"
           - estimatedDeliveryTime: "2025-10-20T15:30:00Z"
         Expected:
           - HTTP 200: Driver assigned
           - Delivery status: PENDING → ASSIGNED
           - Driver assignment timestamp recorded
  
  3.4.4 | Update status to PREPARING
         Request: PUT /api/deliveries/{deliveryId}/status
         Input: status: "PREPARING"
         Expected:
           - HTTP 200: Status updated
           - Delivery status: ASSIGNED → PREPARING
           - Order status: CONFIRMED → PREPARING
           - Timestamp: 2025-10-20T14:50:00Z
  
  3.4.5 | Update status to OUT_FOR_DELIVERY
         Request: PUT /api/deliveries/{deliveryId}/status
         Input: status: "OUT_FOR_DELIVERY"
         Expected:
           - HTTP 200: Status updated
           - Delivery status: PREPARING → OUT_FOR_DELIVERY
           - Order status: PREPARING → OUT_FOR_DELIVERY
           - Timestamp: 2025-10-20T15:00:00Z
           - Estimated arrival: 15:30:00
  
  3.4.6 | Update status to DELIVERED
         Request: PUT /api/deliveries/{deliveryId}/status
         Input: 
           - status: "DELIVERED"
           - deliveredAt: "2025-10-20T15:25:00Z"
           - deliveryNotes: "Delivered successfully, left at front door as requested"
         Expected:
           - HTTP 200: Status updated
           - Delivery status: OUT_FOR_DELIVERY → DELIVERED
           - Order status: OUT_FOR_DELIVERY → DELIVERED
           - Actual delivery time: 15:25:00 (5 min early)
           - Delivery marked complete
  
  3.4.7 | Verify final delivery state
         Request: GET /api/deliveries/{deliveryId}
         Expected:
           - Status: DELIVERED
           - Driver: John Smith (DRV-001)
           - Delivered At: 2025-10-20T15:25:00Z
           - All timestamps recorded
           - Delivery notes saved
```

**Feature Coverage**: F107 (delivery management, status tracking)
**Components Tested**: 
- Backend: DeliveryController, DeliveryService, DeliveryRepository
- Frontend: DeliveryManagementPanel, DeliveryStatusTracker
- Status Workflow: PENDING → ASSIGNED → PREPARING → OUT_FOR_DELIVERY → DELIVERED

---

## ✅ Test Assertion Checklist

### **Database Assertions**

```sql
-- Verify Seeded Menu Items Exist
SELECT * FROM menu_items WHERE id IN (1, 2, 3, 4);
-- Expected: 4 rows (Chicken $24.99, Salad $12.99, Cake $8.99, Coke $3.50)

-- Verify User Created
SELECT * FROM users WHERE email = 'alice.johnson@gmail.com';
-- Expected: 1 row, status = 'ACTIVE', role = 'CUSTOMER', first_name = 'Alice', last_name = 'Johnson'

-- Verify Order Created
SELECT * FROM orders WHERE id = 'ORD-789456';
-- Expected: 1 row, status = 'DELIVERED', customer_id = USR-123456, total_amount = 31.99

-- Verify Payment Created
SELECT * FROM payments WHERE transaction_id = 'TXN-555888';
-- Expected: 1 row, status = 'COMPLETED', amount = 31.99, payment_method = 'CREDIT_CARD'

-- Verify Order Items
SELECT oi.*, mi.name, mi.price 
FROM order_items oi 
JOIN menu_items mi ON oi.menu_item_id = mi.id 
WHERE oi.order_id = 'ORD-789456';
-- Expected: 2 rows
--   Row 1: menu_item_id = 1 (Grilled Chicken), quantity = 1, price = 24.99
--   Row 2: menu_item_id = 4 (Coca Cola), quantity = 2, price = 3.50

-- Verify Delivery Created and Completed
SELECT * FROM deliveries WHERE order_id = 'ORD-789456';
-- Expected: 1 row, status = 'DELIVERED', driver_id = 'DRV-001', driver_name = 'John Smith'

-- Verify Reservation Created and Approved
SELECT * FROM reservations WHERE id = 'RES-123001';
-- Expected: 1 row, status = 'CONFIRMED', party_size = 4, date = '2025-11-01', time = '19:00', assigned_table = 'T3'

-- Verify User Management Actions
SELECT * FROM users WHERE status = 'ACTIVE';
-- Expected: At least 3 rows (Alice + 2 managers: Jungwook, Aaron)
```

### **API Response Assertions**

```
POST /api/users
Response: HTTP 201
Body: {
  "id": "USR-123456",
  "email": "alice.johnson@gmail.com",
  "firstName": "Alice",
  "lastName": "Johnson",
  "role": "CUSTOMER",
  "status": "ACTIVE",
  "createdAt": "2025-10-20T14:30:00Z"
}

POST /api/auth/login
Response: HTTP 200
Body: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USR-123456",
    "email": "alice.johnson@gmail.com",
    "role": "CUSTOMER"
  }
}

POST /api/orders
Response: HTTP 201
Body: {
  "orderId": "ORD-789456",
  "customerId": "USR-123456",
  "status": "PENDING",
  "totalAmount": 31.99,
  "items": [
    { "menuItemId": 1, "quantity": 1, "price": 24.99 },
    { "menuItemId": 4, "quantity": 2, "price": 3.50 }
  ],
  "createdAt": "2025-10-20T14:45:00Z"
}

POST /api/payments
Response: HTTP 201
Body: {
  "paymentId": "PAY-555888",
  "orderId": "ORD-789456",
  "transactionId": "TXN-555888",
  "amount": 31.99,
  "status": "COMPLETED",
  "paymentMethod": "CREDIT_CARD",
  "createdAt": "2025-10-20T14:50:00Z"
}

PUT /api/reservations/RES-123001/approve
Response: HTTP 200
Body: {
  "reservationId": "RES-123001",
  "status": "CONFIRMED",
  "assignedTable": "T3",
  "approvedBy": "aaron@lerestaurant.com",
  "approvedAt": "2025-10-20T15:10:00Z"
}

PUT /api/deliveries/{deliveryId}/status
Response: HTTP 200
Body: {
  "deliveryId": "DEL-789456",
  "orderId": "ORD-789456",
  "status": "DELIVERED",
  "driverId": "DRV-001",
  "driverName": "John Smith",
  "deliveredAt": "2025-10-20T15:25:00Z"
}

GET /api/users/{userId}
Response: HTTP 200
Body: {
  "id": "USR-123456",
  "email": "alice.johnson@gmail.com",
  "firstName": "Alice",
  "lastName": "Johnson",
  "role": "CUSTOMER",
  "status": "ACTIVE"
}

Note: Menu endpoints (GET /api/menu/*) are NOT tested in this flow as F103/F104 are excluded.
Menu item data is seeded directly in the database for testing Order functionality.
```

---

## 🐛 Key Edge Cases & Error Scenarios

| Scenario | Feature | Expected Behavior |
|----------|---------|-------------------|
| Invalid email format during registration | F100 | Validation error, form resubmit, "@Email" annotation validates |
| Password too weak | F100 | Validation error, strength indicator, min 8 chars required |
| Email already exists | F100 | HTTP 409 Conflict, "Email already registered" message |
| Wrong password on login | F101 | HTTP 401 Unauthorized, "Invalid credentials" error |
| ~~Out-of-stock menu item~~ | ~~F103/F105~~ | **EXCLUDED - Menu features not tested** |
| Invalid menu item ID in order | F105 | HTTP 400 Bad Request, "Menu item not found" error |
| Order with zero quantity | F105 | Validation error, "Quantity must be >= 1" |
| Invalid card number | F106 | Payment gateway rejection, error message displayed |
| Payment amount mismatch | F106 | HTTP 400 Bad Request, "Amount does not match order total" |
| Reservation date in past | F108 | Validation error, calendar disables past dates |
| Reservation time slot conflict | F108 | HTTP 409 Conflict, "Table not available at selected time" |
| Duplicate order within seconds | F105 | Idempotency check, prevent double submission |
| Payment timeout | F106 | Retry mechanism, graceful error handling, rollback transaction |
| Delivery status not updated | F107 | Manager able to manually update status via API PUT |
| Suspended user login attempt | F102 | HTTP 403 Forbidden, "User account is suspended" |
| Manager tries to delete active order | F105 | HTTP 403 Forbidden, "Cannot delete confirmed orders" |

**Note**: Edge cases related to Menu features (F103/F104) are excluded from this test plan.

---

## 📊 Test Coverage Summary

| Feature | Test Steps | Status |
|---------|-----------|--------|
| F100 - User Registration | 4 | ✅ Covered |
| F101 - User Authentication | 2 | ✅ Covered |
| F102 - User Management | 6 | ✅ Covered |
| F103 - Menu Display | N/A | 🚧 **EXCLUDED - In Development** |
| F104 - Menu Management | N/A | 🚧 **EXCLUDED - In Development** |
| F105 - Order Management | 4 | ✅ Covered (with hardcoded menu items) |
| F106 - Payment Management | 4 + 4 | ✅ Covered |
| F107 - Delivery Management | 7 | ✅ Covered |
| F108 - Table Reservation | 3 | ✅ Covered |
| F109 - Reservation Management | 5 | ✅ Covered |

**Total Test Steps**: 35+ (excluding edge cases)  
**Estimated Duration**: 30-45 minutes (manual), 5-10 minutes (automated)  
**Coverage**: 80% (8 out of 10 features F100-F109)
**Excluded Features**: F103 (Menu Display), F104 (Menu Management) - being developed in separate branches

### Feature Status Breakdown:
- ✅ **Fully Tested** (8 features): F100, F101, F102, F105, F106, F107, F108, F109
- 🚧 **Excluded from Current Testing** (2 features): F103, F104
- **Testing Workaround**: Order Management (F105) tested using hardcoded menu item IDs seeded in database
- **Future Integration**: When F103/F104 merge, add menu browsing/management test steps and update coverage to 100%

---

## 🔗 Related Documents

- [01-project-overview.md](./01-project-overview.md) - Project context
- [02-system-architecture.md](./02-system-architecture.md) - System design
- [04-api-specification.md](./04-api-specification.md) - API endpoints
- [Actual-design-plan/use-cases/](../Actual-design-plan/use-cases/) - Detailed use cases per feature

---

## 📝 Notes for AI/Automation

- **Step Naming Convention**: `[Phase].[Section].[Step]` (e.g., 2.6.3)
- **Clear Inputs/Outputs**: Each action has explicit inputs and expected outputs for easy assertion
- **Database-Level Verification**: SQL assertions provided for data integrity checks
- **Modular Structure**: Each feature section can be tested independently or sequentially
- **Status Tracking**: Order/reservation/delivery statuses follow finite state machines (see state transitions above)
- **Idempotency**: Payment and order creation include duplicate prevention mechanisms

