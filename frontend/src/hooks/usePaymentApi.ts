/**
 * Payment Management API Hook (F106)
 * 
 * This hook provides comprehensive payment management functionality for F106 Payment Management.
 * It uses the centralized PaymentApiService and provides a clean interface for React components.
 * 
 * Features:
 * - Payment CRUD operations
 * - Payment processing and status management
 * - Payment search and filtering
 * - Statistics and reporting
 * - Error handling and loading states
 * - Mock data fallback
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2024-01-15
 * @module F106-PaymentManagement
 */

import { useState, useCallback } from 'react';
import { Payment, PaymentMethod, PaymentStatus } from '../types/payment';
import { useApiList, useApiItem } from './useApiBase';
import { 
  paymentApiService, 
  CreatePaymentRequest, 
  UpdatePaymentRequest, 
  PaymentSearchFilters,
  PaymentListResponse,
  PaymentProcessingResult
} from '../services/paymentApiService';

// =============================================================================
// Payment List Management Hook
// =============================================================================

/**
 * Hook for managing payment lists with search, filtering, and pagination
 * 
 * @returns Payment list management functions and state
 */
export const usePaymentList = () => {
  const apiHook = useApiList<Payment>();
  const [filters, setFilters] = useState<PaymentSearchFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalCount: 0,
    totalAmount: 0,
  });
  const [summary, setSummary] = useState({
    completed: 0,
    pending: 0,
    failed: 0,
    refunded: 0,
  });

  /**
   * Load payments with current filters and pagination
   */
  const loadPayments = useCallback(async (customFilters?: PaymentSearchFilters) => {
    const currentFilters = { ...filters, ...customFilters };
    setFilters(currentFilters);

    await apiHook.executeOperation(
      async () => {
        const response = await paymentApiService.getAllPayments(currentFilters);
        return response.payments; // Extract payments array from response
      },
      true, // Use mock data on failure
      async () => {
        // Mock data fallback
        const mockResponse = paymentApiService['getMockPaymentList'](currentFilters);
        return mockResponse.payments; // Extract payments array from response
      }
    );

    // Update pagination and summary state
    if (apiHook.data) {
      const response = apiHook.data as unknown as PaymentListResponse;
      setPagination({
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
        totalAmount: response.totalAmount,
      });
      setSummary(response.summary);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Search payments by customer email
   */
  const searchPayments = useCallback((customerEmail: string) => {
    loadPayments({ customerEmail });
  }, [loadPayments]);

  /**
   * Filter payments by status
   */
  const filterByStatus = useCallback((status: PaymentStatus) => {
    loadPayments({ status });
  }, [loadPayments]);

  /**
   * Filter payments by method
   */
  const filterByMethod = useCallback((method: PaymentMethod) => {
    loadPayments({ method });
  }, [loadPayments]);

  /**
   * Filter payments by order ID
   */
  const filterByOrderId = useCallback((orderId: number) => {
    loadPayments({ orderId });
  }, [loadPayments]);

  /**
   * Filter payments by date range
   */
  const filterByDateRange = useCallback((dateFrom: string, dateTo: string) => {
    loadPayments({ dateFrom, dateTo });
  }, [loadPayments]);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
    loadPayments({});
  }, [loadPayments]);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((page: number) => {
    loadPayments({ page });
  }, [loadPayments]);

  /**
   * Change page size
   */
  const changePageSize = useCallback((limit: number) => {
    loadPayments({ limit, page: 1 });
  }, [loadPayments]);

  return {
    // State
    payments: apiHook.items,
    loading: apiHook.loading,
    error: apiHook.error,
    isBackendConnected: apiHook.isBackendConnected,
    filters,
    pagination,
    summary,
    
    // Actions
    loadPayments,
    searchPayments,
    filterByStatus,
    filterByMethod,
    filterByOrderId,
    filterByDateRange,
    clearFilters,
    goToPage,
    changePageSize,
    refresh: loadPayments,
  };
};

// =============================================================================
// Single Payment Management Hook
// =============================================================================

/**
 * Hook for managing individual payment operations
 * 
 * @returns Single payment management functions and state
 */
export const usePayment = () => {
  const apiHook = useApiItem<Payment>();

  /**
   * Load payment by ID
   */
  const loadPaymentById = useCallback(async (id: number) => {
    await apiHook.executeOperation(
      () => paymentApiService.getPaymentById(id),
      true, // Use mock data on failure
      () => paymentApiService.getPaymentById(id) // This will use mock data
    );
  }, [apiHook]);

  /**
   * Create new payment
   */
  const createPayment = useCallback(async (paymentData: CreatePaymentRequest): Promise<Payment | null> => {
    try {
      const newPayment = await paymentApiService.createPayment(paymentData);
      apiHook.setData(newPayment);
      return newPayment;
    } catch (error) {
      console.error('Failed to create payment:', error);
      apiHook.setError(error instanceof Error ? error.message : 'Failed to create payment');
      return null;
    }
  }, [apiHook]);

  /**
   * Update payment
   */
  const updatePayment = useCallback(async (id: number, paymentData: UpdatePaymentRequest) => {
    const result = await apiHook.executeOperationWithoutData(
      async () => {
        const updatedPayment = await paymentApiService.updatePayment(id, paymentData);
        apiHook.setData(updatedPayment);
      }
    );
    return result;
  }, [apiHook]);

  /**
   * Update payment status
   */
  const updatePaymentStatus = useCallback(async (id: number, status: PaymentStatus) => {
    return updatePayment(id, { status });
  }, [updatePayment]);

  /**
   * Process payment
   */
  const processPayment = useCallback(async (id: number): Promise<PaymentProcessingResult | null> => {
    try {
      const result = await paymentApiService.processPayment(id);
      // Reload payment data after processing
      await loadPaymentById(id);
      return result;
    } catch (error) {
      console.error('Payment processing failed:', error);
      return null;
    }
  }, [loadPaymentById]);

  /**
   * Refund payment
   */
  const refundPayment = useCallback(async (id: number, amount?: number) => {
    const result = await apiHook.executeOperationWithoutData(
      async () => {
        const refundedPayment = await paymentApiService.refundPayment(id, amount);
        apiHook.setData(refundedPayment);
      }
    );
    return result;
  }, [apiHook]);

  /**
   * Delete payment
   */
  const deletePayment = useCallback(async (id: number) => {
    const result = await apiHook.executeOperationWithoutData(
      () => paymentApiService.deletePayment(id)
    );
    return result;
  }, [apiHook]);

  return {
    // State
    payment: apiHook.item,
    loading: apiHook.loading,
    error: apiHook.error,
    isBackendConnected: apiHook.isBackendConnected,
    hasPayment: apiHook.hasItem,
    
    // Actions
    loadPaymentById,
    createPayment,
    updatePayment,
    updatePaymentStatus,
    processPayment,
    refundPayment,
    deletePayment,
    clearError: apiHook.clearError,
    reset: apiHook.reset,
  };
};

// =============================================================================
// Payment Status Management Hook
// =============================================================================

/**
 * Hook for managing payments by status
 * 
 * @returns Status-specific payment management functions and state
 */
export const usePaymentsByStatus = () => {
  const apiHook = useApiList<Payment>();
  const [currentStatus, setCurrentStatus] = useState<PaymentStatus | null>(null);

  /**
   * Load payments by status
   */
  const loadPaymentsByStatus = useCallback(async (status: PaymentStatus) => {
    setCurrentStatus(status);
    await apiHook.executeOperation(
      () => paymentApiService.getPaymentsByStatus(status),
      true, // Use mock data on failure
      () => paymentApiService.getPaymentsByStatus(status) // This will use mock data
    );
  }, [apiHook]);

  return {
    // State
    payments: apiHook.items,
    loading: apiHook.loading,
    error: apiHook.error,
    isBackendConnected: apiHook.isBackendConnected,
    currentStatus,
    
    // Actions
    loadPaymentsByStatus,
    refresh: () => currentStatus && loadPaymentsByStatus(currentStatus),
  };
};

// =============================================================================
// Payment Statistics Hook
// =============================================================================

/**
 * Hook for payment statistics and reporting
 * 
 * @returns Payment statistics functions and state
 */
export const usePaymentStatistics = () => {
  const apiHook = useApiItem<PaymentListResponse>();
  const [filters, setFilters] = useState<PaymentSearchFilters>({});

  /**
   * Load payment statistics
   */
  const loadStatistics = useCallback(async (customFilters?: PaymentSearchFilters) => {
    const currentFilters = { ...filters, ...customFilters };
    setFilters(currentFilters);

    await apiHook.executeOperation(
      () => paymentApiService.getPaymentStatistics(currentFilters),
      true, // Use mock data on failure
      () => {
        // Mock data fallback
        const mockResponse = paymentApiService['getMockPaymentList'](currentFilters);
        return Promise.resolve(mockResponse);
      }
    );
  }, [filters, apiHook]);

  /**
   * Load statistics for date range
   */
  const loadStatisticsByDateRange = useCallback((dateFrom: string, dateTo: string) => {
    loadStatistics({ dateFrom, dateTo });
  }, [loadStatistics]);

  /**
   * Load statistics by payment method
   */
  const loadStatisticsByMethod = useCallback((method: PaymentMethod) => {
    loadStatistics({ method });
  }, [loadStatistics]);

  return { 
    // State
    statistics: apiHook.item,
    loading: apiHook.loading,
    error: apiHook.error,
    isBackendConnected: apiHook.isBackendConnected,
    filters,
    
    // Actions
    loadStatistics,
    loadStatisticsByDateRange,
    loadStatisticsByMethod,
    refresh: loadStatistics,
  };
};

// =============================================================================
// Legacy Hook (for backward compatibility)
// =============================================================================

/**
 * Legacy payment API hook for backward compatibility
 * @deprecated Use usePaymentList, usePayment, usePaymentsByStatus, or usePaymentStatistics instead
 */
export const usePaymentApi = () => {
  const paymentListHook = usePaymentList();
  const paymentHook = usePayment();

  return {
    // Legacy state
    payments: paymentListHook.payments,
    loading: paymentListHook.loading || paymentHook.loading,
    error: paymentListHook.error || paymentHook.error,
    isBackendConnected: paymentListHook.isBackendConnected,
    
    // Legacy functions
    loadPayments: paymentListHook.loadPayments,
    loadPaymentsByOrderId: (orderId: number) => paymentListHook.filterByOrderId(orderId),
    loadPaymentsByStatus: paymentListHook.filterByStatus,
    updatePaymentStatus: paymentHook.updatePaymentStatus,
    processPayment: paymentHook.processPayment,
    deletePayment: paymentHook.deletePayment,
  };
};
