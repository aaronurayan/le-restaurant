# REQ-001 Functional Requirements Specification

| Document Information | |
|---------------------|------------------------|
| **Document ID** | REQ-001 |
| **Version** | 3.0 |
| **Status** | Approved |
| **Last Updated** | 2026-05-25 |
| **Author** | Le Restaurant Development Team |
| **Reviewer** | Product Owner |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [User Classification](#2-user-classification)
3. [User Registration Requirements](#3-user-registration-requirements)
4. [User Authentication Requirements](#4-user-authentication-requirements)
5. [Menu Management Requirements](#5-menu-management-requirements)
6. [Order Management Requirements](#6-order-management-requirements)
7. [Payment Processing Requirements](#7-payment-processing-requirements)
8. [Reservation Management Requirements](#8-reservation-management-requirements)
9. [Release Strategy](#9-release-strategy)
10. [Document History](#10-document-history)

---

## 1. Introduction

### 1.1 Purpose

This document specifies the functional requirements for the Le Restaurant management system. It defines the system capabilities required to meet business objectives and user needs.

### 1.2 Scope

This specification covers all functional requirements organized by:
- User registration and management
- Authentication and authorization
- Menu browsing and management
- Order processing and tracking
- Payment handling
- Reservation management

### 1.3 Definitions and Abbreviations

| Term | Definition |
|------|------------|
| FR | Functional Requirement |
| NFR | Non-Functional Requirement |
| MVP | Minimum Viable Product |
| CRUD | Create, Read, Update, Delete |

### 1.4 Related Documents

| Document ID | Title |
|-------------|-------|
| REQ-002 | Non-Functional Requirements |
| DES-001 | Project Overview |
| API-001 | REST API Specification |

---

## 2. User Classification

### 2.1 User Types

| User Type | Code Range | Description | Access Level |
|-----------|------------|-------------|--------------|
| Manager | 1xx | System administrators and restaurant managers | Full system access |
| Customer | 2xx | Regular customers using restaurant services | Limited to customer functions |
| Staff | 3xx | Restaurant employees (waiters, kitchen staff) | Operational access |

### 2.2 Permission Matrix

| Capability | Manager | Staff | Customer |
|------------|---------|-------|----------|
| User management | ✓ | - | - |
| Menu management | ✓ | - | - |
| Order management | ✓ | ✓ | Own orders |
| Reservation approval | ✓ | ✓ | - |
| View menu | ✓ | ✓ | ✓ |
| Place orders | ✓ | ✓ | ✓ |

---

## 3. User Registration Requirements

### 3.1 Requirements Summary

| ID | Requirement | User Type | Priority | Status |
|----|-------------|-----------|----------|--------|
| FR-200 | Customer account registration | Customer | Medium | Done |
| FR-201 | Email verification | Customer | Medium | Deferred |
| FR-202 | Password strength indicator | Customer | Low | Done |
| FR-203 | Password reset | Customer | High | Done |
| FR-204 | Registration error messages | Customer | Medium | Done |
| FR-301 | Staff registration | Staff | High | Done |
| FR-302 | View registration details | Staff | Medium | Done |
| FR-303 | Update registration details | Staff | Medium | Done |
| FR-304 | Cancel registration | Staff | Medium | Done |
| FR-101 | Manage user registrations | Manager | High | Done |

### 3.2 Detailed Requirements

#### FR-200: Customer Account Registration

| Attribute | Value |
|-----------|-------|
| **ID** | FR-200 |
| **Title** | Customer Account Registration |
| **Priority** | Medium |
| **Status** | Done |
| **Release** | R0 |

**Description:**
As a Customer User, I want to register an account using my full name, email, password, and phone number so that I can access the system as a registered user.

**Acceptance Criteria:**
1. System SHALL accept full name, email, password, and phone number
2. System SHALL validate email format
3. System SHALL enforce password minimum requirements (8 characters)
4. System SHALL prevent duplicate email registration
5. System SHALL display success confirmation upon completion

**Related NFRs:** NFR-101, NFR-103, NFR-504

---

#### FR-301: Staff Registration

| Attribute | Value |
|-----------|-------|
| **ID** | FR-301 |
| **Title** | Staff User Registration |
| **Priority** | High |
| **Status** | Done |
| **Release** | R1 |

**Description:**
As a Staff User, I want to register so that I can create a user profile with appropriate permissions.

**Acceptance Criteria:**
1. System SHALL require manager approval for staff registration
2. System SHALL assign appropriate role-based permissions
3. System SHALL validate employee identification
4. System SHALL send confirmation email upon approval

**Related NFRs:** NFR-101, NFR-104

---

## 4. User Authentication Requirements

### 4.1 Requirements Summary

| ID | Requirement | User Type | Priority | Status |
|----|-------------|-----------|----------|--------|
| FR-205 | Anonymous browsing | Customer | Medium | Done |
| FR-206 | Customer login | Customer | High | Done |
| FR-207 | Remember me option | Customer | Low | Done |
| FR-208 | Session timeout warning | Customer | Medium | Done |
| FR-209 | Login history | Customer | Medium | Done |
| FR-305 | Staff login | Staff | High | Done |
| FR-306 | Staff logout | Staff | High | Done |
| FR-102 | Force logout capability | Manager | High | Done |

### 4.2 Detailed Requirements

#### FR-205: Anonymous Browsing

| Attribute | Value |
|-----------|-------|
| **ID** | FR-205 |
| **Title** | Anonymous Store Browsing |
| **Priority** | Medium |
| **Status** | Done |
| **Release** | R0 |

**Description:**
As a Customer User, I want to browse the store page without creating an account so that I do not have to submit personal information to view the store.

**Acceptance Criteria:**
1. System SHALL display public menu items without authentication
2. System SHALL allow category browsing
3. System SHALL allow item search
4. System SHALL prompt login only for protected actions (ordering, reservations)

---

#### FR-305: Staff Login

| Attribute | Value |
|-----------|-------|
| **ID** | FR-305 |
| **Title** | Staff User Login |
| **Priority** | High |
| **Status** | Done |
| **Release** | R1 |

**Description:**
As a Staff User, I want to login so that I can securely access the system.

**Acceptance Criteria:**
1. System SHALL authenticate using email and password
2. System SHALL generate JWT token upon successful login
3. System SHALL return user role and permissions
4. System SHALL log login attempt (success/failure)
5. System SHALL lock account after 5 failed attempts

---

## 5. Menu Management Requirements

### 5.1 Requirements Summary

| ID | Requirement | User Type | Priority | Status |
|----|-------------|-----------|----------|--------|
| FR-103 | Menu browsing | Customer | High | Done |
| FR-104 | Menu item management | Manager | High | Done |
| FR-105 | Category management | Manager | Medium | Done |
| FR-106 | Stock management | Manager | Medium | Done |
| FR-107 | Menu item search | Customer | High | Done |

### 5.2 Detailed Requirements

#### FR-103: Menu Browsing

| Attribute | Value |
|-----------|-------|
| **ID** | FR-103 |
| **Title** | Customer Menu Browsing |
| **Priority** | High |
| **Status** | Done |
| **Release** | R0 |

**Description:**
As a Customer, I want to view the restaurant menu with categories so that I can see available items.

**Acceptance Criteria:**
1. System SHALL display all available menu items
2. System SHALL organize items by category
3. System SHALL show item name, description, price, and image
4. System SHALL indicate item availability
5. System SHALL support filtering by category

---

## 6. Order Management Requirements

### 6.1 Requirements Summary

| ID | Requirement | User Type | Priority | Status |
|----|-------------|-----------|----------|--------|
| FR-501 | Create order | Customer | High | Done |
| FR-502 | View order status | Customer | High | Done |
| FR-503 | Order history | Customer | Medium | Done |
| FR-504 | Update order status | Staff | High | Done |
| FR-505 | Cancel order | Customer | Medium | Done |

---

## 7. Payment Processing Requirements

### 7.1 Requirements Summary

| ID | Requirement | User Type | Priority | Status |
|----|-------------|-----------|----------|--------|
| FR-601 | Process payment | Customer | High | Done |
| FR-602 | Multiple payment methods | Customer | High | Done |
| FR-603 | Payment refund | Manager | High | Done |
| FR-604 | Payment history | Customer | Medium | Done |

---

## 8. Reservation Management Requirements

### 8.1 Requirements Summary

| ID | Requirement | User Type | Priority | Status |
|----|-------------|-----------|----------|--------|
| FR-801 | Create reservation | Customer | High | Done |
| FR-802 | View table availability | Customer | High | Done |
| FR-803 | Approve/reject reservation | Manager | High | Done |
| FR-804 | Reservation calendar | Manager | Medium | Done |
| FR-805 | Cancel reservation | Customer | Medium | Done |

---

## 9. Release Strategy

### 9.1 Release Schedule

| Release | Description | Requirements |
|---------|-------------|--------------|
| R0 (MVP) | Minimum Viable Product | FR-200, FR-202, FR-204, FR-205, FR-103 |
| R1 | Core Operations | FR-301-306, FR-206, FR-104-107, FR-501-505 |
| R2 | Advanced Features | FR-201, FR-203, FR-207-209, FR-101-102, FR-601-604, FR-801-805 |

### 9.2 Priority Classification

| Priority | Definition | Examples |
|----------|------------|----------|
| High | Core functionality essential for system operations | Login, Menu, Orders |
| Medium | Important for user experience and efficiency | Notifications, History |
| Low | Convenience improvements | Remember Me, Themes |

### 9.3 Story Point Scale

| Points | Complexity | Example |
|--------|------------|---------|
| 3 | Simple UI change | Password strength indicator |
| 5 | Moderate complexity | Session timeout warning |
| 8 | Medium complexity with backend | Customer login |
| 13 | Complex with security/integrations | Staff authentication |

---

## 10. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-27 | Product Team | Initial document creation |
| 2.0 | 2025-12-24 | Development Team | Restructured to technical writer format |
| 3.0 | 2026-05-25 | Jungwook Van | Implemented FR-202, FR-203, FR-206, FR-207, FR-208, FR-209, FR-101, FR-102; FR-201 deferred (requires mail server) |

---

**End of Document**
