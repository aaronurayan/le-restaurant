# 🍽️ Le Restaurant

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green?style=flat-square&logo=spring)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite)

A modern restaurant management system built with **Spring Boot** backend and **React + TypeScript** frontend, developed collaboratively by 5 UTS students for the Advanced Software Development course.

---

## 🚀 Quick Start

### Prerequisites
- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **Git** (for version control)

### 🏃‍♂️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/aaronurayan/le-restaurant.git
   cd le-restaurant
   ```

2. **Start the Backend (Spring Boot)**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   # Backend will run on http://localhost:8080
   ```

3. **Start the Frontend (React + Vite)**
   ```bash
   cd frontend
   npm install
   npm run dev
   # Frontend will run on http://localhost:5173
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/swagger-ui.html

---

## 🛠️ Tech Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.x** - Application framework
- **Spring Data JPA** - Data persistence
- **H2 Database** - In-memory database
- **Maven** - Dependency management

### Frontend
- **React 18** - UI library
- **TypeScript 5.x** - Type-safe JavaScript
- **Vite 7.x** - Build tool and dev server
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router** - Client-side routing

---

## 👥 Team Collaboration & Feature Assignments

This project is developed by **5 UTS students** working collaboratively with assigned feature responsibilities:

### 🎯 Feature Assignments

| Feature # | Name | Description | Owner |
|-----------|------|-------------|-------|
| **F100** | User Registration | Customers can create a new account with email and password. | **Junayeed Halim** |
| **F101** | User Authentication | Registered customers can log in to their account. | **Junayeed Halim** |
| **F102** | User Management (Manager) | Managers can view, edit, and delete customer accounts. | **Jungwook Van** |
| **F103** | Menu Display | View food items by category (ex. starters, mains), including images, prices, and availability. Search menu by name and filter. | **Mikhail Zhelnin** |
| **F104** | Menu Management (Manager) | Create, update, delete, and manage menu items, prices, and images. | **Mikhail Zhelnin** |
| **F105** | Order Management | Create and submit orders with a payment system and order confirmation. | **Damaq Zain** |
| **F106** | Payment Management | Handle customer payments for orders, including transaction processing, and integration with order confirmation. | **Jungwook Van** |
| **F107** | Delivery Management | Manage customer deliveries, including assigning delivery personnel, tracking order status (e.g., preparing, out for delivery, delivered), and updating customers with delivery progress. | **Aaron Urayan** |
| **F108** | Table Reservation | Customers can book tables for a specific date, time, and number of guests. The system checks availability and confirms the reservation. | **Damaq Zain** |
| **F109** | Reservation Management (Manager) | View, approve, deny, and manage all customer reservations. | **Aaron Urayan** |

### 🔄 Development Workflow
- **Version Control**: Git with feature branching strategy
- **Code Review**: Pull Request workflow with assigned reviewers
- **Documentation**: Comprehensive component documentation
- **Testing**: Unit and integration tests for each feature
- **Deployment**: CI/CD with Azure Pipelines

### 📋 Development Process
1. Create feature branch from `main` (e.g., `feature/menu-management`)
2. Develop and test your assigned feature
3. Create Pull Request for code review
4. Assign relevant team members as reviewers
5. Merge after approval
6. Deploy to staging/production

---

## 📁 Project Structure

```
le-restaurant/
├── backend/                 # Spring Boot API
│   ├── src/main/java/      # Java source code
│   │   ├── controller/     # REST controllers
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Data access layer
│   │   └── model/          # Entity models
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml            # Maven dependencies
├── frontend/               # React + TypeScript app
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   │   ├── atoms/     # Basic UI components
│   │   │   ├── molecules/ # Composite components
│   │   │   └── organisms/ # Complex UI sections
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # TypeScript types
│   │   └── services/      # API services
│   ├── package.json       # NPM dependencies
│   └── vite.config.ts     # Vite configuration
└── README.md              # This file
```

---

## 🎯 Feature Overview

### 👤 User Management (F100-F102)
- **Owner**: Junayeed Halim (F100, F101), Jungwook Van (F102)
- **Components**: AuthModal, UserManagementPanel, UserFormModal
- **Features**: User registration, authentication, manager user management
- **API Endpoints**: `/api/auth`, `/api/users`

### 🍽️ Menu Management (F103-F104)
- **Owner**: Mikhail Zhelnin
- **Components**: MenuGrid, MenuCard, CategoryFilter, MenuManagementPanel
- **Features**: Menu display, category filtering, search, CRUD operations
- **API Endpoints**: `/api/menu`, `/api/categories`

### 🛒 Order & Payment Management (F105-F106)
- **Owner**: Damaq Zain (F105), Jungwook Van (F106)
- **Components**: CartSidebar, OrderStatus, PaymentManagementPanel
- **Features**: Order creation, payment processing, transaction management
- **API Endpoints**: `/api/orders`, `/api/payments`

### 🚚 Delivery Management (F107)
- **Owner**: Aaron Urayan
- **Components**: DeliveryTracking, OrderStatus, DeliveryManagementPanel
- **Features**: Delivery assignment, status tracking, progress updates
- **API Endpoints**: `/api/deliveries`, `/api/order-status`

### 🍽️ Table Reservation (F108-F109)
- **Owner**: Damaq Zain (F108), Aaron Urayan (F109)
- **Components**: ReservationForm, ReservationManagementPanel
- **Features**: Table booking, availability checking, reservation management
- **API Endpoints**: `/api/reservations`, `/api/tables`

---

## 📚 Documentation

- **Frontend Components**: See `frontend/frontend-view-explain-doc.md` for detailed component documentation
- **API Documentation**: Available at `/swagger-ui.html` when backend is running
- **Database Schema**: Check `backend/src/main/resources/schema.sql`
- **Feature Documentation**: Each feature has its own documentation in the respective directories

---

## 🎓 Academic Project

This project is developed as part of **41029 Advanced Software Development** at the University of Technology Sydney (UTS), Spring Semester 2025.

### 👨‍🎓 Team Members
- **Junayeed Halim** - User Registration & Authentication (F100, F101)
- **Jungwook Van** - User Management & Payment Management (F102, F106)
- **Mikhail Zhelnin** - Menu Display & Management (F103, F104)
- **Damaq Zain** - Order Management & Table Reservation (F105, F108)
- **Aaron Urayan** - Delivery Management & Reservation Management (F107, F109)

### 🏫 University Information
- **Course**: 41029 Advanced Software Development
- **Institution**: University of Technology Sydney (UTS)
- **Semester**: Spring 2025
- **Project Type**: Collaborative Group Assignment

**Note**: This is an academic project developed by UTS students and not intended for commercial use.
