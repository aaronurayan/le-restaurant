import React, { useState, useMemo } from 'react';
import { Hero } from '../components/organisms/Hero';
import { CategoryFilter } from '../components/organisms/CategoryFilter';
import { MenuGrid } from '../components/organisms/MenuGrid';
import { OrderStatus } from '../components/organisms/OrderStatus';
import { mockCategories, mockMenuItems, mockOrders } from '../data/mockData';
import { MenuItem } from '../types';

interface HomeProps {
  onAddToCart: (item: MenuItem, quantity: number) => void;
  favoritedItems: Set<string>;
  onFavorite: (item: MenuItem) => void;
}

//This is a comment in the order management branch
export const Home: React.FC<HomeProps> = ({
  onAddToCart,
  favoritedItems,
  onFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return mockMenuItems;
    return mockMenuItems.filter(item => item.categoryId === selectedCategory);
  }, [selectedCategory]);

  const handleCategorySelect = (categoryId: string | null) => {
    setLoading(true);
    setSelectedCategory(categoryId);
    
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 300);
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
            categories={mockCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
          
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