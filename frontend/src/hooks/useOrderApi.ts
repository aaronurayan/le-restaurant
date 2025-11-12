/**
 * Order API Hook (F105)
 * 
 * This hook provides comprehensive order management functionality.
 * Uses the unified API client for all backend communications.
 * 
 * @author Le Restaurant Development Team
 * @version 2.0.0
 * @since 2025-01-27
 * @module F105-OrderManagement
 */

import { useState, useCallback } from 'react';
import { OrderDto, OrderCreateRequestDto, OrderUpdateRequestDto, OrderStatus } from '../types/order';
import { apiClient } from '../services/apiClient.unified';
import { API_ENDPOINTS } from '../config/api.config';
import { ApiError } from '../services/apiClient.unified';

/**
 * Hook for Order API operations (F105)
 * Manages state for order CRUD and filtering operations
 */
export const useOrderApi = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get all orders
   */
  const getAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<OrderDto[]>(API_ENDPOINTS.orders.base);
      setOrders(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
        ? err.message 
        : 'Error fetching orders';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get order by ID
   */
  const getOrderById = useCallback(async (orderId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<OrderDto>(API_ENDPOINTS.orders.byId(orderId));
      setCurrentOrder(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
        ? err.message 
        : 'Error fetching order';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get orders by customer ID
   */
  const getOrdersByCustomer = useCallback(async (customerId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<OrderDto[]>(API_ENDPOINTS.orders.byCustomer(customerId));
      setOrders(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
        ? err.message 
        : 'Error fetching customer orders';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get orders by status
   */
  const getOrdersByStatus = useCallback(async (status: OrderStatus) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<OrderDto[]>(API_ENDPOINTS.orders.byStatus(status));
      setOrders(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
        ? err.message 
        : 'Error fetching orders by status';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new order
   */
  const createOrder = useCallback(async (orderData: OrderCreateRequestDto) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.post<OrderDto>(API_ENDPOINTS.orders.base, orderData);
      setCurrentOrder(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
        ? err.message 
        : 'Error creating order';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update order
   */
  const updateOrder = useCallback(async (orderId: number, updateData: OrderUpdateRequestDto) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.put<OrderDto>(API_ENDPOINTS.orders.byId(orderId), updateData);
      setCurrentOrder(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
        ? err.message 
        : 'Error updating order';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update order status
   */
  const updateOrderStatus = useCallback(async (orderId: number, status: OrderStatus) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.put<OrderDto>(
        API_ENDPOINTS.orders.updateStatus(orderId), 
        { status }
      );
      setCurrentOrder(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
        ? err.message 
        : 'Error updating order status';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete order
   */
  const deleteOrder = useCallback(async (orderId: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete<void>(API_ENDPOINTS.orders.byId(orderId));
      setCurrentOrder(null);
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      const errorMsg = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
        ? err.message 
        : 'Error deleting order';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    currentOrder,
    loading,
    error,
    getAllOrders,
    getOrderById,
    getOrdersByCustomer,
    getOrdersByStatus,
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    setCurrentOrder,
    setError,
  };
};
