import React from 'react';
import { MenuItem } from '../../types';
import { MenuCard } from '../molecules/MenuCard';

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onFavorite: (item: MenuItem) => void;
  favoritedItems: Set<string>;
  loading?: boolean;
}

const MenuCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-neutral-200" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-neutral-200 rounded w-3/4" />
      <div className="h-4 bg-neutral-200 rounded w-full" />
      <div className="h-4 bg-neutral-200 rounded w-2/3" />
      <div className="h-10 bg-neutral-200 rounded w-full" />
    </div>
  </div>
);

export const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  onAddToCart,
  onFavorite,
  favoritedItems,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <MenuCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🍽️</span>
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">No items found</h3>
        <p className="text-neutral-600">Try selecting a different category or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          onAddToCart={onAddToCart}
          onFavorite={onFavorite}
          isFavorited={favoritedItems.has(item.id)}
          className="animate-fade-in"
        />
      ))}
    </div>
  );
};