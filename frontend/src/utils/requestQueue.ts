/**
 * Request Queue Manager
 * 
 * Manages request queuing with priority support, batching, and deduplication.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

export enum RequestPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  URGENT = 3,
}

export interface QueuedRequestItem {
  id: string;
  endpoint: string;
  method: string;
  body?: any;
  headers: HeadersInit;
  priority: RequestPriority;
  timestamp: number;
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  abortController?: AbortController;
}

export interface QueueConfig {
  maxConcurrent: number;        // Maximum concurrent requests
  maxQueueSize: number;         // Maximum queue size
  batchSize?: number;           // Batch size for batching
  batchDelay?: number;           // Delay before processing batch (ms)
  enableDeduplication?: boolean; // Enable request deduplication
}

class RequestQueue {
  private queue: QueuedRequestItem[] = [];
  private processing: Set<string> = new Set();
  private config: QueueConfig;
  private batchTimer: NodeJS.Timeout | null = null;
  private pendingBatch: QueuedRequestItem[] = [];

  constructor(config: QueueConfig) {
    this.config = {
      maxConcurrent: config.maxConcurrent,
      maxQueueSize: config.maxQueueSize,
      batchSize: config.batchSize || 10,
      batchDelay: config.batchDelay || 100,
      enableDeduplication: config.enableDeduplication ?? true,
    };
  }

  /**
   * Generate request key for deduplication
   */
  private getRequestKey(item: Omit<QueuedRequestItem, 'id' | 'resolve' | 'reject' | 'timestamp' | 'abortController'>): string {
    return `${item.method}:${item.endpoint}:${JSON.stringify(item.body || {})}`;
  }

  /**
   * Check if request is duplicate
   */
  private isDuplicate(item: QueuedRequestItem): boolean {
    if (!this.config.enableDeduplication) {
      return false;
    }

    const key = this.getRequestKey(item);
    return this.queue.some(req => 
      this.getRequestKey(req) === key && req.id !== item.id
    ) || this.processing.has(key);
  }

  /**
   * Add request to queue
   */
  async enqueue<T>(
    endpoint: string,
    method: string,
    body: any,
    headers: HeadersInit,
    priority: RequestPriority = RequestPriority.NORMAL,
    abortController?: AbortController
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // Check queue size
      if (this.queue.length >= this.config.maxQueueSize) {
        // Remove lowest priority item
        const lowestPriorityIndex = this.queue.findIndex(
          item => item.priority === Math.min(...this.queue.map(i => i.priority))
        );
        if (lowestPriorityIndex > -1) {
          const removed = this.queue.splice(lowestPriorityIndex, 1)[0];
          removed.reject(new Error('Request queue full, lowest priority request removed'));
        }
      }

      const item: QueuedRequestItem = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        endpoint,
        method,
        body,
        headers,
        priority,
        timestamp: Date.now(),
        resolve,
        reject,
        abortController,
      };

      // Check for duplicates
      if (this.isDuplicate(item)) {
        // Find existing request and attach to it
        const key = this.getRequestKey(item);
        const existing = this.queue.find(req => this.getRequestKey(req) === key);
        if (existing) {
          // Resolve with same promise
          existing.resolve = (value) => {
            existing.resolve(value);
            resolve(value);
          };
          existing.reject = (error) => {
            existing.reject(error);
            reject(error);
          };
          return;
        }
      }

      // Insert based on priority (higher priority first, then FIFO)
      const insertIndex = this.queue.findIndex(
        req => req.priority < priority || (req.priority === priority && req.timestamp > item.timestamp)
      );
      if (insertIndex === -1) {
        this.queue.push(item);
      } else {
        this.queue.splice(insertIndex, 0, item);
      }

      // Process queue
      this.processQueue();
    });
  }

  /**
   * Process queue
   */
  private async processQueue(): Promise<void> {
    // Check if we can process more
    if (this.processing.size >= this.config.maxConcurrent) {
      return;
    }

    // Check if we should batch
    if (this.config.batchSize && this.config.batchSize > 1) {
      this.scheduleBatch();
      return;
    }

    // Process immediately
    while (this.processing.size < this.config.maxConcurrent && this.queue.length > 0) {
      const item = this.queue.shift()!;
      this.processItem(item);
    }
  }

  /**
   * Schedule batch processing
   */
  private scheduleBatch(): void {
    if (this.batchTimer) {
      return; // Batch already scheduled
    }

    this.batchTimer = setTimeout(() => {
      this.batchTimer = null;
      this.processBatch();
    }, this.config.batchDelay);
  }

  /**
   * Process batch
   */
  private async processBatch(): Promise<void> {
    const batch: QueuedRequestItem[] = [];
    
    // Collect items for batch
    while (
      batch.length < (this.config.batchSize || 10) &&
      this.queue.length > 0 &&
      this.processing.size + batch.length < this.config.maxConcurrent
    ) {
      batch.push(this.queue.shift()!);
    }

    // Process batch
    for (const item of batch) {
      this.processItem(item);
    }
  }

  /**
   * Process individual item
   */
  private async processItem(item: QueuedRequestItem): Promise<void> {
    const key = this.getRequestKey(item);
    this.processing.add(key);

    // Check if aborted
    if (item.abortController?.signal.aborted) {
      this.processing.delete(key);
      item.reject(new Error('Request aborted'));
      return;
    }

    // Process request (this will be handled by the caller)
    // The actual fetch will be done by the API client
    // This queue just manages the order and priority
  }

  /**
   * Mark request as complete
   */
  complete(key: string): void {
    this.processing.delete(key);
    this.processQueue();
  }

  /**
   * Cancel request
   */
  cancel(id: string): boolean {
    const index = this.queue.findIndex(item => item.id === id);
    if (index > -1) {
      const item = this.queue.splice(index, 1)[0];
      item.reject(new Error('Request cancelled'));
      return true;
    }
    return false;
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue.forEach(item => {
      item.reject(new Error('Queue cleared'));
    });
    this.queue = [];
    this.processing.clear();
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
  }

  /**
   * Get queue stats
   */
  getStats() {
    return {
      queued: this.queue.length,
      processing: this.processing.size,
      maxConcurrent: this.config.maxConcurrent,
      maxQueueSize: this.config.maxQueueSize,
      byPriority: {
        [RequestPriority.URGENT]: this.queue.filter(r => r.priority === RequestPriority.URGENT).length,
        [RequestPriority.HIGH]: this.queue.filter(r => r.priority === RequestPriority.HIGH).length,
        [RequestPriority.NORMAL]: this.queue.filter(r => r.priority === RequestPriority.NORMAL).length,
        [RequestPriority.LOW]: this.queue.filter(r => r.priority === RequestPriority.LOW).length,
      },
    };
  }

  /**
   * Get next item to process (for external processing)
   */
  getNextItem(): QueuedRequestItem | null {
    if (this.processing.size >= this.config.maxConcurrent) {
      return null;
    }
    return this.queue.shift() || null;
  }
}

// Export singleton instance
export const requestQueue = new RequestQueue({
  maxConcurrent: 10,
  maxQueueSize: 100,
  batchSize: 5,
  batchDelay: 50,
  enableDeduplication: true,
});

