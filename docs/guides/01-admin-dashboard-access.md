# 01. Admin Dashboard Access Guide

## 📍 Route
**URL**: `/admin/dashboard`

## 🔐 Access Permissions
- **ADMIN** role
- **MANAGER** role

Other roles (CUSTOMER, unauthenticated users) cannot access this route and will be automatically redirected by `ProtectedRoute`.

## 🚀 Access Methods

### 1. Desktop Navigation (Header Top)
**Location**: Top menu bar in header
- When logged in as Admin/Manager, a **"Dashboard"** link appears in the header
- Click to navigate to `/admin/dashboard`

```
[Menu] [About] [Contact] [Dashboard] ← This section
```

### 2. User Dropdown Menu (Header Right)
**Location**: Click user icon in top right of header
- Click the user icon to open dropdown menu
- Click **"Admin Dashboard"** link

```
[User Icon] Click
  ↓
┌─────────────────────┐
│ Admin Dashboard     │ ← Click
│ Menu Management     │
│ User Management     │
│ ...                 │
└─────────────────────┘
```

### 3. Mobile Menu
**Location**: Click hamburger menu (☰) on mobile screens
- Click hamburger menu in top left on mobile
- Click **"Admin Dashboard"** link in sidebar

```
[☰] Click
  ↓
┌─────────────────┐
│ Admin Dashboard │ ← Click
│ Menu Management │
│ ...             │
└─────────────────┘
```

### 4. Direct URL Input
Type directly in browser address bar:
```
http://localhost:5173/admin/dashboard
```

### 5. Back Navigation from Other Admin Pages
Click "Back to Dashboard" button from:
- `/admin/menu` (Menu Management)
- `/admin/reservations` (Reservation Management)
- `/admin/users` (User Management)
- `/delivery` (Delivery Management)
- `/payments` (Payment Management)

## 🔄 Automatic Redirects

### Not Logged In
- Accessing `/admin/dashboard` → Redirects to login page

### Insufficient Permissions (CUSTOMER role)
- Accessing `/admin/dashboard` → Redirects to home (`/`) or customer dashboard

## 📝 Test Accounts

The following accounts can access the admin dashboard:

### Admin Account
- **Email**: `admin@lerestaurant.com`
- **Password**: `password123`
- **Role**: ADMIN

### Manager Account
- **Email**: `manager@lerestaurant.com`
- **Password**: `password123`
- **Role**: MANAGER

## 🎯 Dashboard Features

From the admin dashboard (`/admin/dashboard`), you can quickly access:

1. **Reservation Management** - Manage reservations
2. **Orders** - View orders
3. **Menu Management** - Manage menu items
4. **Users** - Manage user accounts
5. **Payments** - Manage payments
6. **Delivery Management** - Track deliveries

## 💡 Tips

- The dashboard displays **statistics**:
  - Total Revenue
  - Pending Orders
  - Active Reservations
  - Active Users

- Click any Quick Action card to navigate to the corresponding management page.

---

**See also**: [Routing Verification](./02-routing-verification.md) | [UX Navigation Improvements](./03-ux-navigation-improvements.md)

