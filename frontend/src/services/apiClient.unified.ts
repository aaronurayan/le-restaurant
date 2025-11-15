/**
 * Unified API Client
 * 
 * This is the single, centralized API client for the entire application.
 * It replaces all scattered API clients (api.ts, apiClient.ts, orderService.ts, etc.)
 * 
 * Features:
 * - Environment-aware configuration
 * - Automatic retry with exponential backoff
 * - Request/response interceptors
 * - Error handling and fallback
 * - JWT token management
 * - Request ID tracking
 * - Response caching
 * 
 * @author Le Restaurant Development Team
 * @version 2.0.0
 * @since 2025-01-27
 */

import { API_CONFIG, API_ENDPOINTS, ENV, FEATURE_FLAGS } from '../config/api.config';
import { logger } from '../utils/logger';
import { apiCircuitBreaker } from '../utils/circuitBreaker';
import { performanceMonitor } from '../utils/performanceMonitor';
import { 
  interceptorManager, 
  type RequestContext, 
  type ResponseContext,
  timestampInterceptor,
  clientInfoInterceptor,
  responseDataInterceptor,
  errorNormalizationInterceptor,
} from '../utils/requestInterceptors';
import { apiRateLimiter, getEndpointRateLimiter } from '../utils/rateLimiter';
import { offlineQueue } from '../utils/offlineQueue';
import { validateRequest, ValidationError, type ValidationRule } from '../utils/requestValidator';
import { requestQueue, RequestPriority } from '../utils/requestQueue';
import { requestCancellationManager } from '../utils/requestCancellation';

// =============================================================================
// Type Definitions
// =============================================================================

/**
 * Standard API Response Format
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
  requestId: string;
  errors?: string[];
}

/**
 * API Request Configuration
 */
export interface ApiRequestConfig extends RequestInit {
  timeout?: number;
  cancelPrevious?: boolean; // Cancel previous identical requests
  retries?: number;
  useMockData?: boolean;
  skipAuth?: boolean;
  cache?: boolean;
  cacheTTL?: number; // Time to live in milliseconds
  validate?: Record<string, ValidationRule[]>; // Request validation rules
  skipRateLimit?: boolean; // Skip rate limiting for this request
  skipOfflineQueue?: boolean; // Skip offline queue for this request
  priority?: RequestPriority; // Request priority for queuing
  cancellable?: boolean; // Whether request can be cancelled
  batchable?: boolean; // Whether request can be batched
}

/**
 * API Error Class
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public requestId?: string,
    public endpoint?: string,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Health Status
 */
export interface HealthStatus {
  isHealthy: boolean;
  baseUrl: string;
  lastChecked: string;
  responseTime?: number;
  version?: string;
}

// =============================================================================
// Unified API Client Class
// =============================================================================

class UnifiedApiClient {
  private static instance: UnifiedApiClient;
  private baseUrl: string;
  private authToken: string | null = null;
  private requestCache: Map<string, { data: any; timestamp: number }> = new Map();
  private healthStatus: HealthStatus | null = null;
  private pendingRequests: Map<string, Promise<any>> = new Map();
  private abortControllers: Map<string, AbortController> = new Map();

  private constructor() {
    this.baseUrl = API_CONFIG.baseURL;
    this.loadAuthToken();
    this.setupOfflineQueue();
    this.setupBuiltInInterceptors();
  }

  /**
   * Setup offline queue replay handler
   */
  private setupOfflineQueue(): void {
    offlineQueue.setReplayHandler(async (queuedRequest) => {
      const method = queuedRequest.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch';
      const endpoint = queuedRequest.endpoint.replace(this.baseUrl, '');
      
      // Replay the request
      return this.request(endpoint, {
        method: queuedRequest.method,
        body: queuedRequest.body,
        headers: queuedRequest.headers,
        skipOfflineQueue: true, // Don't queue the replay
      });
    });
  }

  /**
   * Setup built-in interceptors
   */
  private setupBuiltInInterceptors(): void {
    // Add built-in interceptors
    interceptorManager.addRequestInterceptor(timestampInterceptor);
    interceptorManager.addRequestInterceptor(clientInfoInterceptor);
    interceptorManager.addResponseInterceptor(responseDataInterceptor);
    interceptorManager.addErrorInterceptor(errorNormalizationInterceptor);
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): UnifiedApiClient {
    if (!UnifiedApiClient.instance) {
      UnifiedApiClient.instance = new UnifiedApiClient();
    }
    return UnifiedApiClient.instance;
  }

  /**
   * Load authentication token from localStorage
   */
  private loadAuthToken(): void {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        this.authToken = parsed.token || null;
      }
    } catch (error) {
      logger.warn('Failed to load auth token', {}, error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Set authentication token
   */
  public setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  /**
   * Get authentication token
   */
  public getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check backend health
   * Fails silently if backend is not available (no console errors)
   */
  public async checkHealth(): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      // Use AbortController instead of AbortSignal.timeout for better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      // Suppress browser console errors for this fetch
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.health}`, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-cache',
        // Add headers to help with CORS
        headers: {
          'Accept': 'application/json',
        },
      }).catch((fetchError) => {
        // Silently catch network errors (connection refused, etc.)
        // Don't log to console - this is expected when backend is not running
        // Browser will still show network errors, but we won't add to them
        clearTimeout(timeoutId);
        return null;
      });
      
      clearTimeout(timeoutId);
      
      if (!response) {
        // Connection failed - backend not available
        const responseTime = Date.now() - startTime;
        this.healthStatus = {
          isHealthy: false,
          baseUrl: this.baseUrl,
          lastChecked: new Date().toISOString(),
          responseTime,
        };
        return false;
      }
      
      const responseTime = Date.now() - startTime;
      const isHealthy = response.ok;
      
      this.healthStatus = {
        isHealthy,
        baseUrl: this.baseUrl,
        lastChecked: new Date().toISOString(),
        responseTime,
      };
      
      // Only log successful health checks in debug mode
      if (isHealthy) {
        logger.debug('Health check completed', {
          isHealthy,
          responseTime: `${responseTime}ms`,
        });
      }
      
      return isHealthy;
    } catch (error) {
      // Silently handle errors - don't log network connection errors
      // Only log unexpected errors (not fetch/network errors)
      if (error instanceof Error && 
          error.name !== 'AbortError' && 
          !error.message.includes('fetch') &&
          !error.message.includes('network')) {
        logger.warn('Health check failed with unexpected error', {
          baseUrl: this.baseUrl,
        }, error);
      }
      
      const responseTime = Date.now() - startTime;
      this.healthStatus = {
        isHealthy: false,
        baseUrl: this.baseUrl,
        lastChecked: new Date().toISOString(),
        responseTime,
      };
      return false;
    }
  }

  /**
   * Get health status
   */
  public getHealthStatus(): HealthStatus | null {
    return this.healthStatus;
  }

  /**
   * Get cache key from endpoint and config
   */
  private getCacheKey(endpoint: string, config: ApiRequestConfig): string {
    const method = config.method || 'GET';
    const body = config.body ? JSON.stringify(config.body) : '';
    return `${method}:${endpoint}:${body}`;
  }

  /**
   * Check if cached response is still valid
   */
  private isCacheValid(cacheKey: string, ttl: number): boolean {
    const cached = this.requestCache.get(cacheKey);
    if (!cached) return false;
    
    const age = Date.now() - cached.timestamp;
    return age < ttl;
  }

  /**
   * Get cached response
   */
  private getCachedResponse<T>(cacheKey: string): T | null {
    const cached = this.requestCache.get(cacheKey);
    return cached ? cached.data : null;
  }

  /**
   * Set cached response
   */
  private setCachedResponse<T>(cacheKey: string, data: T): void {
    this.requestCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.requestCache.clear();
  }

  /**
   * Execute request with retry logic, circuit breaker, and performance monitoring
   */
  private async executeWithRetry<T>(
    url: string,
    config: RequestInit,
    retries: number,
    requestId: string,
    originalContext?: RequestContext
  ): Promise<T> {
    const startTime = Date.now();
    let lastError: Error | null = null;
    let responseSize = 0;

    // Execute with circuit breaker protection
    return apiCircuitBreaker.execute(async () => {
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          logger.debug('API request attempt', {
            url,
            attempt: attempt + 1,
            requestId,
          });

          // Apply request interceptors
          let finalConfig = config;
          if (originalContext) {
            const transformedContext = await interceptorManager.executeRequestInterceptors({
              ...originalContext,
              url,
              headers: config.headers as HeadersInit,
            });
            finalConfig = {
              ...config,
              headers: transformedContext.headers,
              body: transformedContext.body !== undefined ? transformedContext.body : config.body,
            };
          }

          const response = await fetch(url, finalConfig);
          responseSize = parseInt(response.headers.get('content-length') || '0', 10);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const apiError = new ApiError(
              response.status,
              errorData.message || `HTTP error! status: ${response.status}`,
              requestId,
              url,
              errorData.errors
            );

            // Record performance metric
            const duration = Date.now() - startTime;
            performanceMonitor.record({
              endpoint: url,
              method: (config.method || 'GET').toUpperCase(),
              duration,
              statusCode: response.status,
              success: false,
              timestamp: Date.now(),
              requestId,
              responseSize,
            });

            logger.error('API request failed', {
              url,
              status: response.status,
              requestId,
              attempt: attempt + 1,
            }, apiError);
            
            // Don't retry on 4xx errors (client errors)
            if (response.status >= 400 && response.status < 500) {
              throw apiError;
            }
            
            throw apiError;
          }

          let data = await response.json();
          const duration = Date.now() - startTime;

          // Apply response interceptors
          if (originalContext) {
            const responseContext: ResponseContext = {
              url,
              status: response.status,
              headers: response.headers,
              data,
              requestId,
              timestamp: Date.now(),
              duration,
            };
            const transformedContext = await interceptorManager.executeResponseInterceptors(responseContext);
            data = transformedContext.data;
          }

          // Record performance metric
          performanceMonitor.record({
            endpoint: url,
            method: (config.method || 'GET').toUpperCase(),
            duration,
            statusCode: response.status,
            success: true,
            timestamp: Date.now(),
            requestId,
            responseSize,
          });

          logger.debug('API request successful', {
            url,
            duration: `${duration}ms`,
            requestId,
          });

          return data;
        } catch (error) {
          lastError = error as Error;
          
          // Apply error interceptors
          if (originalContext) {
            lastError = await interceptorManager.executeErrorInterceptors(lastError, originalContext);
          }
          
          // Don't retry on 4xx errors (client errors)
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            throw lastError;
          }
          
          // Retry on network errors or 5xx errors
          if (attempt < retries) {
            const delay = Math.pow(2, attempt) * API_CONFIG.retryDelay;
            logger.warn('Request failed, retrying', {
              url,
              delay: `${delay}ms`,
              attempt: attempt + 1,
              requestId,
            });
            await this.delay(delay);
          }
        }
      }

      // Record final failure
      const duration = Date.now() - startTime;
      performanceMonitor.record({
        endpoint: url,
        method: (config.method || 'GET').toUpperCase(),
        duration,
        success: false,
        timestamp: Date.now(),
        requestId,
        responseSize,
      });

      throw lastError || new ApiError(0, 'Request failed after all retries', requestId);
    });
  }

  /**
   * Main request method
   * Includes request deduplication and cancellation support
   */
  public async request<T>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<T> {
    const {
      timeout = API_CONFIG.timeout,
      retries = API_CONFIG.retries,
      useMockData = FEATURE_FLAGS.enableMockDataFallback,
      skipAuth = false,
      cache = false,
      cacheTTL = 60000, // 1 minute default
      cancelPrevious = false, // Cancel previous identical requests
      validate,
      skipRateLimit = false,
      skipOfflineQueue = false,
      ...requestConfig
    } = config;

    const requestId = this.generateRequestId();
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = cache ? this.getCacheKey(endpoint, config) : null;
    const dedupeKey = `${requestConfig.method || 'GET'}:${endpoint}`;

    // Validate request if validation rules provided
    if (validate && requestConfig.body) {
      try {
        const body = typeof requestConfig.body === 'string' 
          ? JSON.parse(requestConfig.body) 
          : requestConfig.body;
        const validationResult = validateRequest(body, validate);
        if (!validationResult.valid) {
          throw new ValidationError(validationResult.errors);
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          logger.error('Request validation failed', {
            endpoint,
            requestId,
            errors: error.errors,
          });
          throw error;
        }
      }
    }

    // Check rate limiting
    if (!skipRateLimit) {
      const rateLimitResult = getEndpointRateLimiter(endpoint).check();
      if (!rateLimitResult.allowed) {
        const error = new ApiError(
          429,
          `Rate limit exceeded. Retry after ${rateLimitResult.retryAfter}s`,
          requestId,
          url
        );
        logger.warn('Rate limit exceeded', {
          endpoint,
          requestId,
          retryAfter: rateLimitResult.retryAfter,
        });
        throw error;
      }
    }

    // Check if offline and queue request
    if (!skipOfflineQueue && typeof navigator !== 'undefined' && !navigator.onLine) {
      logger.warn('Offline - queuing request', { endpoint, requestId });
      const queueId = offlineQueue.enqueue({
        endpoint,
        method: (requestConfig.method || 'GET').toUpperCase(),
        body: requestConfig.body,
        headers: requestConfig.headers || {},
        maxRetries: retries,
      });
      throw new ApiError(0, 'Request queued for offline processing', requestId, url);
    }

        // Check cache first
        if (cache && cacheKey && this.isCacheValid(cacheKey, cacheTTL)) {
          const cached = this.getCachedResponse<T>(cacheKey);
          if (cached) {
            logger.debug('Using cached response', { endpoint, requestId });
            return cached;
          }
        }

        // Cancel previous identical request if requested
        if (cancelPrevious && this.pendingRequests.has(dedupeKey)) {
          const previousController = this.abortControllers.get(dedupeKey);
          if (previousController) {
            previousController.abort();
            logger.debug('Cancelled previous request', { endpoint, requestId });
          }
        }

        // Check for duplicate pending request (deduplication)
        if (this.pendingRequests.has(dedupeKey) && !cancelPrevious) {
          logger.debug('Reusing pending request', { endpoint, requestId });
          return this.pendingRequests.get(dedupeKey)!;
        }

    // Create abort controller for this request
    const abortController = new AbortController();
    this.abortControllers.set(dedupeKey, abortController);

    // Create request promise
    const requestPromise = (async (): Promise<T> => {
      try {
        // Build headers
        const headers: HeadersInit = {
          ...API_CONFIG.headers,
          'X-Request-ID': requestId,
          ...requestConfig.headers,
        };

        // Add auth token if available
        if (!skipAuth && this.authToken) {
          headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        // Create timeout signal
        const timeoutId = setTimeout(() => {
          abortController.abort();
        }, timeout);

        // Build request config
        const finalConfig: RequestInit = {
          ...requestConfig,
          headers,
          signal: abortController.signal,
        };

        // Unregister from cancellation manager after request completes
        const cleanup = () => {
          if (cancellable) {
            requestCancellationManager.unregister(requestId);
          }
        };

        // Create request context for interceptors
        const requestContext: RequestContext = {
          url,
          method: (requestConfig.method || 'GET').toUpperCase(),
          headers: finalConfig.headers as HeadersInit,
          body: finalConfig.body,
          endpoint,
          requestId,
          timestamp: Date.now(),
        };

        try {
          const data = await this.executeWithRetry<T>(url, finalConfig, retries, requestId, requestContext);
          
          // Cache response if enabled
          if (cache && cacheKey) {
            this.setCachedResponse(cacheKey, data);
          }
          
          return data;
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        // Log error with structured logging
        logger.error('API request failed', {
          endpoint,
          requestId,
          method: requestConfig.method || 'GET',
        }, error instanceof Error ? error : new Error(String(error)));

        // Try mock data fallback if enabled
        if (useMockData && error instanceof ApiError && error.status >= 500) {
          logger.warn('Attempting mock data fallback', { endpoint, requestId });
          // Mock data fallback would be handled by the calling service
        }

        throw error;
      } finally {
        // Clean up
        this.pendingRequests.delete(dedupeKey);
        this.abortControllers.delete(dedupeKey);
      }
    })();

    // Store pending request for deduplication
    this.pendingRequests.set(dedupeKey, requestPromise);

    return requestPromise;
  }

  /**
   * GET request helper
   */
  public async get<T>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request helper
   */
  public async post<T>(endpoint: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request helper
   */
  public async put<T>(endpoint: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request helper
   */
  public async patch<T>(endpoint: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request helper
   */
  public async delete<T>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Get base URL
   */
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Get performance statistics
   */
  public getPerformanceStats() {
    return performanceMonitor.getSummary();
  }

  /**
   * Get performance stats for specific endpoint
   */
  public getEndpointStats(endpoint: string, method: string = 'GET') {
    return performanceMonitor.getStats(endpoint, method);
  }

  /**
   * Get circuit breaker statistics
   */
  public getCircuitBreakerStats() {
    return apiCircuitBreaker.getStats();
  }

  /**
   * Reset circuit breaker
   */
  public resetCircuitBreaker(): void {
    apiCircuitBreaker.reset();
  }

  /**
   * Get interceptor manager (for adding custom interceptors)
   */
  public getInterceptorManager() {
    return interceptorManager;
  }

  /**
   * Get offline queue stats
   */
  public getOfflineQueueStats() {
    return offlineQueue.getStats();
  }

  /**
   * Process offline queue
   */
  public async processOfflineQueue(): Promise<void> {
    return offlineQueue.processQueue();
  }

  /**
   * Cancel a specific request
   */
  public cancelRequest(requestId: string): boolean {
    return requestCancellationManager.cancel(requestId);
  }

  /**
   * Cancel all active requests
   */
  public cancelAllRequests(): number {
    return requestCancellationManager.cancelAll();
  }

  /**
   * Cancel requests by endpoint pattern
   */
  public cancelByEndpoint(pattern: string | RegExp): number {
    return requestCancellationManager.cancelByEndpoint(pattern);
  }

  /**
   * Get request cancellation stats
   */
  public getCancellationStats() {
    return requestCancellationManager.getStats();
  }

  /**
   * Get request queue stats
   */
  public getQueueStats() {
    return requestQueue.getStats();
  }
}

// =============================================================================
// Export Singleton Instance
// =============================================================================

export const apiClient = UnifiedApiClient.getInstance();

// =============================================================================
// Convenience Functions
// =============================================================================

/**
 * Check backend health (convenience function)
 */
export const checkBackendHealth = (): Promise<boolean> => {
  return apiClient.checkHealth();
};

/**
 * Get API base URL (convenience function)
 */
export const getApiBaseUrl = (): string => {
  return apiClient.getBaseUrl();
};

