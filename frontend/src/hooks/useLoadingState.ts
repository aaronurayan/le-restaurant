/**
 * Loading State Hook
 * 
 * Provides unified loading state management across the application.
 * Supports multiple concurrent loading operations with unique keys.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-11-15
 */

import { useState, useCallback, useMemo } from 'react';

/**
 * Hook for managing loading states
 * 
 * @example
 * const { setLoading, isLoading, withLoading } = useLoadingState();
 * 
 * // Set loading for a specific operation
 * setLoading('fetchingOrders', true);
 * 
 * // Check if any operation is loading
 * if (isLoading()) { ... }
 * 
 * // Check if specific operation is loading
 * if (isLoading('fetchingOrders')) { ... }
 * 
 * // Execute async function with automatic loading state
 * const data = await withLoading('fetchingOrders', async () => {
 *   return await fetchOrders();
 * });
 */
export const useLoadingState = () => {
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(new Map());

  /**
   * Set loading state for a specific key
   */
  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => {
      const next = new Map(prev);
      if (loading) {
        next.set(key, true);
      } else {
        next.delete(key);
      }
      return next;
    });
  }, []);

  /**
   * Check if any or specific operation is loading
   */
  const isLoading = useCallback((key?: string): boolean => {
    if (key) {
      return loadingStates.get(key) || false;
    }
    return loadingStates.size > 0;
  }, [loadingStates]);

  /**
   * Execute async function with automatic loading state management
   */
  const withLoading = useCallback(async <T,>(
    key: string,
    asyncFn: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(key, true);
    try {
      return await asyncFn();
    } catch (error) {
      // Re-throw error so caller can handle it
      throw error;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  /**
   * Get all active loading keys
   */
  const activeLoadingKeys = useMemo(() => {
    return Array.from(loadingStates.keys());
  }, [loadingStates]);

  /**
   * Clear all loading states
   */
  const clearAll = useCallback(() => {
    setLoadingStates(new Map());
  }, []);

  return {
    setLoading,
    isLoading,
    withLoading,
    activeLoadingKeys,
    clearAll,
  };
};

