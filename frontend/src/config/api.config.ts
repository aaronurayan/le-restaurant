/**
 * Centralized API Configuration
 * 
 * This file provides a single source of truth for all API-related configuration.
 * It handles environment-specific settings, CORS, authentication, and error handling.
 * 
 * @author Le Restaurant Development Team
 * @version 2.0.0
 * @since 2025-01-27
 */

// =============================================================================
// Environment Configuration
// =============================================================================

/**
 * Get API Base URL based on environment
 * Priority: VITE_API_BASE_URL > VITE_API_URL > default
 */
export const getApiBaseUrl = (): string => {
  // Production: Azure App Service or environment variable
  if (import.meta.env.PROD) {
    const url = (
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      'https://le-restaurant-adbrdddye6cbdjf2.australiaeast-01.azurewebsites.net'
    );
    // Remove trailing /api if present (API_ENDPOINTS already includes /api)
    return url.replace(/\/api$/, '');
  }
  
  // Development: localhost
  const url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  // Remove trailing /api if present (API_ENDPOINTS already includes /api)
  return url.replace(/\/api$/, '');
};

/**
 * API Configuration Object
 */
export const API_CONFIG = {
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second initial delay
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

/**
 * Environment Information
 */
export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiUrl: getApiBaseUrl(),
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const;

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  enableDebugMode: import.meta.env.DEV,
  enableAnalytics: import.meta.env.PROD,
  enableErrorReporting: import.meta.env.PROD,
  enableMockDataFallback: true,
} as const;

// =============================================================================
// API Endpoints
// =============================================================================

/**
 * Centralized API Endpoints
 * All endpoints should be defined here for maintainability
 */
export const API_ENDPOINTS = {
  // Health Check
  health: '/api/health',
  
  // Authentication
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
  },
  
  // Users
  users: {
    base: '/api/users',
    byId: (id: number) => `/api/users/${id}`,
    byEmail: (email: string) => `/api/users/email/${encodeURIComponent(email)}`,
    byRole: (role: string) => `/api/users/role/${role}`,
    byStatus: (status: string) => `/api/users/status/${status}`,
    updateStatus: (id: number) => `/api/users/${id}/status`,
    checkEmail: (email: string) => `/api/users/exists/${encodeURIComponent(email)}`,
  },
  
  // Menu
  menu: {
    base: '/api/menu-items',
    byId: (id: number) => `/api/menu-items/${id}`,
    categories: '/api/menu-items/categories',
    search: (query: string) => `/api/menu-items?search=${encodeURIComponent(query)}`,
    byCategory: (category: string) => `/api/menu-items?category=${encodeURIComponent(category)}`,
  },
  
  // Orders
  orders: {
    base: '/api/orders',
    byId: (id: number) => `/api/orders/${id}`,
    byCustomer: (customerId: number) => `/api/orders/customer/${customerId}`,
    byStatus: (status: string) => `/api/orders/status/${status}`,
    updateStatus: (id: number) => `/api/orders/${id}/status`,
  },
  
  // Payments
  payments: {
    base: '/api/payments',
    byId: (id: number) => `/api/payments/${id}`,
    byOrder: (orderId: number) => `/api/payments/order/${orderId}`,
    byStatus: (status: string) => `/api/payments/status/${status}`,
    process: (id: number) => `/api/payments/${id}/process`,
    refund: (id: number) => `/api/payments/${id}/refund`,
  },
  
  // Reservations
  reservations: {
    base: '/api/reservations',
    byId: (id: number) => `/api/reservations/${id}`,
    byCustomer: (customerId: number) => `/api/reservations/customer/${customerId}`,
    byStatus: (status: string) => `/api/reservations/status/${status}`,
    byDate: (date: string) => `/api/reservations/date/${date}`,
    approve: (id: number, approverId: number) => `/api/reservations/${id}/approve/${approverId}`,
    reject: (id: number) => `/api/reservations/${id}/reject`,
    cancel: (id: number) => `/api/reservations/${id}/cancel`,
    timeSlots: '/api/reservations/time-slots',
    timeslots: (date: string, partySize: number) => `/api/reservations/timeslots?date=${encodeURIComponent(date)}&partySize=${partySize}`,
    availability: (date: string, time: string, partySize: number) => `/api/reservations/availability?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&partySize=${partySize}`,
    test: '/api/reservations/test',
  },
  
  // Cart
  cart: {
    base: '/api/cart',
    items: '/api/cart/items',
    addItem: '/api/cart/items',
    updateItem: (itemId: string) => `/api/cart/items/${itemId}`,
    removeItem: (itemId: string) => `/api/cart/items/${itemId}`,
    clear: '/api/cart/clear',
  },
  
  // Delivery Persons
  deliveryPersons: {
    base: '/api/delivery/persons',
    byId: (id: string) => `/api/delivery/persons/${id}`,
    updateStatus: (id: string) => `/api/delivery/persons/${id}/status`,
    assignments: '/api/delivery/assignments',
  },
  
  // Delivery
  delivery: {
    base: '/api/deliveries',
    byId: (id: string) => `/api/deliveries/${id}`,
    byOrder: (orderId: number) => `/api/deliveries/order/${orderId}`,
    byStatus: (status: string) => `/api/deliveries/status/${status}`,
    updateStatus: (id: string) => `/api/deliveries/${id}/status`,
    assign: (id: string) => `/api/deliveries/${id}/assign`,
    progress: (id: string) => `/api/deliveries/${id}/progress`,
  },
  
  // Delivery Addresses
  deliveryAddresses: {
    base: '/api/delivery-addresses',
    byId: (id: number) => `/api/delivery-addresses/${id}`,
    byUser: (userId: number) => `/api/delivery-addresses/user/${userId}`,
    setDefault: (id: number) => `/api/delivery-addresses/${id}/set-default`,
  },
} as const;

// =============================================================================
// CORS Configuration
// =============================================================================

/**
 * Allowed CORS Origins
 * Should match backend CORS configuration
 */
export const CORS_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://le-restaurant-frontend.azurestaticapps.net',
] as const;

// =============================================================================
// Logging
// =============================================================================

if (ENV.isDevelopment) {
  console.log('🌐 Environment:', ENV.isProduction ? 'Production' : 'Development');
  console.log('🔗 API URL:', ENV.apiUrl);
  console.log('📦 App Version:', ENV.appVersion);
}

