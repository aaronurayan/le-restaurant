/**
 * Request Cancellation Manager
 * 
 * Manages request cancellation and abort controllers.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

export interface CancellableRequest {
  id: string;
  abortController: AbortController;
  endpoint: string;
  method: string;
  timestamp: number;
  onCancel?: () => void;
}

class RequestCancellationManager {
  private activeRequests: Map<string, CancellableRequest> = new Map();
  private cancelledRequests: Set<string> = new Set();

  /**
   * Register a cancellable request
   */
  register(
    id: string,
    abortController: AbortController,
    endpoint: string,
    method: string,
    onCancel?: () => void
  ): void {
    this.activeRequests.set(id, {
      id,
      abortController,
      endpoint,
      method,
      timestamp: Date.now(),
      onCancel,
    });
  }

  /**
   * Cancel a specific request
   */
  cancel(id: string): boolean {
    const request = this.activeRequests.get(id);
    if (request) {
      request.abortController.abort();
      if (request.onCancel) {
        request.onCancel();
      }
      this.activeRequests.delete(id);
      this.cancelledRequests.add(id);
      return true;
    }
    return false;
  }

  /**
   * Cancel all requests
   */
  cancelAll(): number {
    let count = 0;
    for (const [id, request] of this.activeRequests) {
      request.abortController.abort();
      if (request.onCancel) {
        request.onCancel();
      }
      this.cancelledRequests.add(id);
      count++;
    }
    this.activeRequests.clear();
    return count;
  }

  /**
   * Cancel requests by endpoint pattern
   */
  cancelByEndpoint(pattern: string | RegExp): number {
    let count = 0;
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    for (const [id, request] of this.activeRequests) {
      if (regex.test(request.endpoint)) {
        request.abortController.abort();
        if (request.onCancel) {
          request.onCancel();
        }
        this.activeRequests.delete(id);
        this.cancelledRequests.add(id);
        count++;
      }
    }
    return count;
  }

  /**
   * Cancel requests by method
   */
  cancelByMethod(method: string): number {
    let count = 0;
    const upperMethod = method.toUpperCase();

    for (const [id, request] of this.activeRequests) {
      if (request.method.toUpperCase() === upperMethod) {
        request.abortController.abort();
        if (request.onCancel) {
          request.onCancel();
        }
        this.activeRequests.delete(id);
        this.cancelledRequests.add(id);
        count++;
      }
    }
    return count;
  }

  /**
   * Unregister a request (when completed)
   */
  unregister(id: string): void {
    this.activeRequests.delete(id);
  }

  /**
   * Check if request is cancelled
   */
  isCancelled(id: string): boolean {
    return this.cancelledRequests.has(id);
  }

  /**
   * Check if request is active
   */
  isActive(id: string): boolean {
    return this.activeRequests.has(id);
  }

  /**
   * Get active requests
   */
  getActiveRequests(): CancellableRequest[] {
    return Array.from(this.activeRequests.values());
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      active: this.activeRequests.size,
      cancelled: this.cancelledRequests.size,
      byMethod: {
        GET: Array.from(this.activeRequests.values()).filter(r => r.method.toUpperCase() === 'GET').length,
        POST: Array.from(this.activeRequests.values()).filter(r => r.method.toUpperCase() === 'POST').length,
        PUT: Array.from(this.activeRequests.values()).filter(r => r.method.toUpperCase() === 'PUT').length,
        DELETE: Array.from(this.activeRequests.values()).filter(r => r.method.toUpperCase() === 'DELETE').length,
        PATCH: Array.from(this.activeRequests.values()).filter(r => r.method.toUpperCase() === 'PATCH').length,
      },
    };
  }

  /**
   * Clear cancelled requests history
   */
  clearCancelledHistory(): void {
    this.cancelledRequests.clear();
  }

  /**
   * Cleanup old requests (older than specified time)
   */
  cleanup(maxAge: number = 60000): number {
    const now = Date.now();
    let count = 0;

    for (const [id, request] of this.activeRequests) {
      if (now - request.timestamp > maxAge) {
        request.abortController.abort();
        if (request.onCancel) {
          request.onCancel();
        }
        this.activeRequests.delete(id);
        this.cancelledRequests.add(id);
        count++;
      }
    }
    return count;
  }
}

// Export singleton instance
export const requestCancellationManager = new RequestCancellationManager();

