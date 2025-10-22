import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types
interface CartItem {
  id: string;
  menuItem: {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
  };
  quantity: number;
  subtotal: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  cartTotal: number;
  cartItemCount: number;
  clearCart: () => void;
}

interface CartProviderProps {
  children: ReactNode;
  initialItems?: CartItem[];
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create provider
export const CartProvider: React.FC<CartProviderProps> = ({ children, initialItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);

  const addToCart = (newItem: CartItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === newItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1, subtotal: item.menuItem.price * (item.quantity + 1) }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity, subtotal: item.menuItem.price * quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartItemCount,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};