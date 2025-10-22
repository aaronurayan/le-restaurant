// ===============================================
// Environment Configuration - Azure Production
// ===============================================

/**
 * Get API Base URL based on environment
 * - Production: Azure App Service URL
 * - Development: localhost
 */
export const getApiBaseUrl = (): string => {
  // Check if running in production (Azure Static Web Apps)
  if (import.meta.env.PROD) {
    // Use environment variable if available, otherwise use default
    return import.meta.env.VITE_API_URL || 'https://le-restaurant-backend.azurewebsites.net/api';
  }
  
  // Development environment
  return 'http://localhost:8080/api';
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30 seconds
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Environment Information
 */
export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiUrl: getApiBaseUrl(),
  appVersion: '1.0.0',
};

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  enableDebugMode: import.meta.env.DEV,
  enableAnalytics: import.meta.env.PROD,
  enableErrorReporting: import.meta.env.PROD,
};

console.log('🌐 Environment:', ENV.isProduction ? 'Production' : 'Development');
console.log('🔗 API URL:', ENV.apiUrl);
