/**
 * API Control Utility
 * 
 * Provides centralized control over API behavior:
 * - Request/response interceptors
 * - Rate limiting
 * - Offline queue management
 * - Request validation
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

import { apiClient } from '../services/apiClient.unified';
import { interceptorManager } from './requestInterceptors';
import { apiRateLimiter, getEndpointRateLimiter } from './rateLimiter';
import { offlineQueue } from './offlineQueue';
import { requestQueue } from './requestQueue';
import { requestCancellationManager } from './requestCancellation';
import { logger } from './logger';

/**
 * API Control Manager
 */
export class ApiControl {
  /**
   * Get interceptor manager
   */
  static getInterceptorManager() {
    return interceptorManager;
  }

  /**
   * Get rate limiter stats
   */
  static getRateLimitStats(endpoint?: string) {
    if (endpoint) {
      return getEndpointRateLimiter(endpoint).getStatus();
    }
    return apiRateLimiter.getStatus();
  }

  /**
   * Reset rate limiter
   */
  static resetRateLimiter(endpoint?: string): void {
    if (endpoint) {
      getEndpointRateLimiter(endpoint).reset();
    } else {
      apiRateLimiter.resetAll();
    }
  }

  /**
   * Get offline queue stats
   */
  static getOfflineQueueStats() {
    return apiClient.getOfflineQueueStats();
  }

  /**
   * Process offline queue
   */
  static async processOfflineQueue(): Promise<void> {
    return apiClient.processOfflineQueue();
  }

  /**
   * Clear offline queue
   */
  static clearOfflineQueue(): void {
    offlineQueue.clear();
    logger.info('Offline queue cleared');
  }

  /**
   * Get circuit breaker stats
   */
  static getCircuitBreakerStats() {
    return apiClient.getCircuitBreakerStats();
  }

  /**
   * Reset circuit breaker
   */
  static resetCircuitBreaker(): void {
    apiClient.resetCircuitBreaker();
    logger.info('Circuit breaker reset');
  }

  /**
   * Get performance stats
   */
  static getPerformanceStats() {
    return apiClient.getPerformanceStats();
  }

  /**
   * Get endpoint performance stats
   */
  static getEndpointPerformanceStats(endpoint: string, method: string = 'GET') {
    return apiClient.getEndpointStats(endpoint, method);
  }

  /**
   * Get request queue stats
   */
  static getQueueStats() {
    return apiClient.getQueueStats();
  }

  /**
   * Get cancellation stats
   */
  static getCancellationStats() {
    return apiClient.getCancellationStats();
  }

  /**
   * Cancel a specific request
   */
  static cancelRequest(requestId: string): boolean {
    return apiClient.cancelRequest(requestId);
  }

  /**
   * Cancel all active requests
   */
  static cancelAllRequests(): number {
    return apiClient.cancelAllRequests();
  }

  /**
   * Cancel requests by endpoint pattern
   */
  static cancelByEndpoint(pattern: string | RegExp): number {
    return apiClient.cancelByEndpoint(pattern);
  }

  /**
   * Get comprehensive API status
   */
  static getApiStatus() {
    return {
      circuitBreaker: this.getCircuitBreakerStats(),
      rateLimit: this.getRateLimitStats(),
      offlineQueue: this.getOfflineQueueStats(),
      queue: this.getQueueStats(),
      cancellation: this.getCancellationStats(),
      performance: this.getPerformanceStats(),
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    };
  }
}

// Export convenience functions
export const {
  getInterceptorManager,
  getRateLimitStats,
  resetRateLimiter,
  getOfflineQueueStats,
  processOfflineQueue,
  clearOfflineQueue,
  getQueueStats,
  getCancellationStats,
  cancelRequest,
  cancelAllRequests,
  cancelByEndpoint,
  getCircuitBreakerStats,
  resetCircuitBreaker,
  getPerformanceStats,
  getEndpointPerformanceStats,
  getApiStatus,
} = ApiControl;

