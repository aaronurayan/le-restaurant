/**
 * Base API Hook
 * 
 * This hook provides common functionality for all API operations:
 * - Loading state management
 * - Error handling
 * - Backend connection status
 * - Mock data fallback
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import { useState, useCallback } from 'react';
import { apiClient, ApiError } from '../utils/apiClient';

// =============================================================================
// Type Definitions
// =============================================================================

/**
 * Base API state interface
 * All API hooks should extend this interface
 */
export interface BaseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isBackendConnected: boolean;
}

/**
 * API operation result
 * Used for operations that don't return data (create, update, delete)
 */
export interface ApiOperationResult {
  success: boolean;
  error: string | null;
}

// =============================================================================
// Base API Hook
// =============================================================================

/**
 * Base API hook that provides common functionality for all API operations
 * 
 * This hook handles:
 * - Loading state management
 * - Error handling and display
 * - Backend connection status checking
 * - Mock data fallback when backend is unavailable
 * 
 * @template T The type of data this hook manages
 * @returns BaseApiState and utility functions
 */
export function useApiBase<T>() {
  const [state, setState] = useState<BaseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    isBackendConnected: false,
  });

  /**
   * Check backend connection status
   * Updates the isBackendConnected state based on health check
   */
  const checkBackendConnection = useCallback(async (): Promise<boolean> => {
    try {
      const isHealthy = await apiClient.checkHealth();
      setState(prev => ({ ...prev, isBackendConnected: isHealthy }));
      return isHealthy;
    } catch (error) {
      console.warn('Backend connection check failed:', error);
      setState(prev => ({ ...prev, isBackendConnected: false }));
      return false;
    }
  }, []);

  /**
   * Set loading state
   * @param loading - Whether the operation is loading
   */
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: null }));
  }, []);

  /**
   * Set error state
   * @param error - Error message to display
   */
  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, loading: false, error }));
  }, []);

  /**
   * Set data state
   * @param data - Data to set
   */
  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, loading: false, data, error: null }));
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Reset state to initial values
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      isBackendConnected: false,
    });
  }, []);

  /**
   * Execute API operation with error handling
   * @param operation - Async operation to execute
   * @param useMockData - Whether to use mock data on failure
   * @param mockDataProvider - Function that provides mock data
   */
  const executeOperation = useCallback(async (
    operation: () => Promise<T>,
    useMockData: boolean = true,
    mockDataProvider?: () => T | Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    
    try {
      // Check backend connection first
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        // Use real API
        const result = await operation();
        setData(result);
        return result;
      } else if (useMockData && mockDataProvider) {
        // Use mock data as fallback
        console.warn('Backend unavailable, using mock data');
        const mockData = await mockDataProvider();
        setData(mockData);
        return mockData;
      } else {
        throw new Error('Backend unavailable and no mock data provided');
      }
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? `API Error (${error.status}): ${error.message}`
        : error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';
      
      setError(errorMessage);
      
      // Try mock data as last resort
      if (useMockData && mockDataProvider) {
        try {
          console.warn('API failed, attempting to use mock data');
          const mockData = await mockDataProvider();
          setData(mockData);
          return mockData;
        } catch (mockError) {
          console.error('Mock data also failed:', mockError);
        }
      }
      
      return null;
    }
  }, [setLoading, setData, setError, checkBackendConnection]);

  /**
   * Execute operation without data return (for create, update, delete operations)
   * @param operation - Async operation to execute
   */
  const executeOperationWithoutData = useCallback(async (
    operation: () => Promise<void>
  ): Promise<ApiOperationResult> => {
    setLoading(true);
    
    try {
      await checkBackendConnection();
      await operation();
      setLoading(false);
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? `API Error (${error.status}): ${error.message}`
        : error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [setLoading, setError, checkBackendConnection]);

  // Check backend connection on mount (disabled to prevent excessive requests)
  // Connection status will be updated when API calls are made
  // useEffect(() => {
  //   checkBackendConnection();
  // }, []);

  return {
    ...state,
    setLoading,
    setError,
    setData,
    clearError,
    reset,
    checkBackendConnection,
    executeOperation,
    executeOperationWithoutData,
  };
}

// =============================================================================
// Specialized Hooks
// =============================================================================

/**
 * Hook for list data operations (get all, search, filter)
 * @template T The type of items in the list
 */
export function useApiList<T>() {
  const baseHook = useApiBase<T[]>();
  
  return {
    ...baseHook,
    items: baseHook.data || [],
    isEmpty: !baseHook.data || baseHook.data.length === 0,
    itemCount: baseHook.data?.length || 0,
  };
}

/**
 * Hook for single item operations (get by id, create, update)
 * @template T The type of the item
 */
export function useApiItem<T>() {
  const baseHook = useApiBase<T>();
  
  return {
    ...baseHook,
    item: baseHook.data,
    hasItem: baseHook.data !== null,
  };
}
