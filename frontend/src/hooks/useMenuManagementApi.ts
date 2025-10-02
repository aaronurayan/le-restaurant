import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8080/api';

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
      
      const response = await fetch(`${API_BASE_URL}/menu-items?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/menu-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const createdItem = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const updatedItem = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
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
      const response = await fetch(`${API_BASE_URL}/menu-items/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
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
