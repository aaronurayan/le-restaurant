# 🍽️ Le Restaurant - Functional Requirements

## Document Overview
This document outlines the functional requirements for the Le Restaurant management system, organized by feature categories with detailed explanations for categorization rationale.

## User Types Classification
- **Manager (1xx)**: System administrators and restaurant managers with full system access
- **Customer User (2xx)**: Regular customers who use the restaurant services
- **Staff User (3xx)**: Restaurant staff members (waiters, kitchen staff, etc.)

---

## 1. User Registration Requirements

### Requirements Table
| User Story # | As a(an) | I want to... | So that... | Estimates | Priority | Value | NFRs Link to Use Case ID | Status | Release | Iteration | Owner | Process/ Service |
|--------------|----------|-------------|-----------|-----------|----------|-------|-------------------------|--------|---------|-----------|-------|----------------|
| FR-200 | Customer User | be able to register an account using my full name, email, password, and phone number | I can access the system and my information in the future as a registered User | 8 | Medium | High | NFR-101, NFR-103, NFR-504 | Done | R0 | I1 | Dev Team | User Registration |
| FR-301 | Staff User | be able to register | I can create a user profile | 13 | High | High | NFR-101, NFR-104 | Done | R1 | I1 | Dev Team | User Registration |
| FR-302 | Staff User | be able to view registration details | I can verify registration status | 8 | Medium | Medium | NFR-104 | Done | R1 | I1 | Dev Team | User Registration |
| FR-303 | Staff User | be able to update registration details | I can correct my personal information | 8 | Medium | Medium | NFR-104, NFR-505 | Done | R1 | I1 | Dev Team | User Registration |
| FR-304 | Staff User | be able to cancel registration | I can withdraw my registration | 8 | Medium | Low | NFR-104 | Done | R1 | I1 | Dev Team | User Registration |
| FR-201 | Customer User | be able to verify my email address through a confirmation link | I can activate my account and ensure email validity | 5 | Medium | High | NFR-103, NFR-105 | | R1 | I1 | Dev Team | User Registration |
| FR-202 | Customer User | be able to see password strength requirements during registration | I can create a secure password that meets system standards | 3 | Low | Medium | NFR-101, NFR-402 | | R0 | I1 | Dev Team | User Registration |
| FR-203 | Customer User | be able to reset my password using my registered email | I can regain access to my account if I forget my password | 8 | High | High | NFR-101, NFR-103 | | R1 | I2 | Dev Team | User Registration |
| FR-101 | Manager | be able to view and manage user registrations | I can monitor user activity and handle registration issues | 13 | High | High | NFR-104, NFR-105 | | R1 | I2 | Dev Team | User Registration |
| FR-204 | Customer User | be able to see clear error messages when registration fails | I understand what went wrong and how to fix registration issues | 5 | Medium | Medium | NFR-402, NFR-504 | | R0 | I1 | Dev Team | User Registration |

### Categorization Rationale - User Registration

**FR-200 (Customer User Registration)**
- **User Type**: Customer User - First-time users accessing the system
- **Priority**: Medium - Essential for basic system access but not immediately critical for system operations
- **Story Points**: 8 - Medium complexity including database design, input validation, UI development
- **Release**: R0 - Core functionality that must be included in the basic MVP

**FR-301 (Staff User Registration)**
- **User Type**: Staff User - Employee users requiring different permissions than customers
- **Priority**: High - High priority for staff account creation needed for system operations
- **Story Points**: 13 - Complex logic including permission management and role-based access control

**FR-302-304 (Staff Registration Management)**
- **User Type**: Staff User - Employees managing their own registration information
- **Priority**: Medium - Operationally necessary but not core system functionality
- **Dependencies**: Yes - Depends on basic registration functionality

**FR-201 (Email Verification)**
- **User Type**: Customer User - Registered users who need account verification
- **Priority**: Medium - Important for security but no immediate impact on system operations
- **Story Points**: 5 - Email service integration, token generation/verification

**FR-202 (Password Strength)**
- **User Type**: Customer User - New users needing guidance during registration
- **Priority**: Low - User experience improvement but not essential
- **Story Points**: 3 - Frontend validation logic, relatively simple

**FR-203 (Password Reset)**
- **User Type**: Customer User - Existing account holders who forgot their password
- **Priority**: High - Important for user accessibility and reducing customer support costs
- **Release**: R1/I2 - Additional feature implemented after basic registration

**FR-101 (Admin Management)**
- **User Type**: Manager - System administrators managing the entire system
- **Priority**: High - Essential for system operations and security management
- **Story Points**: 13 - Complex functionality including admin dashboard, user management features

**FR-204 (Error Messages)**
- **User Type**: Customer User - Users experiencing errors during registration
- **Priority**: Medium - Improves user experience and customer support efficiency
- **Story Points**: 5 - Multi-language support, contextual message design

---

## 2. User Authentication Requirements

### Requirements Table
| User Story # | As a(an) | I want to... | So that... | Estimates | Priority | Value | NFRs Link to Use Case ID | Status | Release | Iteration | Owner | Process/ Service |
|--------------|----------|-------------|-----------|-----------|----------|-------|-------------------------|--------|---------|-----------|-------|----------------|
| FR-205 | Customer User | be able to browse the store page without creating an account | do not have to submit my personal information to view the store | 8 | Medium | High | NFR-401, NFR-403 | Done | R0 | I2 | Dev Team | User Authentication |
| FR-305 | Staff User | be able to login | I can securely access the system | 13 | High | High | NFR-101, NFR-102, NFR-201 | Done | R1 | I1 | Dev Team | User Authentication |
| FR-306 | Staff User | be able to logout | I can end my session safely | 13 | High | High | NFR-102, NFR-105 | Done | R1 | I1 | Dev Team | User Authentication |
| FR-206 | Customer User | be able to login using email and password | I can access my personal account and restaurant features | 8 | High | High | NFR-101, NFR-201 | | R1 | I1 | Dev Team | User Authentication |
| FR-207 | Customer User | be able to stay logged in with "Remember Me" option | I don't have to re-enter credentials frequently on trusted devices | 5 | Low | Medium | NFR-102, NFR-401 | | R1 | I2 | Dev Team | User Authentication |
| FR-208 | Customer User | be able to see session timeout warnings | I can extend my session or save my work before being logged out | 3 | Medium | Medium | NFR-102, NFR-402 | | R1 | I2 | Dev Team | User Authentication |
| FR-102 | Manager | be able to force logout users for security reasons | I can protect the system from compromised accounts | 8 | High | High | NFR-102, NFR-105 | | R1 | I2 | Dev Team | User Authentication |
| FR-209 | Customer User | be able to view my login history and active sessions | I can monitor account security and detect unauthorized access | 5 | Medium | Medium | NFR-105, NFR-501 | | R2 | I2 | Dev Team | User Authentication |

### Categorization Rationale - User Authentication

**FR-205 (Anonymous Browsing)**
- **User Type**: Customer User - Users exploring the system without creating accounts
- **Priority**: Medium - Important for user acquisition and conversion but not core business logic
- **Story Points**: 8 - Medium complexity including permission separation, public content management
- **Release**: R0/I2 - User experience improvement implemented after basic system

**FR-305 (Staff Login)**
- **User Type**: Staff User - Employees responsible for system operations
- **Priority**: High - Core functionality for system operations
- **Story Points**: 13 - Complex security logic including security authentication, session management, permission verification
- **Dependencies**: No - Core functionality that can be implemented independently

**FR-306 (Staff Logout)**
- **User Type**: Staff User - Employees wanting to safely terminate their sessions
- **Priority**: High - Essential security functionality
- **Story Points**: 13 - Security-related complexity including session invalidation, security token cleanup
- **Dependencies**: Yes - Depends on login functionality

**FR-206 (Customer Login)**
- **User Type**: Customer User - Regular registered users
- **Priority**: High - Core functionality for providing personalized services
- **Story Points**: 8 - Basic authentication logic, simpler than staff login

**FR-207 (Remember Me)**
- **User Type**: Customer User - Existing users wanting convenience
- **Priority**: Low - User convenience improvement but not essential
- **Story Points**: 5 - Cookie/token management, security considerations included
- **Dependencies**: Yes - Depends on basic login functionality

**FR-208 (Session Timeout Warning)**
- **User Type**: Customer User - All logged-in users
- **Priority**: Medium - Important for user experience and data protection
- **Story Points**: 3 - Frontend timer and notification functionality, relatively simple
- **Release**: R1/I2 - Additional feature implemented after basic authentication

**FR-102 (Force Logout)**
- **User Type**: Manager - Administrators responsible for security management
- **Priority**: High - Essential functionality for security incident response
- **Story Points**: 8 - Medium complexity including admin permission verification, forced session termination

**FR-209 (Login History)**
- **User Type**: Customer User - Users concerned about account security
- **Priority**: Medium - Important for security transparency and building user trust
- **Story Points**: 5 - Medium complexity including log storage, query functionality
- **Release**: R2 - Advanced functionality implemented later

---

## 3. Priority and Release Strategy

### Priority Classification
- **High**: Core functionality essential for system operations
- **Medium**: Important features for user experience and operational efficiency
- **Low**: Convenience improvement features

### Release Planning
- **R0**: MVP (Minimum Viable Product) - Basic user registration and public access
- **R1**: Core operational functionality - Authentication, management features
- **R2**: Advanced features - Security monitoring, advanced user features

### Story Points Rationale
- **3-5 points**: Simple UI/frontend functionality
- **8 points**: Medium complexity including backend logic
- **13 points**: Complex security, permission management, or multi-system integration

---

## 4. Dependencies and Implementation Order

### Implementation Sequence
1. **Phase 1**: Basic registration (FR-200, FR-202, FR-204)
2. **Phase 2**: Staff authentication (FR-301, FR-305, FR-306)
3. **Phase 3**: Customer authentication (FR-206, FR-205)
4. **Phase 4**: Advanced features (FR-201, FR-203, FR-207, FR-208)
5. **Phase 5**: Admin and monitoring (FR-101, FR-102, FR-209)

### Critical Dependencies
- All authentication features depend on user registration
- Advanced features depend on basic authentication
- Admin features require both customer and staff systems to be operational 