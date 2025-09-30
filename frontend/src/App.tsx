import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/templates/MainLayout';
import { CartSidebar } from './components/organisms/CartSidebar';
import { NotificationContainer } from './components/organisms/NotificationContainer';
import { Home } from './pages/Home';
import { Orders } from './pages/Orders'; // import your Orders page
import { useCart } from './hooks/useCart';
import { MenuItem } from './types';
import './index.css';

function App() {
  const {
    cartItems,
    cartTotal,
    cartItemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [favoritedItems, setFavoritedItems] = React.useState<Set<string>>(new Set());
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    addToCart(item, quantity);
  };

  const handleFavorite = (item: MenuItem) => {
    const newFavoritedItems = new Set(favoritedItems);
    if (newFavoritedItems.has(item.id)) {
      newFavoritedItems.delete(item.id);
    } else {
      newFavoritedItems.add(item.id);
    }
    setFavoritedItems(newFavoritedItems);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    // TODO: Integrate with Payment Management flow
    alert('Proceeding to checkout (mock)');
    setIsCartOpen(false);
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
