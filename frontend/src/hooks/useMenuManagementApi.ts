/**
 * Menu Management API Hook
 * 
 * This hook has been updated to use the unified API client and centralized endpoints.
 */

import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient.unified';
import { API_ENDPOINTS, API_CONFIG } from '../config/api.config';

// API_BASE_URL is no longer needed - using API_ENDPOINTS and apiClient directly

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemCreateRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  imageUrl?: string;
}

export interface MenuItemUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  available?: boolean;
  imageUrl?: string;
}

/**
 * Custom hook for Menu Management API operations (F103, F104)
 * Provides CRUD operations and filtering for menu items
 * 
 * @author Le Restaurant Development Team
 */
export const useMenuManagementApi = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * FETCH ALL MENU ITEMS (F103)
   * Supports filtering by category, search, and availability
   */
  const fetchMenuItems = useCallback(async (filters?: {
    category?: string;
    search?: string;
    available?: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.available !== undefined) params.append('available', String(filters.available));
      
      const queryString = params.toString();
      const endpoint = queryString 
        ? `${API_ENDPOINTS.menu.base}?${queryString}`
        : API_ENDPOINTS.menu.base;
      const data = await apiClient.get<MenuItem[]>(endpoint);
      setMenuItems(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Failed to fetch menu items:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * CREATE MENU ITEM (F104) **CRITICAL**
   * Manager can add new menu items
   */
  const createMenuItem = useCallback(async (item: MenuItemCreateRequest): Promise<MenuItem> => {
    setLoading(true);
    setError(null);
    try {
      const createdItem = await apiClient.post<MenuItem>(API_ENDPOINTS.menu.base, item);
      setMenuItems(prev => [...prev, createdItem]);
      return createdItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create menu item';
      setError(errorMessage);
      console.error('Failed to create menu item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * UPDATE MENU ITEM (F104)
   * Manager can edit existing menu items
   */
  const updateMenuItem = useCallback(async (id: number, updates: MenuItemUpdateRequest): Promise<MenuItem> => {
    setLoading(true);
    setError(null);
    try {
      const updatedItem = await apiClient.put<MenuItem>(API_ENDPOINTS.menu.byId(id), updates);
      setMenuItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update menu item';
      setError(errorMessage);
      console.error('Failed to update menu item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * DELETE MENU ITEM (F104)
   * Manager can remove menu items
   */
  const deleteMenuItem = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(API_ENDPOINTS.menu.byId(id));
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete menu item';
      setError(errorMessage);
      console.error('Failed to delete menu item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * FETCH CATEGORIES (F103)
   * Get all available menu categories
   */
  const fetchCategories = useCallback(async (): Promise<string[]> => {
    try {
      return await apiClient.get<string[]>(API_ENDPOINTS.menu.categories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Failed to fetch categories:', err);
      throw err;
    }
  }, []);
  
  return {
    menuItems,
    loading,
    error,
    fetchMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    fetchCategories
  };
};
