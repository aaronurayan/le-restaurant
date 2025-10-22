import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import PaymentManagementPanel from './components/organisms/PaymentManagementPanel';
import MenuManagementPanel from './components/organisms/MenuManagementPanel';
import DeliveryManagement from './pages/DeliveryManagement';
import DeliveryTracking from './pages/DeliveryTracking';
import DeliveryDashboard from './pages/DeliveryDashboard';
import AdminDashboard from './components/organisms/AdminDashboard';
import CustomerDashboard from './components/organisms/CustomerDashboard';
import CustomerReservationsPage from './pages/CustomerReservationsPage';
import { MainLayout } from './components/templates/MainLayout';
import ProtectedRoute from './components/routes/ProtectedRoute';
import { UserRole } from './types/user';
import { AuthProvider } from './contexts/AuthContext';
import { CartSidebar } from './components/organisms/CartSidebar';
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
  } = useCart();

  const [favoritedItems, setFavoritedItems] = React.useState<Set<string>>(new Set());
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [redirectToCheckout, setRedirectToCheckout] = React.useState(false);

  // ✅ Normalize ID to string for safe handling
  const handleFavorite = (item: MenuItem) => {
    const id = String(item.id);
    const newFavoritedItems = new Set(favoritedItems);

    if (newFavoritedItems.has(id)) {
      newFavoritedItems.delete(id);
    } else {
      newFavoritedItems.add(id);
    }

    setFavoritedItems(newFavoritedItems);
  };

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    addToCart(item, quantity);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setRedirectToCheckout(true);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <MainLayout
            cartItemCount={cartItemCount}
            onCartClick={handleCartClick}
          >
            {redirectToCheckout && <Navigate to="/checkout" replace />}
            <CartSidebar
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              cartItems={cartItems}
              cartTotal={cartTotal}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onCheckout={handleCheckout}
            />
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

              {/* Admin Dashboard */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={[UserRole.ADMIN, UserRole.MANAGER]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Customer Dashboard */}
              <Route
                path="/customer/dashboard"
                element={
                  <ProtectedRoute roles={[UserRole.CUSTOMER]}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Customer Reservations (F108) */}
              <Route
                path="/customer/reservations"
                element={
                  <ProtectedRoute roles={[UserRole.CUSTOMER]}>
                    <CustomerReservationsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/menu"
                element={
                  <ProtectedRoute roles={[UserRole.ADMIN, UserRole.MANAGER]}>
                    <MenuManagementPanel isOpen={true} onClose={() => window.history.back()} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute roles={[UserRole.ADMIN, UserRole.MANAGER]}>
                    <PaymentManagementPanel
                      isOpen={true}
                      onClose={() => window.history.back()}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/delivery"
                element={
                  <ProtectedRoute roles={[UserRole.ADMIN, UserRole.MANAGER]}>
                    <DeliveryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/delivery/dashboard"
                element={
                  <ProtectedRoute roles={[UserRole.ADMIN, UserRole.MANAGER]}>
                    <DeliveryDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/delivery/tracking/:deliveryId"
                element={
                  <ProtectedRoute roles={[UserRole.ADMIN, UserRole.MANAGER]}>
                    <DeliveryTracking />
                  </ProtectedRoute>
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
