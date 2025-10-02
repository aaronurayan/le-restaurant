import React, { useState } from 'react';
import { Heart, Clock, Plus, Minus } from 'lucide-react';
import { MenuItem } from '../../types';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onFavorite: (item: MenuItem) => void;
  isFavorited?: boolean;
  className?: string;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onAddToCart,
  onFavorite,
  isFavorited = false,
  className = '',
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onAddToCart(item, quantity);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`
      bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300
      overflow-hidden border border-neutral-100 group
      ${!item.isAvailable ? 'opacity-75' : ''}
      ${className}
    `}>
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Availability Badge */}
        {!item.isAvailable && (
          <div className="absolute top-3 right-3 bg-accent-red text-white px-3 py-1 rounded-full text-xs font-semibold">
            Out of Stock
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={() => onFavorite(item)}
          className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-md"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorited ? 'text-accent-red fill-current' : 'text-neutral-400'
            }`}
          />
        </button>
      </div>
      
      {/* Content Section */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1 flex-1 mr-3">
            {item.name}
          </h3>
          <span className="text-xl font-bold text-primary-600 whitespace-nowrap">
            ${item.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        
        {/* Dietary Tags */}
        {item.dietaryTags && item.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.dietaryTags.map((tag) => (
              <Badge key={tag} variant="secondary" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Preparation Time */}
        {item.preparationTime && (
          <div className="flex items-center text-neutral-500 text-sm mb-4">
            <Clock className="w-4 h-4 mr-1" />
            {item.preparationTime} min
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 hover:bg-neutral-100 transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 hover:bg-neutral-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <Button
            onClick={handleAddToCart}
            loading={isLoading}
            disabled={!item.isAvailable}
            className="flex-1"
            size="md"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};