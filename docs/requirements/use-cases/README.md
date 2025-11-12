# 🍽️ Le Restaurant - Use Cases Index

## Overview
This directory contains comprehensive use case documentation for the Le Restaurant Management System. Use cases are organized by user types and provide detailed scenarios for system functionality.

---

## 📁 Use Case Structure

### User Type Organization
- **Manager Use Cases (1xx)**: System administration and management functions
- **Customer Use Cases (2xx)**: Customer-facing registration and authentication features  
- **Staff Use Cases (3xx)**: Employee registration and system access functions

---

## 📋 Complete Use Case Listing

### 👨‍💼 Manager Use Cases (1xx)
| Use Case ID | Use Case Name | Related FR | Status | Description |
|-------------|---------------|------------|--------|-------------|
| **UC-101** | [User Registration Management](Manager-UseCases/UC-101-User-Registration-Management.md) | FR-101 | ✅ Complete | Manager can view and manage user registrations across all user types |
| **UC-102** | [Force Logout Users for Security](Manager-UseCases/UC-102-Force-Logout-Users.md) | FR-102 | ✅ Complete | Manager can forcibly terminate user sessions for security reasons |

### 👥 Customer Use Cases (2xx)
| Use Case ID | Use Case Name | Related FR | Status | Description |
|-------------|---------------|------------|--------|-------------|
| **UC-200** | [Customer User Registration](Customer-UseCases/UC-200-Customer-Registration.md) | FR-200 | ✅ Complete | Customer can register account with personal information |
| **UC-201** | [Email Verification Process](Customer-UseCases/UC-201-Email-Verification.md) | FR-201 | ✅ Complete | Customer can verify email address through confirmation link |
| UC-202 | Password Strength Requirements | FR-202 | 📝 Planned | Customer sees password requirements during registration |
| UC-203 | Password Reset Process | FR-203 | 📝 Planned | Customer can reset password using registered email |
| UC-204 | Registration Error Messages | FR-204 | 📝 Planned | Customer receives clear error messages when registration fails |
| UC-205 | Anonymous Store Browsing | FR-205 | 📝 Planned | Customer can browse store without creating account |
| UC-206 | Customer User Login | FR-206 | 📝 Planned | Customer can login using email and password |
| UC-207 | Remember Me Login | FR-207 | 📝 Planned | Customer can stay logged in with "Remember Me" option |
| UC-208 | Session Timeout Warning | FR-208 | 📝 Planned | Customer sees session timeout warnings |
| UC-209 | Login History View | FR-209 | 📝 Planned | Customer can view login history and active sessions |

### 👨‍🍳 Staff Use Cases (3xx)
| Use Case ID | Use Case Name | Related FR | Status | Description |
|-------------|---------------|------------|--------|-------------|
| **UC-301** | [Staff User Registration](Staff-UseCases/UC-301-Staff-Registration.md) | FR-301 | ✅ Complete | Staff member can register with manager approval |
| UC-302 | Staff Registration Details View | FR-302 | 📝 Planned | Staff can view their registration details |
| UC-303 | Staff Registration Update | FR-303 | 📝 Planned | Staff can update their registration details |
| UC-304 | Staff Registration Cancellation | FR-304 | 📝 Planned | Staff can cancel their registration |
| UC-305 | Staff User Login | FR-305 | 📝 Planned | Staff can securely login to system |
| UC-306 | Staff User Logout | FR-306 | 📝 Planned | Staff can safely logout and end session |

---

## 🔗 Use Case Relationships

### Primary Relationships
```
UC-101 (User Management) 
├── Manages → UC-200 (Customer Registration)
├── Manages → UC-301 (Staff Registration) 
└── Controls → UC-102 (Force Logout)

UC-200 (Customer Registration)
├── Triggers → UC-201 (Email Verification)
├── Leads to → UC-206 (Customer Login)
└── May need → UC-203 (Password Reset)

UC-301 (Staff Registration)
├── Requires → UC-101 (Manager Approval)
├── Leads to → UC-305 (Staff Login)
└── Connects to → UC-302 (View Details)
```

### Cross-User-Type Dependencies
- **UC-101** manages both **UC-200** and **UC-301** registrations
- **UC-102** can affect sessions from **UC-206** and **UC-305** 
- **UC-201** email verification applies to both customer and staff registrations

---

## 📊 Use Case Statistics

### Completion Status
- **✅ Completed**: 4 use cases (detailed documentation)
- **📝 Planned**: 14 use cases (to be documented)
- **Total**: 18 use cases covering all functional requirements

### Coverage by User Type
- **Manager (1xx)**: 2 use cases - 100% complete
- **Customer (2xx)**: 10 use cases - 20% complete  
- **Staff (3xx)**: 6 use cases - 17% complete

---

## 📝 Use Case Template Structure

Each use case document follows this standard structure:
1. **Use Case Information** - ID, name, related user story, actors
2. **Use Case Description** - Brief description, actors, stakeholders
3. **Preconditions** - System state requirements before execution
4. **Postconditions** - Expected system state after execution
5. **Main Success Scenario** - Step-by-step basic flow
6. **Alternative Flows** - Variations of the main scenario
7. **Exception Flows** - Error handling and failure scenarios
8. **Special Requirements** - Non-functional requirements and business rules
9. **Technology and Data Variations** - Input/output data specifications
10. **Frequency of Occurrence** - Usage patterns and volume estimates
11. **Assumptions** - System and user assumptions
12. **Related Use Cases** - Dependencies and relationships
13. **Open Issues** - Outstanding questions and concerns

---

## 🚀 Next Steps

### Priority 1 - Customer Authentication Flow
- UC-206: Customer User Login
- UC-203: Password Reset Process
- UC-208: Session Timeout Warning

### Priority 2 - Staff Operations
- UC-305: Staff User Login  
- UC-306: Staff User Logout
- UC-302: Staff Registration Details View

### Priority 3 - Enhanced Features
- UC-205: Anonymous Store Browsing
- UC-207: Remember Me Login
- UC-209: Login History View

---

## 📞 Contact Information
For questions about use cases or to request additional documentation:
- **Project Team**: Le Restaurant Development Team
- **Document Maintainer**: Design Team
- **Last Updated**: 2025-01-27 