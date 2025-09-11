import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { menuApi } from '../services/api';

export const useMenuApi = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // 백엔드 연결 상태 확인
  const checkBackendConnection = async () => {
    try {
      const isConnected = await menuApi.testConnection();
      setIsBackendConnected(true);
      return true;
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
        const items = await menuApi.getAllItems();
        setMenuItems(items);
      } else {
        // 백엔드가 연결되지 않으면 mock data 사용
        const { mockMenuItems } = await import('../data/mockData');
        setMenuItems(mockMenuItems);
      }
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Error loading menu items:', err);
      
      // 에러 발생 시 mock data 사용
      try {
        const { mockMenuItems } = await import('../data/mockData');
        setMenuItems(mockMenuItems);
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
        const cats = await menuApi.getAllCategories();
        setCategories(cats);
      } else {
        // 백엔드가 연결되지 않으면 mock data에서 카테고리 추출
        const { mockMenuItems } = await import('../data/mockData');
        const uniqueCategories = [...new Set(mockMenuItems.map(item => item.categoryId))];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      
      // 에러 발생 시 mock data에서 카테고리 추출
      try {
        const { mockMenuItems } = await import('../data/mockData');
        const uniqueCategories = [...new Set(mockMenuItems.map(item => item.categoryId))];
        setCategories(uniqueCategories);
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
        const items = await menuApi.getItemsByCategory(category);
        setMenuItems(items);
      } else {
        // 백엔드가 연결되지 않으면 mock data에서 필터링
        const { mockMenuItems } = await import('../data/mockData');
        const filteredItems = mockMenuItems.filter(item => item.categoryId === category);
        setMenuItems(filteredItems);
      }
    } catch (err) {
      setError('Failed to load menu items by category');
      console.error('Error loading menu items by category:', err);
      
      // 에러 발생 시 mock data에서 필터링
      try {
        const { mockMenuItems } = await import('../data/mockData');
        const filteredItems = mockMenuItems.filter(item => item.categoryId === category);
        setMenuItems(filteredItems);
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
        const items = await menuApi.searchItems(keyword);
        setMenuItems(items);
      } else {
        // 백엔드가 연결되지 않으면 mock data에서 검색
        const { mockMenuItems } = await import('../data/mockData');
        const filteredItems = mockMenuItems.filter(item => 
          item.name.toLowerCase().includes(keyword.toLowerCase()) ||
          item.description.toLowerCase().includes(keyword.toLowerCase())
        );
        setMenuItems(filteredItems);
      }
    } catch (err) {
      setError('Failed to search menu items');
      console.error('Error searching menu items:', err);
      
      // 에러 발생 시 mock data에서 검색
      try {
        const { mockMenuItems } = await import('../data/mockData');
        const filteredItems = mockMenuItems.filter(item => 
          item.name.toLowerCase().includes(keyword.toLowerCase()) ||
          item.description.toLowerCase().includes(keyword.toLowerCase())
        );
        setMenuItems(filteredItems);
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
  }, []);

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
