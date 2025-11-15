/**
 * Performance Monitoring Utility
 * 
 * Tracks API request performance metrics for observability and optimization.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

export interface PerformanceMetrics {
  endpoint: string;
  method: string;
  duration: number;
  statusCode?: number;
  success: boolean;
  timestamp: number;
  requestId?: string;
  responseSize?: number;
}

export interface PerformanceStats {
  endpoint: string;
  method: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  p50: number;
  p95: number;
  p99: number;
  successRate: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics
  private statsCache: Map<string, PerformanceStats> = new Map();

  /**
   * Record a performance metric
   */
  record(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Invalidate cache for this endpoint
    const cacheKey = `${metric.method}:${metric.endpoint}`;
    this.statsCache.delete(cacheKey);

    // In production, send to monitoring service
    if (import.meta.env.PROD && metric.duration > 5000) {
      // Log slow requests
      this.logSlowRequest(metric);
    }
  }

  /**
   * Get performance stats for an endpoint
   */
  getStats(endpoint: string, method: string = 'GET'): PerformanceStats | null {
    const cacheKey = `${method}:${endpoint}`;
    
    // Check cache
    if (this.statsCache.has(cacheKey)) {
      return this.statsCache.get(cacheKey)!;
    }

    // Filter metrics for this endpoint
    const endpointMetrics = this.metrics.filter(
      m => m.endpoint === endpoint && m.method === method
    );

    if (endpointMetrics.length === 0) {
      return null;
    }

    // Calculate stats
    const durations = endpointMetrics.map(m => m.duration).sort((a, b) => a - b);
    const successful = endpointMetrics.filter(m => m.success);
    const failed = endpointMetrics.filter(m => !m.success);

    const stats: PerformanceStats = {
      endpoint,
      method,
      totalRequests: endpointMetrics.length,
      successfulRequests: successful.length,
      failedRequests: failed.length,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: durations[0],
      maxDuration: durations[durations.length - 1],
      p50: this.percentile(durations, 50),
      p95: this.percentile(durations, 95),
      p99: this.percentile(durations, 99),
      successRate: (successful.length / endpointMetrics.length) * 100,
    };

    // Cache stats
    this.statsCache.set(cacheKey, stats);

    return stats;
  }

  /**
   * Get all endpoint stats
   */
  getAllStats(): PerformanceStats[] {
    const endpointMap = new Map<string, PerformanceMetrics[]>();

    // Group metrics by endpoint and method
    this.metrics.forEach(metric => {
      const key = `${metric.method}:${metric.endpoint}`;
      if (!endpointMap.has(key)) {
        endpointMap.set(key, []);
      }
      endpointMap.get(key)!.push(metric);
    });

    // Calculate stats for each endpoint
    const stats: PerformanceStats[] = [];
    endpointMap.forEach((metrics, key) => {
      const [method, endpoint] = key.split(':');
      const stat = this.getStats(endpoint, method);
      if (stat) {
        stats.push(stat);
      }
    });

    return stats;
  }

  /**
   * Calculate percentile
   */
  private percentile(sortedArray: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, index)];
  }

  /**
   * Log slow request
   */
  private logSlowRequest(metric: PerformanceMetrics): void {
    // TODO: Send to monitoring service
    console.warn('🐌 Slow request detected:', {
      endpoint: metric.endpoint,
      duration: `${metric.duration}ms`,
      method: metric.method,
    });
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.statsCache.clear();
  }

  /**
   * Get metrics summary
   */
  getSummary(): {
    totalRequests: number;
    averageDuration: number;
    successRate: number;
    slowestEndpoints: Array<{ endpoint: string; avgDuration: number }>;
  } {
    if (this.metrics.length === 0) {
      return {
        totalRequests: 0,
        averageDuration: 0,
        successRate: 0,
        slowestEndpoints: [],
      };
    }

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const successful = this.metrics.filter(m => m.success).length;
    const avgDuration = totalDuration / this.metrics.length;
    const successRate = (successful / this.metrics.length) * 100;

    // Get slowest endpoints
    const endpointStats = this.getAllStats();
    const slowestEndpoints = endpointStats
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, 5)
      .map(s => ({
        endpoint: s.endpoint,
        avgDuration: s.averageDuration,
      }));

    return {
      totalRequests: this.metrics.length,
      averageDuration: avgDuration,
      successRate,
      slowestEndpoints,
    };
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

