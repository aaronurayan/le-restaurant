/**
 * Rate Limiter
 * 
 * Prevents API abuse by limiting request frequency.
 * Implements token bucket algorithm for smooth rate limiting.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

export interface RateLimitConfig {
  maxRequests: number;      // Maximum requests in window
  windowMs: number;         // Time window in milliseconds
  burstAllowance?: number;  // Allow burst of requests
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      maxRequests: config.maxRequests,
      windowMs: config.windowMs,
      burstAllowance: config.burstAllowance || Math.floor(config.maxRequests * 0.2),
    };
  }

  /**
   * Check if request is allowed
   */
  check(key: string = 'default'): RateLimitResult {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => now - timestamp < this.config.windowMs);
    
    // Check if limit exceeded
    const remaining = this.config.maxRequests - validRequests.length;
    const allowed = remaining > 0;
    
    // Calculate reset time
    const oldestRequest = validRequests[0];
    const resetTime = oldestRequest 
      ? oldestRequest + this.config.windowMs 
      : now + this.config.windowMs;
    
    // Calculate retry after if limit exceeded
    const retryAfter = !allowed && oldestRequest
      ? Math.ceil((oldestRequest + this.config.windowMs - now) / 1000)
      : undefined;
    
    // Add current request if allowed
    if (allowed) {
      validRequests.push(now);
      this.requests.set(key, validRequests);
    } else {
      this.requests.set(key, validRequests);
    }
    
    return {
      allowed,
      remaining: Math.max(0, remaining),
      resetTime,
      retryAfter,
    };
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string = 'default'): void {
    this.requests.delete(key);
  }

  /**
   * Reset all rate limits
   */
  resetAll(): void {
    this.requests.clear();
  }

  /**
   * Get current rate limit status
   */
  getStatus(key: string = 'default'): RateLimitResult {
    return this.check(key);
  }
}

// Global rate limiter for API requests
export const apiRateLimiter = new RateLimiter({
  maxRequests: 100,      // 100 requests
  windowMs: 60000,       // per minute
  burstAllowance: 20,    // allow 20 burst requests
});

// Per-endpoint rate limiters
const endpointRateLimiters = new Map<string, RateLimiter>();

/**
 * Get or create rate limiter for endpoint
 */
export function getEndpointRateLimiter(endpoint: string, config?: RateLimitConfig): RateLimiter {
  if (!endpointRateLimiters.has(endpoint)) {
    endpointRateLimiters.set(
      endpoint,
      new RateLimiter(config || {
        maxRequests: 30,
        windowMs: 60000,
        burstAllowance: 10,
      })
    );
  }
  return endpointRateLimiters.get(endpoint)!;
}

