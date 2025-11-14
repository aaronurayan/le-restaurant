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
      console.warn('Failed to load auth token:', error);
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
   */
  public async checkHealth(): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.health}`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      
      const responseTime = Date.now() - startTime;
      const isHealthy = response.ok;
      
      this.healthStatus = {
        isHealthy,
        baseUrl: this.baseUrl,
        lastChecked: new Date().toISOString(),
        responseTime,
      };
      
      return isHealthy;
    } catch (error) {
      console.warn('Backend health check failed:', error);
      this.healthStatus = {
        isHealthy: false,
        baseUrl: this.baseUrl,
        lastChecked: new Date().toISOString(),
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
   * Execute request with retry logic
   */
  private async executeWithRetry<T>(
    url: string,
    config: RequestInit,
    retries: number,
    requestId: string
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            response.status,
            errorData.message || `HTTP error! status: ${response.status}`,
            requestId,
            url,
            errorData.errors
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on 4xx errors (client errors)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          throw error;
        }
        
        // Retry on network errors or 5xx errors
        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * API_CONFIG.retryDelay;
          console.warn(`Request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries + 1})`);
          await this.delay(delay);
        }
      }
    }

    throw lastError || new ApiError(0, 'Request failed after all retries', requestId);
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
      ...requestConfig
    } = config;

    const requestId = this.generateRequestId();
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = cache ? this.getCacheKey(endpoint, config) : null;
    const dedupeKey = `${requestConfig.method || 'GET'}:${endpoint}`;

    // Check cache first
    if (cache && cacheKey && this.isCacheValid(cacheKey, cacheTTL)) {
      const cached = this.getCachedResponse<T>(cacheKey);
      if (cached) {
        console.log('📦 Using cached response for:', endpoint);
        return cached;
      }
    }

    // Cancel previous identical request if requested
    if (cancelPrevious && this.pendingRequests.has(dedupeKey)) {
      const previousController = this.abortControllers.get(dedupeKey);
      if (previousController) {
        previousController.abort();
        console.log('🚫 Cancelled previous request for:', endpoint);
      }
    }

    // Check for duplicate pending request (deduplication)
    if (this.pendingRequests.has(dedupeKey) && !cancelPrevious) {
      console.log('🔄 Reusing pending request for:', endpoint);
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

        try {
          const data = await this.executeWithRetry<T>(url, finalConfig, retries, requestId);
          
          // Cache response if enabled
          if (cache && cacheKey) {
            this.setCachedResponse(cacheKey, data);
          }
          
          return data;
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        // Log error
        console.error('API request failed:', {
          endpoint,
          requestId,
          error,
        });

        // Try mock data fallback if enabled
        if (useMockData && error instanceof ApiError && error.status >= 500) {
          console.warn('Attempting mock data fallback for:', endpoint);
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

