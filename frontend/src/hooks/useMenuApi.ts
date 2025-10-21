/**
 * Menu API Hook (Legacy)
 * 
 * This hook provides menu management functionality with backward compatibility.
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

import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { menuApiService } from '../services/menuApiService';

export const useMenuApi = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // 백엔드 연결 상태 확인
  const checkBackendConnection = async () => {
    try {
      const isConnected = await menuApiService.testConnection();
      setIsBackendConnected(isConnected);
      return isConnected;
    } catch (error) {
      console.warn('Backend not connected, using mock data');
      setIsBackendConnected(false);
      return false;
    }
  };

  // 메뉴 아이템 로드
  const loadMenuItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const response = await menuApiService.getAllMenuItems();
        setMenuItems(response.items);
        setCategories(response.categories);
      } else {
        // 백엔드가 연결되지 않으면 mock data 사용
        const response = menuApiService['getMockMenuList']({});
        setMenuItems(response.items);
        setCategories(response.categories);
      }
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Error loading menu items:', err);
      
      // 에러 발생 시 mock data 사용
      try {
        const response = menuApiService['getMockMenuList']({});
        setMenuItems(response.items);
        setCategories(response.categories);
      } catch (mockError) {
        console.error('Failed to load mock data:', mockError);
      }
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 로드
  const loadCategories = async () => {
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const cats = await menuApiService.getAllCategories();
        setCategories(cats);
      } else {
        // 백엔드가 연결되지 않으면 mock data에서 카테고리 추출
        const response = menuApiService['getMockMenuList']({});
        setCategories(response.categories);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      
      // 에러 발생 시 mock data에서 카테고리 추출
      try {
        const response = menuApiService['getMockMenuList']({});
        setCategories(response.categories);
      } catch (mockError) {
        console.error('Failed to load mock categories:', mockError);
      }
    }
  };

  // 카테고리별 메뉴 아이템 로드
  const loadMenuItemsByCategory = async (category: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const items = await menuApiService.getMenuItemsByCategory(category);
        setMenuItems(items);
      } else {
        // 백엔드가 연결되지 않으면 mock data에서 필터링
        const response = menuApiService['getMockMenuList']({ category });
        setMenuItems(response.items);
      }
    } catch (err) {
      setError('Failed to load menu items by category');
      console.error('Error loading menu items by category:', err);
      
      // 에러 발생 시 mock data에서 필터링
      try {
        const response = menuApiService['getMockMenuList']({ category });
        setMenuItems(response.items);
      } catch (mockError) {
        console.error('Failed to load mock data by category:', mockError);
      }
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 검색
  const searchMenuItems = async (keyword: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const items = await menuApiService.searchMenuItems(keyword);
        setMenuItems(items);
      } else {
        // 백엔드가 연결되지 않으면 mock data에서 검색
        const response = menuApiService['getMockMenuList']({ searchTerm: keyword });
        setMenuItems(response.items);
      }
    } catch (err) {
      setError('Failed to search menu items');
      console.error('Error searching menu items:', err);
      
      // 에러 발생 시 mock data에서 검색
      try {
        const response = menuApiService['getMockMenuList']({ searchTerm: keyword });
        setMenuItems(response.items);
      } catch (mockError) {
        console.error('Failed to search mock data:', mockError);
      }
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadMenuItems();
    loadCategories();
  }, []); // Empty dependency array to run only once on mount

  return {
    menuItems,
    categories,
    loading,
    error,
    isBackendConnected,
    loadMenuItems,
    loadCategories,
    loadMenuItemsByCategory,
    searchMenuItems,
  };
};
