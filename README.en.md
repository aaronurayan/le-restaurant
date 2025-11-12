# 🍽️ Le Restaurant

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green?style=flat-square&logo=spring)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?style=flat-square&logo=postgresql)
![Azure](https://img.shields.io/badge/Azure-Cloud-0078D4?style=flat-square&logo=microsoft-azure)

[한국어](README.md) | English | [日本語](README.ja.md) | [Русский](README.ru.md)

---

## Overview

A modern, full-stack restaurant management system built with **Spring Boot** backend and **React + TypeScript** frontend. Developed collaboratively by 5 UTS students for the Advanced Software Development course, featuring comprehensive order management, payment processing, delivery tracking, and table reservation capabilities.

**Core Concept**: A scalable, maintainable restaurant management platform following Atomic Design principles, with robust API connectivity, role-based access control, and comprehensive feature coverage for customers, staff, and managers.

---

## 🚀 Quick Start

### 🌐 Live Deployment (Azure)

**The application is live on Azure!**

- **Backend API**: https://le-restaurant-adbrdddye6cbdjf2.australiaeast-01.azurewebsites.net
- **Frontend**: https://le-restaurant-frontend.azurestaticapps.net
- **Database**: PostgreSQL 14 on Azure (Australia East)
- **Auto-Deployment**: Azure DevOps Pipelines (push to `main` branch)

### 💻 Local Development

#### Prerequisites
- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **PostgreSQL 14+** (or use H2 for development)
- **Git** (for version control)

#### Getting Started

```bash
# Clone the repository
git clone https://github.com/aaronurayan/le-restaurant.git
cd le-restaurant

# Start the Backend (Spring Boot)
cd backend
./mvnw spring-boot:run
# Backend will run on http://localhost:8080

# In a new terminal, start the Frontend (React + Vite)
cd frontend
npm install
npm run dev
# Frontend will run on http://localhost:5173
```

#### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/api/health

---

## 🏗️ Architecture

### Core Components

#### Backend (Spring Boot)
- **Controllers**: REST API endpoints (`/api/*`)
- **Services**: Business logic layer
- **Repositories**: Data access layer (Spring Data JPA)
- **Entities**: Domain models (User, Order, MenuItem, Payment, etc.)
- **DTOs**: Data transfer objects for API communication
- **Config**: Security, CORS, and application configuration

#### Frontend (React + TypeScript)
- **Atoms**: Basic UI components (Button, Input, Badge, etc.)
- **Molecules**: Composite components (MenuCard, OrderCard, etc.)
- **Organisms**: Complex UI sections (MenuManagementPanel, OrderManagementPanel, etc.)
- **Templates**: Page layouts (MainLayout)
- **Pages**: Route components
- **Hooks**: Custom React hooks for API operations
- **Services**: API client and service layers
- **Contexts**: Global state management (Auth, Cart)

### Design Patterns

- **Atomic Design**: Component architecture (Atoms → Molecules → Organisms → Templates → Pages)
- **Singleton Pattern**: API client instances
- **Repository Pattern**: Data access abstraction
- **Service Layer Pattern**: Business logic separation
- **DTO Pattern**: Data transfer objects
- **Dependency Injection**: Spring IoC container
- **Custom Hooks**: Reusable React logic

### Performance Optimizations

- **API Client**: Unified client with retry logic and health checks
- **Mock Data Fallback**: Graceful degradation when backend is unavailable
- **Lazy Loading**: Code splitting with React Router
- **Connection Pooling**: Database connection management
- **Caching**: Strategic caching for menu items and user data
- **Optimistic Updates**: Immediate UI feedback

---

## 📁 Project Structure

```
le-restaurant/
├── backend/                          # Spring Boot API
│   ├── src/main/java/
│   │   ├── controller/              # REST controllers
│   │   ├── service/                # Business logic
│   │   ├── repository/            # Data access
│   │   ├── entity/               # Domain models
│   │   ├── dto/                  # Data transfer objects
│   │   └── config/               # Configuration
│   └── pom.xml
│
├── frontend/                       # React + TypeScript app
│   ├── src/
│   │   ├── components/
│   │   │   ├── atoms/            # Basic UI components
│   │   │   ├── molecules/        # Composite components
│   │   │   ├── organisms/        # Complex UI sections
│   │   │   └── templates/       # Page layouts
│   │   ├── pages/                # Route components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # API services
│   │   └── contexts/             # Global state
│   └── package.json
│
└── docs/                           # Documentation
```

---

## 🎯 Key Features

### 👤 User Management (F100-F102)
- **User Registration**: Email-based account creation
- **Authentication**: Secure login with session management
- **User Management**: Manager dashboard for user CRUD operations
- **Role-Based Access**: Customer, Staff, Manager roles

### 🍽️ Menu Management (F103-F104)
- **Menu Display**: Category-based menu browsing
- **Search & Filter**: Real-time search and filtering
- **Menu Management**: CRUD operations for menu items
- **Image Management**: Menu item image uploads

### 🛒 Order & Payment (F105-F106)
- **Order Creation**: Shopping cart with item management
- **Order Tracking**: Real-time order status updates
- **Payment Processing**: Multiple payment methods
- **Transaction Management**: Payment history and reconciliation

### 🚚 Delivery Management (F107)
- **Delivery Assignment**: Driver assignment system
- **Status Tracking**: Real-time delivery status updates
- **Address Management**: Customer delivery addresses
- **Progress Updates**: Customer notifications

### 🍽️ Table Reservation (F108-F109)
- **Table Booking**: Date/time-based reservations
- **Availability Checking**: Real-time table availability
- **Reservation Management**: Manager approval/denial system
- **Customer Dashboard**: Reservation history and status

---

## 🛠️ Tech Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.x** - Application framework
- **Spring Data JPA** - Data persistence
- **PostgreSQL 14** - Production database
- **H2 Database** - Development database
- **Maven** - Dependency management
- **Spring Security** - Authentication & authorization

### Frontend
- **React 18** - UI library
- **TypeScript 5.x** - Type-safe JavaScript
- **Vite 7.x** - Build tool and dev server
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Zustand** - State management
- **Lucide React** - Icon library

### DevOps & Cloud
- **Azure App Service** - Backend hosting
- **Azure Static Web Apps** - Frontend hosting
- **Azure PostgreSQL** - Production database
- **Azure DevOps** - CI/CD pipelines
- **Docker** - Containerization (optional)

---

## 👥 Team Collaboration

This project is developed by **5 UTS students** working collaboratively:

| Feature # | Name | Description | Owner |
|-----------|------|-------------|-------|
| **F100** | User Registration | Customers can create a new account with email and password. | **Junayeed Halim** |
| **F101** | User Authentication | Registered customers can log in to their account. | **Junayeed Halim** |
| **F102** | User Management (Manager) | Managers can view, edit, and delete customer accounts. | **Jungwook Van** |
| **F103** | Menu Display | View food items by category, including images, prices, and availability. | **Mikhail Zhelnin** |
| **F104** | Menu Management (Manager) | Create, update, delete, and manage menu items, prices, and images. | **Mikhail Zhelnin** |
| **F105** | Order Management | Create and submit orders with a payment system and order confirmation. | **Damaq Zain** |
| **F106** | Payment Management | Handle customer payments for orders, including transaction processing. | **Jungwook Van** |
| **F107** | Delivery Management | Manage customer deliveries, including assigning delivery personnel and tracking. | **Aaron Urayan** |
| **F108** | Table Reservation | Customers can book tables for a specific date, time, and number of guests. | **Damaq Zain** |
| **F109** | Reservation Management (Manager) | View, approve, deny, and manage all customer reservations. | **Aaron Urayan** |

---

## 📚 Documentation

All project documentation is organized in the [`docs/`](docs/) directory:

- **📖 Documentation Index**: [`docs/README.md`](docs/README.md)
- **🎨 Frontend Documentation**: [`docs/frontend/`](docs/frontend/)
- **🏗️ Design & Architecture**: [`docs/design/`](docs/design/)
- **🧪 Testing**: [`docs/testing/`](docs/testing/)
- **📋 Requirements**: [`docs/requirements/`](docs/requirements/)
- **🚀 Deployment**: [`docs/AZURE_DEPLOYMENT_GUIDE.md`](docs/AZURE_DEPLOYMENT_GUIDE.md)

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

---

## 📄 License

This project is developed for academic purposes as part of the UTS Advanced Software Development course.

---

**Last Updated**: 2025-01-27

