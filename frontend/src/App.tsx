import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/templates/MainLayout';
import { CartSidebar } from './components/organisms/CartSidebar';
import { NotificationContainer } from './components/organisms/NotificationContainer';
import { Home } from './pages/Home';
import { Orders } from './pages/Orders'; // import your Orders page
import { useCart } from './hooks/useCart';
import { MenuItem } from './types';
import { toast } from './utils/notifications';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favoritedItems, setFavoritedItems] = useState<Set<string>>(new Set());
  
  const {
    cartItems,
    cartTotal,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    addToCart(item, quantity);
    toast.success(`${item.name} added to cart!`);
  };

  const handleFavorite = (item: MenuItem) => {
    setFavoritedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item.id)) {
        newSet.delete(item.id);
        toast.info(`${item.name} removed from favorites`);
      } else {
        newSet.add(item.id);
        toast.success(`${item.name} added to favorites!`);
      }
      return newSet;
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    toast.success('Order placed successfully! You will receive a confirmation email shortly.');
    setIsCartOpen(false);
    clearCart();
  };

  return (
    <Router>
      <div className="App">
        <MainLayout
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
        >
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onAddToCart={handleAddToCart}
                  favoritedItems={favoritedItems}
                  onFavorite={handleFavorite}
                />
              }
            />
            <Route
              path="/orders"
              element={
                <Orders
                  cartItemCount={cartItemCount}   // pass cart count
                  onCartClick={() => setIsCartOpen(true)} // pass cart toggle
                />
              }
            />
          </Routes>
        </MainLayout>
        
        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          cartTotal={cartTotal}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
        />
        
        <NotificationContainer />
      </div>
    </Router>
  );
}

export default App;
