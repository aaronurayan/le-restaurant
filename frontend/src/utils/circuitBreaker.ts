/**
 * Circuit Breaker Pattern Implementation
 * 
 * Prevents cascading failures by stopping requests to failing services
 * and allowing them to recover.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

export enum CircuitState {
  CLOSED = 'CLOSED',      // Normal operation
  OPEN = 'OPEN',          // Failing, reject requests immediately
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

export interface CircuitBreakerConfig {
  failureThreshold: number;      // Number of failures before opening
  successThreshold: number;      // Number of successes to close from half-open
  timeout: number;               // Time in ms before attempting recovery
  resetTimeout: number;          // Time in ms before transitioning from open to half-open
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  totalRequests: number;
  totalFailures: number;
  totalSuccesses: number;
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private successes: number = 0;
  private lastFailureTime?: number;
  private lastSuccessTime?: number;
  private totalRequests: number = 0;
  private totalFailures: number = 0;
  private totalSuccesses: number = 0;
  private config: CircuitBreakerConfig;
  private resetTimer?: number;

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      failureThreshold: config.failureThreshold ?? 5,
      successThreshold: config.successThreshold ?? 2,
      timeout: config.timeout ?? 60000, // 1 minute
      resetTimeout: config.resetTimeout ?? 30000, // 30 seconds
    };
  }

  /**
   * Execute function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.totalRequests++;

    // Check if circuit is open and should attempt recovery
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptRecovery()) {
        this.transitionToHalfOpen();
      } else {
        throw new Error('Circuit breaker is OPEN - service unavailable');
      }
    }

    try {
      const result = await Promise.race([
        fn(),
        this.createTimeoutPromise(),
      ]);

      this.onSuccess();
      return result as T;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Check if should attempt recovery
   */
  private shouldAttemptRecovery(): boolean {
    if (!this.lastFailureTime) return true;
    return Date.now() - this.lastFailureTime >= this.config.resetTimeout;
  }

  /**
   * Create timeout promise
   */
  private createTimeoutPromise(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout'));
      }, this.config.timeout);
    });
  }

  /**
   * Handle successful request
   */
  private onSuccess(): void {
    this.lastSuccessTime = Date.now();
    this.totalSuccesses++;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successes++;
      if (this.successes >= this.config.successThreshold) {
        this.transitionToClosed();
      }
    } else if (this.state === CircuitState.CLOSED) {
      // Reset failure count on success (exponential backoff reset)
      this.failures = Math.max(0, this.failures - 1);
    }
  }

  /**
   * Handle failed request
   */
  private onFailure(): void {
    this.lastFailureTime = Date.now();
    this.totalFailures++;
    this.failures++;

    if (this.state === CircuitState.HALF_OPEN) {
      // Failed during half-open, go back to open
      this.transitionToOpen();
    } else if (this.state === CircuitState.CLOSED) {
      if (this.failures >= this.config.failureThreshold) {
        this.transitionToOpen();
      }
    }
  }

  /**
   * Transition to closed state
   */
  private transitionToClosed(): void {
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    this.successes = 0;
    this.clearResetTimer();
  }

  /**
   * Transition to open state
   */
  private transitionToOpen(): void {
    this.state = CircuitState.OPEN;
    this.successes = 0;
    this.scheduleRecoveryAttempt();
  }

  /**
   * Transition to half-open state
   */
  private transitionToHalfOpen(): void {
    this.state = CircuitState.HALF_OPEN;
    this.failures = 0;
    this.successes = 0;
    this.clearResetTimer();
  }

  /**
   * Schedule recovery attempt
   */
  private scheduleRecoveryAttempt(): void {
    this.clearResetTimer();
    this.resetTimer = window.setTimeout(() => {
      this.transitionToHalfOpen();
    }, this.config.resetTimeout);
  }

  /**
   * Clear reset timer
   */
  private clearResetTimer(): void {
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = undefined;
    }
  }

  /**
   * Get current stats
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      totalRequests: this.totalRequests,
      totalFailures: this.totalFailures,
      totalSuccesses: this.totalSuccesses,
    };
  }

  /**
   * Reset circuit breaker
   */
  reset(): void {
    this.transitionToClosed();
    this.totalRequests = 0;
    this.totalFailures = 0;
    this.totalSuccesses = 0;
  }
}

// Export singleton instance for API client
export const apiCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 30000,
  resetTimeout: 60000,
});

