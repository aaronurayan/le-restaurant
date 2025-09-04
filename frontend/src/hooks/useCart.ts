import { useState, useCallback } from 'react';
import { CartItem, MenuItem } from '../types';

// this is a comment
export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((menuItem: MenuItem, quantity: number = 1, specialInstructions?: string) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.menuItem.id === menuItem.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.menuItem.id === menuItem.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * menuItem.price,
                specialInstructions: specialInstructions || item.specialInstructions,
              }
            : item
        );
      }

      const newItem: CartItem = {
        id: `cart-${menuItem.id}-${Date.now()}`,
        menuItem,
        quantity,
        specialInstructions,
        subtotal: quantity * menuItem.price,
      };

      return [...prev, newItem];
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === cartItemId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.menuItem.price,
            }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce((total, item) => total + item.subtotal, 0);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return {
    cartItems,
    cartTotal,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};