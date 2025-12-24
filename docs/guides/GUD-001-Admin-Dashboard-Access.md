# GUD-001 Admin Dashboard Access Guide

| Document Information | |
|---------------------|------------------------|
| **Document ID** | GUD-001 |
| **Version** | 2.0 |
| **Status** | Approved |
| **Last Updated** | 2025-12-24 |
| **Author** | Le Restaurant Development Team |
| **Category** | User Guide |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Access Requirements](#2-access-requirements)
3. [Navigation Methods](#3-navigation-methods)
4. [Dashboard Features](#4-dashboard-features)
5. [Test Accounts](#5-test-accounts)
6. [Troubleshooting](#6-troubleshooting)
7. [Related Documents](#7-related-documents)

---

## 1. Overview

### 1.1 Purpose

This guide provides instructions for accessing the Admin Dashboard in the Le Restaurant application. The dashboard serves as the central management hub for restaurant operations.

### 1.2 Dashboard URL

| Environment | URL |
|-------------|-----|
| Local Development | `http://localhost:5173/admin/dashboard` |
| Production | `https://le-restaurant.azurewebsites.net/admin/dashboard` |

---

## 2. Access Requirements

### 2.1 Authorized Roles

The following user roles have access to the Admin Dashboard:

| Role | Access Level | Description |
|------|--------------|-------------|
| ADMIN | Full | Complete system administration |
| MANAGER | Full | Restaurant management operations |

### 2.2 Unauthorized Access Handling

| Scenario | System Behavior |
|----------|-----------------|
| Not logged in | Redirect to login page |
| CUSTOMER role | Redirect to home page |
| STAFF role | Redirect to staff portal |

---

## 3. Navigation Methods

### 3.1 Desktop Navigation (Header Menu)

**Location:** Top navigation bar

**Steps:**
1. Log in with an authorized account
2. Locate the navigation menu in the header
3. Click the **Dashboard** link

**Visual Reference:**
```
┌────────────────────────────────────────────────────────┐
│  [Logo]  Menu  About  Contact  [Dashboard]  [User]    │
└────────────────────────────────────────────────────────┘
                                     ↑
                              Click here
```

### 3.2 User Dropdown Menu

**Location:** Top right corner of header

**Steps:**
1. Click the user icon in the top right corner
2. Select **Admin Dashboard** from the dropdown menu

**Visual Reference:**
```
                                    [User Icon] ← Click
                                         │
                                         ▼
                               ┌─────────────────────┐
                               │ Admin Dashboard     │ ← Select
                               │ Menu Management     │
                               │ User Management     │
                               │ Logout              │
                               └─────────────────────┘
```

### 3.3 Mobile Navigation

**Location:** Hamburger menu (mobile devices)

**Steps:**
1. Tap the hamburger menu icon (☰) in the top left
2. Tap **Admin Dashboard** in the sidebar menu

**Visual Reference:**
```
┌──────────────────┐
│ [☰] Le Restaurant│  ← Tap menu icon
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ Admin Dashboard  │  ← Tap
│ Menu Management  │
│ Reservations     │
│ ...              │
└──────────────────┘
```

### 3.4 Direct URL Access

Type the dashboard URL directly in the browser address bar:

```
http://localhost:5173/admin/dashboard
```

### 3.5 Navigation from Admin Pages

Click the **Back to Dashboard** button available on:

| Page | URL |
|------|-----|
| Menu Management | `/admin/menu` |
| Reservation Management | `/admin/reservations` |
| User Management | `/admin/users` |
| Delivery Management | `/delivery` |
| Payment Management | `/payments` |

---

## 4. Dashboard Features

### 4.1 Statistics Overview

The dashboard displays real-time statistics:

| Statistic | Description |
|-----------|-------------|
| Total Revenue | Cumulative revenue from completed orders |
| Pending Orders | Number of orders awaiting processing |
| Active Reservations | Current confirmed reservations |
| Active Users | Number of registered active users |

### 4.2 Quick Actions

The dashboard provides quick access cards for:

| Action | Description | Target URL |
|--------|-------------|------------|
| Reservation Management | View and manage reservations | `/admin/reservations` |
| Order Management | View and process orders | `/orders` |
| Menu Management | Add and edit menu items | `/admin/menu` |
| User Management | Manage user accounts | `/admin/users` |
| Payment Management | View and process payments | `/payments` |
| Delivery Management | Track and manage deliveries | `/delivery` |

---

## 5. Test Accounts

### 5.1 Admin Account

| Field | Value |
|-------|-------|
| Email | `admin@lerestaurant.com` |
| Password | `password123` |
| Role | ADMIN |

### 5.2 Manager Account

| Field | Value |
|-------|-------|
| Email | `manager@lerestaurant.com` |
| Password | `password123` |
| Role | MANAGER |

> **Note:** These credentials are for testing purposes only. Do not use in production environments.

---

## 6. Troubleshooting

### 6.1 Common Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Dashboard not loading | Not logged in | Log in with authorized account |
| Redirected to home | Insufficient permissions | Use ADMIN or MANAGER account |
| Statistics not displaying | Backend API unavailable | Verify backend server is running |
| Blank page | JavaScript error | Check browser console for errors |

### 6.2 Verification Steps

To verify dashboard access is working correctly:

1. Clear browser cache and cookies
2. Log out of any existing session
3. Log in with a test account (see Section 5)
4. Navigate to the dashboard using any method in Section 3
5. Verify all statistics and quick action cards load

---

## 7. Related Documents

| Document ID | Title |
|-------------|-------|
| GUD-002 | [Routing Verification](./GUD-002-Routing-Verification.md) |
| GUD-003 | [UX Navigation Improvements](./GUD-003-UX-Navigation-Improvements.md) |
| API-001 | [REST API Specification](../DESIGN/API-001-REST-Specification.md) |

---

**End of Document**

