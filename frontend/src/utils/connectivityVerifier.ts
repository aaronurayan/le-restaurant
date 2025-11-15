/**
 * Connectivity Verifier
 * 
 * Comprehensive utility to verify and monitor frontend-backend connectivity.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

import { apiClient } from '../services/apiClient.unified';
import { API_CONFIG, API_ENDPOINTS } from '../config/api.config';
import { logger } from './logger';

export interface ConnectivityStatus {
  connected: boolean;
  baseUrl: string;
  healthCheck: {
    status: 'success' | 'failed' | 'timeout' | 'unknown';
    responseTime?: number;
    lastChecked?: string;
    message?: string;
  };
  endpoints: {
    endpoint: string;
    status: 'success' | 'failed' | 'timeout';
    responseTime?: number;
    statusCode?: number;
  }[];
  cors: {
    configured: boolean;
    allowedOrigins?: string[];
  };
  timestamp: string;
}

export interface ConnectivityOptions {
  timeout?: number;
  testEndpoints?: string[];
  includeCorsCheck?: boolean;
}

/**
 * Verify frontend-backend connectivity
 */
export async function verifyConnectivity(
  options: ConnectivityOptions = {}
): Promise<ConnectivityStatus> {
  const {
    timeout = 5000,
    testEndpoints = [
      API_ENDPOINTS.health,
      API_ENDPOINTS.menu.base,
    ],
    includeCorsCheck = true,
  } = options;

  const baseUrl = API_CONFIG.baseURL;
  const status: ConnectivityStatus = {
    connected: false,
    baseUrl,
    healthCheck: {
      status: 'unknown',
    },
    endpoints: [],
    cors: {
      configured: false,
    },
    timestamp: new Date().toISOString(),
  };

  // 1. Health Check
  try {
    const healthStartTime = Date.now();
    const isHealthy = await apiClient.checkHealth();
    const responseTime = Date.now() - healthStartTime;

    status.healthCheck = {
      status: isHealthy ? 'success' : 'failed',
      responseTime,
      lastChecked: new Date().toISOString(),
      message: isHealthy ? 'Backend is healthy' : 'Backend health check failed',
    };

    status.connected = isHealthy;
  } catch (error) {
    status.healthCheck = {
      status: 'failed',
      lastChecked: new Date().toISOString(),
      message: error instanceof Error ? error.message : 'Health check failed',
    };
  }

  // 2. Test Endpoints
  for (const endpoint of testEndpoints) {
    try {
      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-cache',
      }).catch(() => null);

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (response) {
        status.endpoints.push({
          endpoint,
          status: response.ok ? 'success' : 'failed',
          responseTime,
          statusCode: response.status,
        });
      } else {
        status.endpoints.push({
          endpoint,
          status: 'timeout',
          responseTime,
        });
      }
    } catch (error) {
      status.endpoints.push({
        endpoint,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Request failed',
      });
    }
  }

  // 3. CORS Check
  if (includeCorsCheck) {
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.health}`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
        },
      }).catch(() => null);

      if (response) {
        const allowOrigin = response.headers.get('Access-Control-Allow-Origin');
        status.cors.configured = !!allowOrigin;
        if (allowOrigin) {
          status.cors.allowedOrigins = allowOrigin.split(',').map(s => s.trim());
        }
      }
    } catch (error) {
      // CORS check failed - might not be critical
      logger.debug('CORS check failed', {}, error);
    }
  }

  return status;
}

/**
 * Monitor connectivity continuously
 */
export class ConnectivityMonitor {
  private intervalId: NodeJS.Timeout | null = null;
  private listeners: Set<(status: ConnectivityStatus) => void> = new Set();
  private lastStatus: ConnectivityStatus | null = null;

  /**
   * Start monitoring connectivity
   */
  start(intervalMs: number = 30000, options?: ConnectivityOptions): void {
    if (this.intervalId) {
      this.stop();
    }

    // Initial check
    this.check(options);

    // Periodic checks
    this.intervalId = setInterval(() => {
      this.check(options);
    }, intervalMs);
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Perform connectivity check
   */
  async check(options?: ConnectivityOptions): Promise<ConnectivityStatus> {
    const status = await verifyConnectivity(options);
    this.lastStatus = status;

    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        logger.error('Connectivity listener error', {}, error);
      }
    });

    return status;
  }

  /**
   * Add status change listener
   */
  onStatusChange(listener: (status: ConnectivityStatus) => void): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get last known status
   */
  getLastStatus(): ConnectivityStatus | null {
    return this.lastStatus;
  }

  /**
   * Check if currently monitoring
   */
  isMonitoring(): boolean {
    return this.intervalId !== null;
  }
}

// Export singleton instance
export const connectivityMonitor = new ConnectivityMonitor();

