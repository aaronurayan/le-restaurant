/**
 * Menu API Service
 *
 * This service handles all menu-related API operations.
 * It provides a centralized interface for menu CRUD operations, category management,
 * and menu search functionality.
 *
 * Features:
 * - Menu item CRUD operations
 * - Category management
 * - Menu search and filtering
 * - Error handling and validation
 * - Mock data fallback
 *
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import { apiClient } from '../services/apiClient.unified';
import { API_ENDPOINTS } from '../config/api.config';
import { MenuItem } from '../types';

// =============================================================================
// Type Definitions
// =============================================================================

export interface MenuSearchFilters {
  category?: string;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  page?: number;
  limit?: number;
}

export interface MenuListResponse {
  items: MenuItem[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: string[];
}

// =============================================================================
// Mock Data
// =============================================================================

const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, mozzarella, and fresh basil',
    price: 18.99,
    categoryId: 'pizza',
    imageUrl: '/images/margherita-pizza.jpg',
    available: true,
    ingredients: ['Tomato sauce', 'Mozzarella', 'Fresh basil'],
    allergens: ['Gluten', 'Dairy'],
    preparationTime: 15,
    calories: 320,
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    description: 'Spicy pepperoni with mozzarella and tomato sauce',
    price: 21.99,
    categoryId: 'pizza',
    imageUrl: '/images/pepperoni-pizza.jpg',
    available: true,
    ingredients: ['Tomato sauce', 'Mozzarella', 'Pepperoni'],
    allergens: ['Gluten', 'Dairy', 'Pork'],
    preparationTime: 18,
    calories: 380,
  },
  {
    id: 3,
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with caesar dressing and parmesan',
    price: 12.99,
    categoryId: 'salad',
    imageUrl: '/images/caesar-salad.jpg',
    available: true,
    ingredients: [
      'Romaine lettuce',
      'Caesar dressing',
      'Parmesan cheese',
      'Croutons',
    ],
    allergens: ['Dairy', 'Gluten'],
    preparationTime: 8,
    calories: 180,
  },
  {
    id: 4,
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon herb butter',
    price: 28.99,
    categoryId: 'main',
    imageUrl: '/images/grilled-salmon.jpg',
    available: true,
    ingredients: ['Atlantic salmon', 'Lemon', 'Herbs', 'Butter'],
    allergens: ['Fish', 'Dairy'],
    preparationTime: 25,
    calories: 420,
  },
  {
    id: 5,
    name: 'Chocolate Lava Cake',
    description:
      'Warm chocolate cake with molten center and vanilla ice cream',
    price: 9.99,
    categoryId: 'dessert',
    imageUrl: '/images/chocolate-lava-cake.jpg',
    available: true,
    ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    preparationTime: 12,
    calories: 520,
  },
];

const MOCK_CATEGORIES = [
  'pizza',
  'salad',
  'main',
  'dessert',
  'appetizer',
  'beverage',
];

// =============================================================================
// Menu API Service Class
// =============================================================================

export class MenuApiService {
  private static instance: MenuApiService;

  private constructor() {}

  public static getInstance(): MenuApiService {
    if (!MenuApiService.instance) {
      MenuApiService.instance = new MenuApiService();
    }
    return MenuApiService.instance;
  }

  /**
   * Get all menu items with optional filtering and pagination
   */
  public async getAllMenuItems(
    filters: MenuSearchFilters = {},
  ): Promise<MenuListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (filters.category) queryParams.append('category', filters.category);
      if (filters.searchTerm) queryParams.append('search', filters.searchTerm);
      if (filters.minPrice)
        queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice)
        queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.available !== undefined)
        queryParams.append('available', filters.available.toString());
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());

      const endpoint = `/menu/items${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;
      const response = await apiClient.get<any>(endpoint);

      // Handle both plain array and structured responses
      if (Array.isArray(response)) {
        const normalized = response.map(item => ({
          ...item,
          isAvailable: item.isAvailable ?? item.available ?? true, // ✅ normalize for frontend
        }));

        return {
          items: normalized,
          totalCount: normalized.length,
          page: 1,
          limit: normalized.length,
          totalPages: 1,
          categories: [],
        };
      }

      return response as MenuListResponse;
    } catch (error) {
      console.warn('Failed to fetch menu items from API, using mock data:', error);
      return this.getMockMenuList(filters);
    }
  }

  /**
   * Get menu item by ID
   */
  public async getMenuItemById(id: number): Promise<MenuItem> {
    try {
      const response = await apiClient.get<MenuItem>(`/menu/items/${id}`);
      return response;
    } catch (error) {
      console.warn('Failed to fetch menu item by ID from API, using mock data:', error);
      const mockItem = MOCK_MENU_ITEMS.find(item => item.id === id);
      if (!mockItem) throw new Error(`Menu item not found with id: ${id}`);
      return mockItem;
    }
  }

  /**
   * Get menu items by category
   */
  public async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<MenuItem[]>(
        `/menu/items/category/${category}`,
      );
      return response;
    } catch (error) {
      console.warn('Failed to fetch menu items by category from API, using mock data:', error);
      return MOCK_MENU_ITEMS.filter(item => item.categoryId === category);
    }
  }

  /**
   * Search menu items
   */
  public async searchMenuItems(searchTerm: string): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<MenuItem[]>(
        `/menu/search?keyword=${encodeURIComponent(searchTerm)}`,
      );
      return response;
    } catch (error) {
      console.warn('Failed to search menu items from API, using mock data:', error);
      const term = searchTerm.toLowerCase();

      // Safe checks for undefined fields
      return MOCK_MENU_ITEMS.filter(item =>
        item.name.toLowerCase().includes(term) ||
        (item.description?.toLowerCase().includes(term) ?? false) ||
        (item.ingredients?.some(
          ingredient => ingredient.toLowerCase().includes(term),
        ) ?? false),
      );
    }
  }

  /**
   * Get all categories
   */
  public async getAllCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>('/menu/categories');
      return response;
    } catch (error) {
      console.warn('Failed to fetch categories from API, using mock data:', error);
      return [...MOCK_CATEGORIES];
    }
  }

  /**
   * Test backend connection
   */
  public async testConnection(): Promise<boolean> {
    try {
      await apiClient.get('/menu/test');
      return true;
    } catch (error) {
      console.warn('Menu API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get mock menu list with filtering
   */
  private getMockMenuList(filters: MenuSearchFilters): MenuListResponse {
    let filteredItems = [...MOCK_MENU_ITEMS];

    // Apply filters
    if (filters.category) {
      filteredItems = filteredItems.filter(
        item => item.categoryId === filters.category,
      );
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          (item.description?.toLowerCase().includes(term) ?? false) ||
          (item.ingredients?.some(
            ingredient => ingredient.toLowerCase().includes(term),
          ) ?? false),
      );
    }

    if (filters.minPrice !== undefined) {
      filteredItems = filteredItems.filter(
        item => item.price >= filters.minPrice!,
      );
    }

    if (filters.maxPrice !== undefined) {
      filteredItems = filteredItems.filter(
        item => item.price <= filters.maxPrice!,
      );
    }

    if (filters.available !== undefined) {
      filteredItems = filteredItems.filter(
        item => item.available === filters.available,
      );
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      totalCount: filteredItems.length,
      page,
      limit,
      totalPages: Math.ceil(filteredItems.length / limit),
      categories: [...MOCK_CATEGORIES],
    };
  }
}

// =============================================================================
// Export Singleton Instance
// =============================================================================

export const menuApiService = MenuApiService.getInstance();
