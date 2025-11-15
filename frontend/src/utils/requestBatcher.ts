/**
 * Request Batcher
 * 
 * Batches multiple requests into a single request to reduce network overhead.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

export interface BatchRequest {
  id: string;
  endpoint: string;
  method: string;
  body?: any;
  headers?: HeadersInit;
}

export interface BatchResponse {
  id: string;
  data?: any;
  error?: Error;
}

export interface BatchConfig {
  maxBatchSize: number;      // Maximum requests per batch
  maxWaitTime: number;       // Maximum wait time before sending batch (ms)
  batchEndpoint: string;      // Endpoint for batch requests
}

class RequestBatcher {
  private pendingBatch: Map<string, BatchRequest> = new Map();
  private batchTimer: NodeJS.Timeout | null = null;
  private config: BatchConfig;
  private resolveCallbacks: Map<string, { resolve: (value: any) => void; reject: (error: Error) => void }> = new Map();

  constructor(config: BatchConfig) {
    this.config = {
      maxBatchSize: config.maxBatchSize,
      maxWaitTime: config.maxWaitTime,
      batchEndpoint: config.batchEndpoint,
    };
  }

  /**
   * Add request to batch
   */
  async addToBatch<T>(
    endpoint: string,
    method: string,
    body?: any,
    headers?: HeadersInit
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const id = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const request: BatchRequest = {
        id,
        endpoint,
        method,
        body,
        headers,
      };

      this.pendingBatch.set(id, request);
      this.resolveCallbacks.set(id, { resolve, reject });

      // Check if batch is full
      if (this.pendingBatch.size >= this.config.maxBatchSize) {
        this.sendBatch();
      } else {
        // Schedule batch send
        this.scheduleBatch();
      }
    });
  }

  /**
   * Schedule batch send
   */
  private scheduleBatch(): void {
    if (this.batchTimer) {
      return; // Already scheduled
    }

    this.batchTimer = setTimeout(() => {
      this.sendBatch();
    }, this.config.maxWaitTime);
  }

  /**
   * Send batch
   */
  private async sendBatch(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    if (this.pendingBatch.size === 0) {
      return;
    }

    const batch = Array.from(this.pendingBatch.values());
    const callbacks = new Map(this.resolveCallbacks);
    
    // Clear pending batch
    this.pendingBatch.clear();
    this.resolveCallbacks.clear();

    try {
      // Send batch request
      const response = await fetch(this.config.batchEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: batch,
        }),
      });

      if (!response.ok) {
        throw new Error(`Batch request failed: ${response.status}`);
      }

      const results: BatchResponse[] = await response.json();

      // Resolve/reject individual requests
      for (const result of results) {
        const callback = callbacks.get(result.id);
        if (callback) {
          if (result.error) {
            callback.reject(result.error);
          } else {
            callback.resolve(result.data);
          }
        }
      }
    } catch (error) {
      // Reject all requests in batch
      for (const [id, callback] of callbacks) {
        callback.reject(error as Error);
      }
    }
  }

  /**
   * Force send batch immediately
   */
  async flush(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    await this.sendBatch();
  }

  /**
   * Clear pending batch
   */
  clear(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    // Reject all pending requests
    for (const [id, callback] of this.resolveCallbacks) {
      callback.reject(new Error('Batch cleared'));
    }

    this.pendingBatch.clear();
    this.resolveCallbacks.clear();
  }

  /**
   * Get batch stats
   */
  getStats() {
    return {
      pending: this.pendingBatch.size,
      maxBatchSize: this.config.maxBatchSize,
      maxWaitTime: this.config.maxWaitTime,
    };
  }
}

// Export singleton instance (disabled by default - requires backend support)
export const requestBatcher = new RequestBatcher({
  maxBatchSize: 10,
  maxWaitTime: 100,
  batchEndpoint: '/api/batch',
});

