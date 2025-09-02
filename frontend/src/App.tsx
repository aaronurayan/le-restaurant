import React from 'react';
import { Home } from './pages/Home';
import { MainLayout } from './components/templates/MainLayout';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

function App() {
  const [favoritedItems, setFavoritedItems] = React.useState<Set<string>>(new Set());
  const [cartItemCount, setCartItemCount] = React.useState(0);

  const handleAddToCart = (item: any, quantity: number) => {
    console.log('Add to cart:', item, quantity);
    setCartItemCount(prev => prev + quantity);
    // TODO: 장바구니 로직 구현
  };

  const handleFavorite = (item: any) => {
    const newFavoritedItems = new Set(favoritedItems);
    if (newFavoritedItems.has(item.id)) {
      newFavoritedItems.delete(item.id);
    } else {
      newFavoritedItems.add(item.id);
    }
    setFavoritedItems(newFavoritedItems);
  };

  const handleCartClick = () => {
    console.log('Cart clicked');
    // TODO: 장바구니 사이드바 열기
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
      </div>
    </AuthProvider>
  );
}

export default App;