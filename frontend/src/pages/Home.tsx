import React, { useState, useMemo, useEffect } from 'react';
import { Hero } from '../components/organisms/Hero';
import { CategoryFilter } from '../components/organisms/CategoryFilter';
import { MenuGrid } from '../components/organisms/MenuGrid';
import { OrderStatus } from '../components/organisms/OrderStatus';
import { mockOrders } from '../data/mockData';
import { MenuItem } from '../types';
import { useMenuApi } from '../hooks/useMenuApi';

interface HomeProps {
  onAddToCart: (item: MenuItem, quantity: number) => void;
  favoritedItems: Set<string>;
  onFavorite: (item: MenuItem) => void;
}

<<<<<<< HEAD
//This is a comment in the order management branch
=======
// Test
>>>>>>> main
export const Home: React.FC<HomeProps> = ({
  onAddToCart,
  favoritedItems,
  onFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // API 훅 사용
  const {
    menuItems,
    categories,
    loading,
    error,
    isBackendConnected,
    loadMenuItemsByCategory,
    searchMenuItems
  } = useMenuApi();

  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    if (!selectedCategory) return menuItems;
    return menuItems.filter(item => item.categoryId === selectedCategory);
  }, [selectedCategory, menuItems]);

  const handleCategorySelect = async (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    
    if (categoryId) {
      await loadMenuItemsByCategory(categoryId);
    }
  };

  const handleOrderNow = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero onOrderNow={handleOrderNow} />
      
      {/* Menu Section */}
      <section id="menu" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900 mb-4">
              Our Delicious Menu
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover our carefully crafted dishes made with the finest ingredients and authentic recipes
            </p>
          </div>
          
          {/* Category Filter */}
          <CategoryFilter
            categories={(categories || []).map(cat => ({ id: cat, name: cat, description: '', displayOrder: 1, isActive: true, itemCount: 0 }))}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
          
          {/* Backend Connection Status */}
          {isBackendConnected && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
              🟢 Connected to Backend API
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg text-center">
              ⚠️ Using Mock Data: {error}
            </div>
          )}
          
          {/* Menu Grid */}
          <div className="mt-8">
            <MenuGrid
              items={filteredItems}
              onAddToCart={onAddToCart}
              onFavorite={onFavorite}
              favoritedItems={favoritedItems}
              loading={loading}
            />
          </div>
        </div>
      </section>
      
      {/* Sample Order Status */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900 mb-4">
              Track Your Orders
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Stay updated on your order status in real-time
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <OrderStatus order={mockOrders[0]} />
          </div>
        </div>
      </section>
    </div>
  );
};