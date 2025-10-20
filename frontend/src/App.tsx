import React from 'react';
import { Home } from './pages/Home';
import { MainLayout } from './components/templates/MainLayout';
import { AuthProvider } from './contexts/AuthContext';
import { CartSidebar } from './components/organisms/CartSidebar';
import { useCart } from './hooks/useCart';
import { MenuItem } from './types';
import { placeOrder } from "./services/orderService";
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

  const handleCheckout = async () => {
    try {
      const orderPayload = {
        orderType: "DINE_IN", // or TAKEOUT/DELIVERY
        customer: { id: 1 },  
        specialInstructions: "",
        items: cartItems.map(ci => ({
          name: ci.menuItem.name,
          quantity: ci.quantity,
          price: ci.menuItem.price
        }))
      };

      const response = await placeOrder(orderPayload);
      alert(`Order placed! Order ID: ${response.data.id}`);

      clearCart(); // empty the cart after successful order
      setIsCartOpen(false);
    } catch (err) { 
      console.error(err);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <AuthProvider>
      <div className="App">
        <MainLayout
          cartItemCount={cartItemCount}
          onCartClick={handleCartClick}
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
      </div>
    </AuthProvider>
  );
}

export default App;