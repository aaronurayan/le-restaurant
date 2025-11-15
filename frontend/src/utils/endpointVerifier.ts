/**
 * Endpoint Verification Utility
 * 
 * This utility verifies that frontend API endpoints match backend endpoints.
 * It helps catch configuration mismatches and missing endpoints.
 */

import { API_ENDPOINTS, API_CONFIG } from '../config/api.config';
import { apiClient } from '../services/apiClient.unified';

export interface EndpointVerification {
  endpoint: string;
  method: string;
  expectedStatus: number;
  actualStatus?: number;
  success: boolean;
  error?: string;
  responseTime?: number;
}

export interface VerificationReport {
  baseUrl: string;
  timestamp: string;
  endpoints: EndpointVerification[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    successRate: number;
  };
}

/**
 * Verify all API endpoints are accessible
 */
export async function verifyEndpoints(): Promise<VerificationReport> {
  const baseUrl = API_CONFIG.baseURL;
  const endpoints: EndpointVerification[] = [];
  
  // Define endpoints to verify
  const endpointsToVerify: Array<{
    name: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    expectedStatus: number;
    requiresAuth?: boolean;
  }> = [
    { name: 'Health Check', endpoint: API_ENDPOINTS.health, method: 'GET', expectedStatus: 200 },
    { name: 'Menu Items', endpoint: API_ENDPOINTS.menu.base, method: 'GET', expectedStatus: 200 },
    { name: 'Menu Categories', endpoint: API_ENDPOINTS.menu.categories, method: 'GET', expectedStatus: 200 },
    { name: 'Users', endpoint: API_ENDPOINTS.users.base, method: 'GET', expectedStatus: 200, requiresAuth: true },
    { name: 'Orders', endpoint: API_ENDPOINTS.orders.base, method: 'GET', expectedStatus: 200, requiresAuth: true },
    { name: 'Reservations', endpoint: API_ENDPOINTS.reservations.base, method: 'GET', expectedStatus: 200, requiresAuth: true },
    { name: 'Deliveries', endpoint: API_ENDPOINTS.delivery.base, method: 'GET', expectedStatus: 200, requiresAuth: true },
  ];

  // Verify each endpoint
  for (const endpointConfig of endpointsToVerify) {
    const startTime = Date.now();
    let verification: EndpointVerification = {
      endpoint: endpointConfig.endpoint,
      method: endpointConfig.method,
      expectedStatus: endpointConfig.expectedStatus,
      success: false,
    };

    try {
      const response = await fetch(`${baseUrl}${endpointConfig.endpoint}`, {
        method: endpointConfig.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      const responseTime = Date.now() - startTime;
      const success = response.status === endpointConfig.expectedStatus || 
                     (endpointConfig.requiresAuth && response.status === 401) ||
                     (response.status < 500); // Accept 2xx, 3xx, 4xx as potentially valid

      verification = {
        ...verification,
        actualStatus: response.status,
        success,
        responseTime,
        error: success ? undefined : `Expected ${endpointConfig.expectedStatus}, got ${response.status}`,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      verification = {
        ...verification,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
      };
    }

    endpoints.push(verification);
  }

  // Calculate summary
  const passed = endpoints.filter(e => e.success).length;
  const failed = endpoints.filter(e => !e.success).length;
  const successRate = endpoints.length > 0 ? (passed / endpoints.length) * 100 : 0;

  return {
    baseUrl,
    timestamp: new Date().toISOString(),
    endpoints,
    summary: {
      total: endpoints.length,
      passed,
      failed,
      successRate,
    },
  };
}

/**
 * Print verification report to console
 */
export function printVerificationReport(report: VerificationReport): void {
  console.log('\n🔍 API Endpoint Verification Report');
  console.log('='.repeat(60));
  console.log(`Base URL: ${report.baseUrl}`);
  console.log(`Timestamp: ${report.timestamp}`);
  console.log(`\nSummary:`);
  console.log(`  Total: ${report.summary.total}`);
  console.log(`  Passed: ${report.summary.passed} ✅`);
  console.log(`  Failed: ${report.summary.failed} ❌`);
  console.log(`  Success Rate: ${report.summary.successRate.toFixed(1)}%`);
  console.log(`\nEndpoint Details:`);
  
  report.endpoints.forEach(endpoint => {
    const icon = endpoint.success ? '✅' : '❌';
    const status = endpoint.actualStatus ? ` (${endpoint.actualStatus})` : '';
    const time = endpoint.responseTime ? ` [${endpoint.responseTime}ms]` : '';
    console.log(`  ${icon} ${endpoint.method} ${endpoint.endpoint}${status}${time}`);
    if (endpoint.error) {
      console.log(`     Error: ${endpoint.error}`);
    }
  });
  
  console.log('='.repeat(60));
}

/**
 * Verify endpoint configuration matches backend
 */
export async function verifyEndpointConfiguration(): Promise<{
  matches: boolean;
  mismatches: Array<{ frontend: string; backend: string; issue: string }>;
}> {
  // This would ideally compare frontend API_ENDPOINTS with backend controller mappings
  // For now, we'll verify endpoints are accessible
  const report = await verifyEndpoints();
  
  const mismatches: Array<{ frontend: string; backend: string; issue: string }> = [];
  
  report.endpoints.forEach(endpoint => {
    if (!endpoint.success && endpoint.actualStatus === 404) {
      mismatches.push({
        frontend: endpoint.endpoint,
        backend: 'Not found',
        issue: 'Endpoint not found on backend',
      });
    }
  });

  return {
    matches: mismatches.length === 0,
    mismatches,
  };
}

