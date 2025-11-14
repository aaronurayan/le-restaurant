/**
 * Backend-Frontend Connectivity Test
 * 
 * This utility tests the connectivity between frontend and backend
 * by checking various endpoints and configurations.
 */

import { API_ENDPOINTS, API_CONFIG } from '../config/api.config';
import { apiClient } from '../services/apiClient.unified';

export interface ConnectivityResult {
  endpoint: string;
  status: 'success' | 'failed' | 'timeout';
  statusCode?: number;
  message: string;
  responseTime?: number;
}

export interface ConnectivityReport {
  baseUrl: string;
  corsConfigured: boolean;
  endpoints: ConnectivityResult[];
  overallStatus: 'connected' | 'partial' | 'disconnected';
  timestamp: string;
}

/**
 * Test connectivity to backend
 */
export async function testBackendConnectivity(): Promise<ConnectivityReport> {
  const baseUrl = API_CONFIG.baseURL;
  const results: ConnectivityResult[] = [];
  
  // Test endpoints
  const testEndpoints = [
    { name: 'Health Check', endpoint: API_ENDPOINTS.health, method: 'GET' },
    { name: 'Auth Login', endpoint: API_ENDPOINTS.auth.login, method: 'POST' },
    { name: 'Menu Items', endpoint: API_ENDPOINTS.menu.base, method: 'GET' },
    { name: 'Users', endpoint: API_ENDPOINTS.users.base, method: 'GET' },
  ];

  // Test each endpoint
  for (const test of testEndpoints) {
    const startTime = Date.now();
    try {
      const response = await fetch(`${baseUrl}${test.endpoint}`, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      const responseTime = Date.now() - startTime;
      
      results.push({
        endpoint: test.name,
        status: response.ok ? 'success' : 'failed',
        statusCode: response.status,
        message: response.ok 
          ? `Connected (${response.status})` 
          : `Failed (${response.status})`,
        responseTime,
      });
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      const isTimeout = error.name === 'AbortError' || error.name === 'TimeoutError';
      
      results.push({
        endpoint: test.name,
        status: isTimeout ? 'timeout' : 'failed',
        message: isTimeout 
          ? 'Connection timeout' 
          : error.message || 'Connection failed',
        responseTime,
      });
    }
  }

  // Check CORS configuration
  let corsConfigured = false;
  try {
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.health}`, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
      },
    });
    corsConfigured = response.ok || response.status === 204;
  } catch {
    corsConfigured = false;
  }

  // Determine overall status
  const successCount = results.filter(r => r.status === 'success').length;
  const overallStatus = successCount === results.length 
    ? 'connected' 
    : successCount > 0 
      ? 'partial' 
      : 'disconnected';

  return {
    baseUrl,
    corsConfigured,
    endpoints: results,
    overallStatus,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Print connectivity report to console
 */
export function printConnectivityReport(report: ConnectivityReport): void {
  console.log('\n🔍 Backend-Frontend Connectivity Report');
  console.log('='.repeat(50));
  console.log(`Base URL: ${report.baseUrl}`);
  console.log(`CORS Configured: ${report.corsConfigured ? '✅' : '❌'}`);
  console.log(`Overall Status: ${report.overallStatus.toUpperCase()}`);
  console.log(`Timestamp: ${report.timestamp}`);
  console.log('\n📊 Endpoint Test Results:');
  
  report.endpoints.forEach(result => {
    const icon = result.status === 'success' ? '✅' : result.status === 'timeout' ? '⏱️' : '❌';
    const time = result.responseTime ? ` (${result.responseTime}ms)` : '';
    console.log(`  ${icon} ${result.endpoint}: ${result.message}${time}`);
  });
  
  console.log('='.repeat(50));
}

