/**
 * useConnectivity Hook
 * 
 * React hook for monitoring frontend-backend connectivity.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  verifyConnectivity, 
  connectivityMonitor,
  type ConnectivityStatus,
  type ConnectivityOptions 
} from '../utils/connectivityVerifier';

export interface UseConnectivityResult {
  status: ConnectivityStatus | null;
  isConnected: boolean;
  checking: boolean;
  error: Error | null;
  checkConnectivity: (options?: ConnectivityOptions) => Promise<ConnectivityStatus>;
  startMonitoring: (intervalMs?: number, options?: ConnectivityOptions) => void;
  stopMonitoring: () => void;
  isMonitoring: boolean;
}

/**
 * Hook for monitoring frontend-backend connectivity
 */
export function useConnectivity(
  autoCheck: boolean = true,
  autoMonitor: boolean = false,
  monitorInterval: number = 30000
): UseConnectivityResult {
  const [status, setStatus] = useState<ConnectivityStatus | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  /**
   * Check connectivity
   */
  const checkConnectivity = useCallback(async (options?: ConnectivityOptions): Promise<ConnectivityStatus> => {
    setChecking(true);
    setError(null);

    try {
      const connectivityStatus = await verifyConnectivity(options);
      setStatus(connectivityStatus);
      return connectivityStatus;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setChecking(false);
    }
  }, []);

  /**
   * Start monitoring
   */
  const startMonitoring = useCallback((intervalMs: number = monitorInterval, options?: ConnectivityOptions) => {
    connectivityMonitor.start(intervalMs, options);
    setIsMonitoring(true);
  }, [monitorInterval]);

  /**
   * Stop monitoring
   */
  const stopMonitoring = useCallback(() => {
    connectivityMonitor.stop();
    setIsMonitoring(false);
  }, []);

  // Initial check
  useEffect(() => {
    if (autoCheck) {
      checkConnectivity();
    }
  }, [autoCheck, checkConnectivity]);

  // Auto-monitor
  useEffect(() => {
    if (autoMonitor) {
      startMonitoring(monitorInterval);
      return () => {
        stopMonitoring();
      };
    }
  }, [autoMonitor, monitorInterval, startMonitoring, stopMonitoring]);

  // Listen to connectivity monitor
  useEffect(() => {
    const unsubscribe = connectivityMonitor.onStatusChange((newStatus) => {
      setStatus(newStatus);
      setError(null);
    });

    return unsubscribe;
  }, []);

  return {
    status,
    isConnected: status?.connected ?? false,
    checking,
    error,
    checkConnectivity,
    startMonitoring,
    stopMonitoring,
    isMonitoring: connectivityMonitor.isMonitoring(),
  };
}

