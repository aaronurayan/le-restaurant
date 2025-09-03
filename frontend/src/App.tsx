import React, { useState } from 'react';
import { MainLayout } from './components/templates/MainLayout';
import { CartSidebar } from './components/organisms/CartSidebar';
import { NotificationContainer } from './components/organisms/NotificationContainer';
import { Home } from './pages/Home';
import { useCart } from './hooks/useCart';
import { MenuItem } from './types';
import { toast } from './utils/notifications';
import RegisterForm from './components/molecules/RegisterForm';
import LoginForm from './components/molecules/LoginForm';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favoritedItems, setFavoritedItems] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<string | null>(null);
  
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

  const handleLogin = (email: string) => {
    setUser(email);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleRegister = (email: string) => {
    setUser(email);
  };

  return (
    <div className="App">
      {!user ? (
        <>
          <LoginForm onLogin={handleLogin} />
          <RegisterForm onRegister={handleRegister} />
        </>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <MainLayout
            cartItemCount={cartItemCount}
            onCartClick={() => setIsCartOpen(true)}
          >
            <Home
              onAddToCart={handleAddToCart}
              favoritedItems={favoritedItems}
              onFavorite={handleFavorite}
            />
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
        </>
      )}
    </div>
  );
}

export default App;