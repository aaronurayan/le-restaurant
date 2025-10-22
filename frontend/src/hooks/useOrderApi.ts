import { useState, useCallback } from 'react';
import { OrderDto, OrderCreateRequestDto, OrderUpdateRequestDto, OrderStatus } from '../types/order';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Helper to get auth headers
 * Note: Backend OrderController has @CrossOrigin but may require auth in production
 */
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Hook for Order API operations (F105)
 * Manages state for order CRUD and filtering operations
 */
export const useOrderApi = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all orders
  const getAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error fetching orders';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get order by ID
  const getOrderById = useCallback(async (orderId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch order');
      const data = await response.json();
      setCurrentOrder(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error fetching order';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get orders by customer ID
  const getOrdersByCustomer = useCallback(async (customerId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/customer/${customerId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch customer orders');
      const data = await response.json();
      setOrders(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error fetching customer orders';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get orders by status
  const getOrdersByStatus = useCallback(async (status: OrderStatus) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/status/${status}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch orders by status');
      const data = await response.json();
      setOrders(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error fetching orders by status';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new order
  const createOrder = useCallback(async (orderData: OrderCreateRequestDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Failed to create order');
      const data = await response.json();
      setCurrentOrder(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error creating order';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order
  const updateOrder = useCallback(async (orderId: number, updateData: OrderUpdateRequestDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error('Failed to update order');
      const data = await response.json();
      setCurrentOrder(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error updating order';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId: number, status: OrderStatus) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update order status');
      const data = await response.json();
      setCurrentOrder(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error updating order status';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete order
  const deleteOrder = useCallback(async (orderId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete order');
      setCurrentOrder(null);
      setOrders(orders.filter(o => o.id !== orderId));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error deleting order';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [orders]);

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
