/**
 * Offline Request Queue
 * 
 * Queues API requests when offline and replays them when connection is restored.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

export interface QueuedRequest {
  id: string;
  endpoint: string;
  method: string;
  body?: any;
  headers: HeadersInit;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

export interface QueueStats {
  queued: number;
  processing: number;
  failed: number;
  successful: number;
}

class OfflineQueue {
  private queue: QueuedRequest[] = [];
  private processing: boolean = false;
  private stats = {
    queued: 0,
    processing: 0,
    failed: 0,
    successful: 0,
  };
  private maxQueueSize = 100;
  private replayHandler?: (request: QueuedRequest) => Promise<any>;

  /**
   * Set handler for replaying requests
   */
  setReplayHandler(handler: (request: QueuedRequest) => Promise<any>): void {
    this.replayHandler = handler;
  }

  /**
   * Check if online
   */
  isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine;
  }

  /**
   * Add request to queue
   */
  enqueue(request: Omit<QueuedRequest, 'id' | 'timestamp' | 'retries'>): string {
    if (this.queue.length >= this.maxQueueSize) {
      // Remove oldest request
      this.queue.shift();
      this.stats.queued--;
    }

    const queuedRequest: QueuedRequest = {
      ...request,
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retries: 0,
    };

    this.queue.push(queuedRequest);
    this.stats.queued++;

    // Try to process if online
    if (this.isOnline()) {
      this.processQueue();
    }

    return queuedRequest.id;
  }

  /**
   * Process queued requests
   */
  async processQueue(): Promise<void> {
    if (this.processing || !this.isOnline() || !this.replayHandler) {
      return;
    }

    if (this.queue.length === 0) {
      return;
    }

    this.processing = true;
    this.stats.processing = this.queue.length;

    const requests = [...this.queue];
    this.queue = [];

    for (const request of requests) {
      try {
        await this.replayHandler(request);
        this.stats.successful++;
        this.stats.queued--;
      } catch (error) {
        // Re-queue if retries not exhausted
        if (request.retries < request.maxRetries) {
          request.retries++;
          this.queue.push(request);
        } else {
          this.stats.failed++;
          this.stats.queued--;
        }
      }
    }

    this.stats.processing = 0;
    this.processing = false;
  }

  /**
   * Get queue statistics
   */
  getStats(): QueueStats {
    return { ...this.stats };
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue = [];
    this.stats = {
      queued: 0,
      processing: 0,
      failed: 0,
      successful: 0,
    };
  }

  /**
   * Get queued requests
   */
  getQueuedRequests(): QueuedRequest[] {
    return [...this.queue];
  }

  /**
   * Remove request from queue
   */
  remove(requestId: string): boolean {
    const index = this.queue.findIndex(r => r.id === requestId);
    if (index > -1) {
      this.queue.splice(index, 1);
      this.stats.queued--;
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const offlineQueue = new OfflineQueue();

// Listen for online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    offlineQueue.processQueue();
  });

  window.addEventListener('offline', () => {
    // Queue will automatically queue requests when offline
  });
}

