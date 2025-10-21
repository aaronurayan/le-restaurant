/**
 * Menu API Hook (New)
 * 
 * This hook provides comprehensive menu management functionality.
 * It uses the centralized MenuApiService and provides a clean interface for React components.
 * 
 * Features:
 * - Menu item CRUD operations
 * - Category management
 * - Menu search and filtering
 * - Error handling and loading states
 * - Mock data fallback
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import { useState, useCallback, useEffect } from 'react';
import { MenuItem } from '../types';
import { useApiList, useApiItem } from './useApiBase';
import { 
  menuApiService, 
  MenuSearchFilters,
  MenuListResponse
} from '../services/menuApiService';

// =============================================================================
// Menu List Management Hook
// =============================================================================

/**
 * Hook for managing menu lists with search, filtering, and pagination
 * 
 * @returns Menu list management functions and state
 */
export const useMenuList = () => {
  const apiHook = useApiList<MenuItem>();
  const [filters, setFilters] = useState<MenuSearchFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalCount: 0,
  });
  const [categories, setCategories] = useState<string[]>([]);

  /**
   * Load menu items with current filters and pagination
   */
  const loadMenuItems = useCallback(async (customFilters?: MenuSearchFilters) => {
    const currentFilters = { ...filters, ...customFilters };
    setFilters(currentFilters);

    await apiHook.executeOperation(
      async () => {
        const response = await menuApiService.getAllMenuItems(currentFilters);
        setCategories(response.categories);
        return response.items; // Extract items array from response
      },
      true, // Use mock data on failure
      async () => {
        // Mock data fallback
        const mockResponse = menuApiService['getMockMenuList'](currentFilters);
        setCategories(mockResponse.categories);
        return mockResponse.items; // Extract items array from response
      }
    );

    // Update pagination state
    if (apiHook.data) {
      const response = apiHook.data as unknown as MenuListResponse;
      setPagination({
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
      });
    }
  }, [filters, apiHook]);

  /**
   * Search menu items by term
   */
  const searchMenuItems = useCallback((searchTerm: string) => {
    loadMenuItems({ searchTerm });
  }, [loadMenuItems]);

  /**
   * Filter menu items by category
   */
  const filterByCategory = useCallback((category: string) => {
    loadMenuItems({ category });
  }, [loadMenuItems]);

  /**
   * Filter menu items by price range
   */
  const filterByPriceRange = useCallback((minPrice: number, maxPrice: number) => {
    loadMenuItems({ minPrice, maxPrice });
  }, [loadMenuItems]);

  /**
   * Filter menu items by availability
   */
  const filterByAvailability = useCallback((available: boolean) => {
    loadMenuItems({ available });
  }, [loadMenuItems]);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
    loadMenuItems({});
  }, [loadMenuItems]);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((page: number) => {
    loadMenuItems({ page });
  }, [loadMenuItems]);

  /**
   * Change page size
   */
  const changePageSize = useCallback((limit: number) => {
    loadMenuItems({ limit, page: 1 });
  }, [loadMenuItems]);

  // Load menu items on mount
  useEffect(() => {
    loadMenuItems();
  }, []); // Empty dependency array to run only once on mount

  return {
    // State
    menuItems: apiHook.items,
    loading: apiHook.loading,
    error: apiHook.error,
    isBackendConnected: apiHook.isBackendConnected,
    filters,
    pagination,
    categories,
    
    // Actions
    loadMenuItems,
    searchMenuItems,
    filterByCategory,
    filterByPriceRange,
    filterByAvailability,
    clearFilters,
    goToPage,
    changePageSize,
    refresh: loadMenuItems,
  };
};

// =============================================================================
// Single Menu Item Management Hook
// =============================================================================

/**
 * Hook for managing individual menu item operations
 * 
 * @returns Single menu item management functions and state
 */
export const useMenuItem = () => {
  const apiHook = useApiItem<MenuItem>();

  /**
   * Load menu item by ID
   */
  const loadMenuItemById = useCallback(async (id: number) => {
    await apiHook.executeOperation(
      () => menuApiService.getMenuItemById(id),
      true, // Use mock data on failure
      () => menuApiService.getMenuItemById(id) // This will use mock data
    );
  }, [apiHook]);

  return {
    // State
    menuItem: apiHook.item,
    loading: apiHook.loading,
    error: apiHook.error,
    isBackendConnected: apiHook.isBackendConnected,
    hasMenuItem: apiHook.hasItem,
    
    // Actions
    loadMenuItemById,
    clearError: apiHook.clearError,
    reset: apiHook.reset,
  };
};

// =============================================================================
// Menu Category Management Hook
// =============================================================================

/**
 * Hook for managing menu categories
 * 
 * @returns Category management functions and state
 */
export const useMenuCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  /**
   * Load all categories
   */
  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const isConnected = await menuApiService.testConnection();
      setIsBackendConnected(isConnected);
      
      const data = await menuApiService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error loading categories:', err);
      
      // Use mock data as fallback
      try {
        const mockResponse = menuApiService['getMockMenuList']({});
        setCategories(mockResponse.categories);
      } catch (mockError) {
        console.error('Failed to load mock categories:', mockError);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []); // Empty dependency array to run only once on mount

  return {
    // State
    categories,
    loading,
    error,
    isBackendConnected,
    
    // Actions
    loadCategories,
    refresh: loadCategories,
  };
};

// =============================================================================
// Legacy Hook (for backward compatibility)
// =============================================================================

/**
 * Legacy menu API hook for backward compatibility
 * @deprecated Use useMenuList, useMenuItem, or useMenuCategories instead
 */
export const useMenuApi = () => {
  const menuListHook = useMenuList();
  const categoriesHook = useMenuCategories();

  return {
    // Legacy state
    menuItems: menuListHook.menuItems,
    categories: categoriesHook.categories,
    loading: menuListHook.loading || categoriesHook.loading,
    error: menuListHook.error || categoriesHook.error,
    isBackendConnected: menuListHook.isBackendConnected,
    
    // Legacy functions
    loadMenuItems: menuListHook.loadMenuItems,
    loadMenuItemsByCategory: menuListHook.filterByCategory,
    searchMenuItems: menuListHook.searchMenuItems,
    loadCategories: categoriesHook.loadCategories,
  };
};
