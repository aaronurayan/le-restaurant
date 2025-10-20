# 07 Overall End-to-End Test Case

**Document Purpose**: Comprehensive end-to-end test scenario covering all 10 features (F100-F109) for AI analysis and test automation.

**Last Updated**: 2025-10-20  
**Status**: Complete Test Story

---

## 🎯 Feature Map

| Feature | Name | Description | Owner | Type |
|---------|------|-------------|-------|------|
| F100 | User Registration | Customers create new account with email/password | Junayeed Halim | Customer |
| F101 | User Authentication | Registered customers log in to their account | Junayeed Halim | Customer |
| F102 | User Management (Manager) | Managers view, edit, delete customer accounts | Jungwook Van | Manager |
| F103 | Menu Display | View food items by category, search, filter | Mikhail Zhelnin | Customer |
| F104 | Menu Management (Manager) | Create, update, delete menu items & prices | Mikhail Zhelnin | Manager |
| F105 | Order Management | Create, submit orders with payment system | Damaq Zain | Customer |
| F106 | Payment Management | Handle customer payments, transaction processing | Jungwook Van | Manager |
| F107 | Delivery Management | Manage deliveries, assign personnel, track status | Aaron Urayan | Manager |
| F108 | Table Reservation | Book tables for specific date, time, guests | Damaq Zain | Customer |
| F109 | Reservation Management (Manager) | View, approve, deny, manage reservations | Aaron Urayan | Manager |

---

## 📋 Test Scenario Breakdown

### **Actor Profiles**

**Customer**: Alice (New User)
- Initial Status: Not registered
- Goal: Sign up, browse menu, place order, make payment, track delivery, book table

**Manager 1**: Mikhail (Menu Manager)
- Initial Status: Logged in
- Responsibility: Add/update menu items

**Manager 2**: Jungwook (User & Payment Manager)
- Initial Status: Logged in
- Responsibility: Verify users, monitor payments

**Manager 3**: Aaron (Delivery & Reservation Manager)
- Initial Status: Logged in
- Responsibility: Approve reservations, assign deliveries, update status

---

## 🔄 Complete Test Flow

### **PHASE 1: System Preparation (Pre-Test Setup)**

#### Step 1.1 - Manager Login & Menu Setup (F101, F104)
```
Actor: Mikhail (Menu Manager)
Precondition: Menu Management system is operational

Actions:
  1.1.1 | Manager logs in with valid credentials
         Expected: Dashboard loads, User role = 'MANAGER'
  
  1.1.2 | Navigate to Menu Management page
         Expected: Menu list displays existing items (Steak, Pasta, etc.)
  
  1.1.3 | Add new menu item "Truffle Pasta"
         Input: 
           - Name: "Truffle Pasta"
           - Category: "Mains"
           - Price: 45.99
           - Image: [Upload image file]
           - Availability: true
         Expected: Item saved, appears in menu list with status 'AVAILABLE'
  
  1.1.4 | Update existing item "Steak" price
         Input:
           - Old Price: 42.00
           - New Price: 48.50
         Expected: Price updated, saved to database
```

**Feature Coverage**: F101 (login), F104 (menu add/update)

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

#### Step 2.3 - Table Reservation (F108)
```
Actor: Alice (Logged in)
Precondition: User authenticated

Actions:
  2.3.1 | Navigate to "Table Reservation" from menu
         Expected: Reservation form loaded
  
  2.3.2 | Fill reservation form
         Input:
           - Date: 2025-10-21 (Tomorrow)
           - Time: 19:00 (7:00 PM)
           - Guests: 2
           - Special Requests: (Optional)
         Expected: 
           - Form validation passes
           - Date/time picker works
           - Availability calendar shows available slots
  
  2.3.3 | Click "Reserve Table"
         Expected:
           - Reservation created in database
           - Status: PENDING
           - Confirmation message: "Your reservation is pending manager approval"
           - Reservation ID assigned (e.g., RES-123456)
```

**Feature Coverage**: F108 (table reservation)

---

#### Step 2.4 - Menu Display & Search (F103)
```
Actor: Alice (Logged in)
Precondition: Menu items exist (added in Phase 1)

Actions:
  2.4.1 | Navigate to "Menu" page
         Expected: Menu page loads with categories:
           - Starters
           - Mains
           - Desserts
           - Beverages
  
  2.4.2 | Filter by Category: "Mains"
         Expected: 
           - Only Mains category items displayed
           - Updated "Steak" price (48.50) shown
           - New "Truffle Pasta" (45.99) visible with image
  
  2.4.3 | Search for "Truffle"
         Expected:
           - Search returns "Truffle Pasta" only
           - Item details, price, image displayed
  
  2.4.4 | Verify item availability
         Expected: "AVAILABLE" badge shown, Add to Cart button enabled
```

**Feature Coverage**: F103 (menu display, search, filter)

---

#### Step 2.5 - Order Creation & Management (F105)
```
Actor: Alice (Logged in)
Precondition: Menu items available, Cart empty

Actions:
  2.5.1 | Add "Truffle Pasta" to cart
         Input: Quantity: 1
         Expected:
           - Item added to cart
           - Cart icon shows "1"
           - Item persisted in session/localStorage
  
  2.5.2 | Add "Coke" to cart
         Input: Quantity: 2
         Expected:
           - Item added
           - Cart count: "3" (1 Pasta + 2 Cokes)
  
  2.5.3 | Navigate to Cart view
         Expected:
           - Cart shows both items with prices
           - Subtotal calculated: (45.99 × 1) + (2.50 × 2) = 50.99
           - Estimated tax, delivery fee shown
  
  2.5.4 | Proceed to Checkout
         Expected: Checkout form displayed with fields:
           - Delivery Address
           - Phone Number
           - Special Instructions
           - Order Type: Delivery/Dine-in (select "Delivery")
  
  2.5.5 | Fill checkout form
         Input:
           - Address: "123 Main St, City, ZIP"
           - Phone: "+1-555-0100"
           - Instructions: "No onions, please"
         Expected: Form validation passes
  
  2.5.6 | Click "Place Order"
         Expected:
           - Order created in database (Status: PENDING)
           - Order ID: ORD-789456
           - Items linked to order
           - Redirected to Payment page
```

**Feature Coverage**: F105 (order management)

---

#### Step 2.6 - Payment Processing (F106)
```
Actor: Alice
Precondition: Order created (ORD-789456), total = 59.99 (incl. tax/delivery)

Actions:
  2.6.1 | Payment form displayed
         Expected:
           - Order summary: Items, subtotal, tax, delivery fee, total
           - Payment method options (Credit Card, PayPal, etc.)
           - Card input fields: Name, Number, Expiry, CVV
  
  2.6.2 | Enter payment details
         Input:
           - Card Name: "Alice Johnson"
           - Card Number: "4532-1111-2222-3333"
           - Expiry: "12/25"
           - CVV: "123"
         Expected: Form validation passes, no errors
  
  2.6.3 | Click "Pay Now"
         Expected:
           - Payment gateway processes transaction
           - HTTP 200: Payment successful
           - Payment record created (Status: COMPLETED)
           - Transaction ID: TXN-555888
           - Order status updated: PENDING → CONFIRMED
           - Confirmation page displayed with:
             * Order ID: ORD-789456
             * Payment status: COMPLETED
             * Estimated delivery time: 30-45 minutes
```

**Feature Coverage**: F106 (payment management)

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
Actor: Jungwook
Precondition: Alice's payment completed (TXN-555888)

Actions:
  3.2.1 | Navigate to "Payment Management" dashboard
         Expected: Payment list displays recent transactions
  
  3.2.2 | Filter by Order ID: "ORD-789456"
         Expected:
           - Transaction TXN-555888 found
           - Details shown:
             * Customer: Alice
             * Order ID: ORD-789456
             * Amount: $59.99
             * Status: COMPLETED
             * Timestamp: 2025-10-20 14:30:00 UTC
             * Payment Method: Credit Card (ending 3333)
  
  3.2.3 | Verify transaction details
         Expected: All payment fields correct, no discrepancies
```

**Feature Coverage**: F106 (payment management, monitoring)

---

#### Step 3.3 - Reservation Approval (F109)
```
Actor: Aaron (Reservation Manager)
Precondition: Alice's reservation created (RES-123456, Status: PENDING)

Actions:
  3.3.1 | Manager logs in
         Expected: Manager dashboard loaded
  
  3.3.2 | Navigate to "Reservation Management"
         Expected: Reservation list shows pending requests
  
  3.3.3 | Find Alice's reservation (RES-123456)
         Expected:
           - Reservation visible:
             * Name: Alice
             * Date: 2025-10-21
             * Time: 19:00
             * Guests: 2
             * Status: PENDING
  
  3.3.4 | Click "Approve" button
         Expected:
           - Reservation status updated: PENDING → APPROVED
           - Database transaction committed
           - Notification queued to Alice (email/SMS)
```

**Feature Coverage**: F109 (reservation management, approval)

---

#### Step 3.4 - Delivery Assignment & Status Updates (F107)
```
Actor: Aaron
Precondition: Order confirmed (ORD-789456), Payment completed

Actions:
  3.4.1 | Navigate to "Delivery Management"
         Expected: Active orders awaiting assignment displayed
  
  3.4.2 | Find order ORD-789456
         Expected:
           - Order details visible:
             * Customer: Alice
             * Items: Truffle Pasta (1), Coke (2)
             * Delivery Address: "123 Main St, City, ZIP"
             * Status: CONFIRMED
             * Created: 2025-10-20 14:30:00
  
  3.4.3 | Assign delivery driver
         Input: Select Driver: "John Smith"
         Expected:
           - Driver assigned
           - Status updated: CONFIRMED → PREPARING
           - Notification sent to driver: "New delivery assigned"
  
  3.4.4 | Update status: PREPARING
         Expected:
           - Order status: PREPARING
           - Timestamp logged: 2025-10-20 14:35:00
           - Alice receives notification: "Your order is being prepared"
  
  3.4.5 | Update status: OUT_FOR_DELIVERY
         Expected:
           - Order status: OUT_FOR_DELIVERY
           - Driver location tracking enabled
           - Alice receives notification: "Order out for delivery"
           - Real-time tracking link sent to customer
  
  3.4.6 | Update status: DELIVERED
         Expected:
           - Order status: DELIVERED
           - Estimated delivery: Completed
           - Timestamp: 2025-10-20 15:10:00
           - Alice receives notification: "Order delivered"
           - Order marked as complete
```

**Feature Coverage**: F107 (delivery management, status tracking)

---

## ✅ Test Assertion Checklist

### **Database Assertions**

```sql
-- Verify User Created
SELECT * FROM users WHERE email = 'alice@example.com';
-- Expected: 1 row, status = 'ACTIVE', role = 'CUSTOMER'

-- Verify Order Created
SELECT * FROM orders WHERE id = 'ORD-789456';
-- Expected: 1 row, status = 'DELIVERED', customer_id = Alice's ID

-- Verify Payment Created
SELECT * FROM payments WHERE transaction_id = 'TXN-555888';
-- Expected: 1 row, status = 'COMPLETED', amount = 59.99

-- Verify Order Items
SELECT * FROM order_items WHERE order_id = 'ORD-789456';
-- Expected: 2 rows (Truffle Pasta qty=1, Coke qty=2)

-- Verify Reservation Created
SELECT * FROM reservations WHERE id = 'RES-123456';
-- Expected: 1 row, status = 'APPROVED', date = '2025-10-21', time = '19:00'

-- Verify Menu Update
SELECT * FROM menu_items WHERE name = 'Truffle Pasta';
-- Expected: 1 row, price = 45.99, availability = true, category = 'MAINS'

SELECT * FROM menu_items WHERE name = 'Steak';
-- Expected: 1 row, price = 48.50 (updated)
```

### **API Response Assertions**

```
POST /api/auth/register
Response: HTTP 201
Body: { userId: '...', email: 'alice@example.com', status: 'ACTIVE' }

POST /api/auth/login
Response: HTTP 200
Body: { token: 'jwt_token...', user: { id: '...', email: 'alice@example.com' } }

GET /api/menu?category=MAINS
Response: HTTP 200
Body: { items: [ { name: 'Truffle Pasta', price: 45.99 }, ... ] }

POST /api/orders
Response: HTTP 201
Body: { orderId: 'ORD-789456', status: 'PENDING', total: 59.99 }

POST /api/payments
Response: HTTP 200
Body: { transactionId: 'TXN-555888', status: 'COMPLETED' }

PUT /api/reservations/RES-123456
Response: HTTP 200
Body: { reservationId: 'RES-123456', status: 'APPROVED' }

PUT /api/deliveries/ORD-789456/status
Response: HTTP 200
Body: { orderId: 'ORD-789456', status: 'DELIVERED' }
```

---

## 🐛 Key Edge Cases & Error Scenarios

| Scenario | Feature | Expected Behavior |
|----------|---------|-------------------|
| Invalid email format during registration | F100 | Validation error, form resubmit |
| Password too weak | F100 | Validation error, strength indicator |
| Email already exists | F100 | HTTP 409 Conflict, "Email registered" message |
| Wrong password on login | F101 | HTTP 401 Unauthorized, "Invalid credentials" |
| Out-of-stock menu item | F103/F105 | Item disabled/grayed out, unavailable for cart |
| Invalid card number | F106 | Payment gateway rejection, error message |
| Reservation date in past | F108 | Validation error, calendar disables past dates |
| Duplicate order within seconds | F105 | Idempotency check, prevent double submission |
| Payment timeout | F106 | Retry mechanism, graceful error handling |
| Delivery status not updated | F107 | Manager able to manually update status |

---

## 📊 Test Coverage Summary

| Feature | Test Steps | Status |
|---------|-----------|--------|
| F100 - User Registration | 4 | ✅ Covered |
| F101 - User Authentication | 2 | ✅ Covered |
| F102 - User Management | 5 | ✅ Covered |
| F103 - Menu Display | 4 | ✅ Covered |
| F104 - Menu Management | 4 | ✅ Covered |
| F105 - Order Management | 6 | ✅ Covered |
| F106 - Payment Management | 3 + 3 | ✅ Covered |
| F107 - Delivery Management | 6 | ✅ Covered |
| F108 - Table Reservation | 3 | ✅ Covered |
| F109 - Reservation Management | 3 | ✅ Covered |

**Total Test Steps**: 43+ (excluding edge cases)  
**Estimated Duration**: 30-45 minutes (manual), 5-10 minutes (automated)  
**Coverage**: 100% of features F100-F109

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

