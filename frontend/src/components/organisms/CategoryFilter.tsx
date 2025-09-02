import React from 'react';
import { MenuCategory } from '../../types';

interface CategoryFilterProps {
  categories: MenuCategory[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="bg-white border-b border-neutral-100 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto py-4 space-x-2 scrollbar-hide">
          {/* All Categories Button */}
          <button
            onClick={() => onCategorySelect(null)}
            className={`
              px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200
              ${selectedCategory === null
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }
            `}
          >
            All Items
          </button>
          
          {/* Category Buttons */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`
                px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200
                ${selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }
              `}
            >
              {category.name}
              <span className="ml-2 text-xs opacity-75">
                ({category.itemCount})
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};