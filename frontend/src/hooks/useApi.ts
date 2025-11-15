/**
 * @deprecated This file uses legacy api.ts service.
 * Consider migrating to specific hooks like useMenuApiNew, useOrderApi, etc.
 * 
 * This file will be updated to use the unified client in a future version.
 */

import { useState, useEffect, useCallback } from 'react';
import { MenuItem, Order, CartItem } from '../types';
import { apiClient } from '../services/apiClient.unified';
import { API_ENDPOINTS } from '../config/api.config';

// API 상태 타입
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// API 훅 기본 설정
function useApiState<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: null }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, loading: false, error }));
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, loading: false, data, error: null }));
  }, []);

  return { state, setLoading, setError, setData };
}

// 메뉴 API 훅
export const useMenuApi = () => {
  const { state, setLoading, setError, setData } = useApiState<MenuItem[]>();
  const [categories, setCategories] = useState<string[]>([]);

  // 모든 메뉴 아이템 조회
  const fetchAllItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<MenuItem[]>(API_ENDPOINTS.menu.base);
      setData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch menu items');
    }
  }, [setLoading, setData, setError]);

  // 카테고리별 메뉴 조회
  const fetchItemsByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      const data = await apiClient.get<MenuItem[]>(API_ENDPOINTS.menu.byCategory(category));
      setData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch items by category');
    }
  }, [setLoading, setData, setError]);

  // 메뉴 검색
  const searchItems = useCallback(async (keyword: string) => {
    try {
      setLoading(true);
      const data = await apiClient.get<MenuItem[]>(API_ENDPOINTS.menu.search(keyword));
      setData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to search items');
    }
  }, [setLoading, setData, setError]);

  // 모든 카테고리 조회
  const fetchCategories = useCallback(async () => {
    try {
      const data = await apiClient.get<string[]>(API_ENDPOINTS.menu.categories);
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchAllItems();
    fetchCategories();
  }, [fetchAllItems, fetchCategories]);

  return {
    ...state,
    categories,
    fetchAllItems,
    fetchItemsByCategory,
    searchItems,
    fetchCategories,
  };
};

// 주문 API 훅
export const useOrderApi = () => {
  const { state, setLoading, setError, setData } = useApiState<Order>();

  const createOrder = useCallback(async (order: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>) => {
    try {
      setLoading(true);
      const data = await apiClient.post<Order>(API_ENDPOINTS.orders.base, order);
      setData(data);
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create order');
      throw error;
    }
  }, [setLoading, setData, setError]);

  const getOrderStatus = useCallback(async (orderId: string) => {
    try {
      setLoading(true);
      const data = await apiClient.get<Order>(API_ENDPOINTS.orders.byId(Number(orderId)));
      setData(data);
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get order status');
      throw error;
    }
  }, [setLoading, setData, setError]);

  return {
    ...state,
    createOrder,
    getOrderStatus,
  };
};

// 장바구니 API 훅
export const useCartApi = () => {
  const { state, setLoading, setError, setData } = useApiState<CartItem[]>();

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      // Note: Cart API endpoints may need to be added to API_ENDPOINTS
      // For now, using a placeholder - this may need backend implementation
      const data = await apiClient.get<CartItem[]>('/api/cart');
      setData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch cart');
    }
  }, [setLoading, setData, setError]);

  const addToCart = useCallback(async (item: CartItem) => {
    try {
      setLoading(true);
      const data = await cartApi.addToCart(item);
      // 장바구니 새로고침
      await fetchCart();
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add item to cart');
      throw error;
    }
  }, [setLoading, setError, fetchCart]);

  const updateCartItem = useCallback(async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      const data = await cartApi.updateCartItem(itemId, quantity);
      // 장바구니 새로고침
      await fetchCart();
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update cart item');
      throw error;
    }
  }, [setLoading, setError, fetchCart]);

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      setLoading(true);
      await cartApi.removeFromCart(itemId);
      // 장바구니 새로고침
      await fetchCart();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to remove item from cart');
      throw error;
    }
  }, [setLoading, setError, fetchCart]);

  // 컴포넌트 마운트 시 장바구니 로드
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    ...state,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
  };
};

// API 상태 확인 훅
export const useApiHealth = () => {
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkBackendStatus = useCallback(async () => {
    try {
      setChecking(true);
      // Health check fails silently if backend is not available
      const status = await apiClient.checkHealth();
      setIsBackendHealthy(status);
      return status;
    } catch (error) {
      // Silently handle - backend may not be running
      setIsBackendHealthy(false);
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  // 컴포넌트 마운트 시 상태 확인
  useEffect(() => {
    checkBackendStatus();
  }, []); // Remove checkBackendStatus from dependencies to prevent infinite loop

  return {
    isBackendHealthy,
    checking,
    checkBackendStatus,
    baseUrl: apiClient.getBaseUrl(),
  };
};

export const useApi = () => {
  const get = async (url: string) => {
    const response = await fetch(url);
    return response.json();
  };

  const post = async (url: string, body: any) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  };

  const put = async (url: string, body: any) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  };

  const del = async (url: string) => {
    await fetch(url, { method: 'DELETE' });
  };

  return { get, post, put, del };
};
