import React, { useState } from 'react';
import { ShoppingCart, User, Menu as MenuIcon, Calendar, Truck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../atoms/Button';
import ApiStatusIndicator from '../atoms/ApiStatusIndicator';
import AuthModal from './AuthModal';
import UserManagementPanel from './UserManagementPanel';
import ReservationModal from './ReservationModal';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  onCartClick,
  onMenuToggle,
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleUserClick = () => {
    if (isAuthenticated) {
      // 로그인된 상태: 드롭다운 메뉴 표시
      // TODO: 사용자 드롭다운 메뉴 구현
      console.log('User menu clicked');
    } else {
      // 로그인되지 않은 상태: 인증 모달 표시
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="bg-white shadow-md border-b border-neutral-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <MenuIcon className="w-6 h-6 text-neutral-600" />
          </button>
          
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-serif text-xl font-bold text-neutral-900 hidden sm:block">
                Le Restaurant
              </span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
              Menu
            </Link>
            <a href="#about" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
              About
            </a>
            <a href="#contact" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
              Contact
            </a>
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <>
                <Link
                  to="/delivery"
                  className="flex items-center gap-1 text-neutral-600 hover:text-primary-600 transition-colors font-medium"
                >
                  <Truck className="w-4 h-4" />
                  Delivery
                </Link>
                <Link
                  to="/payments"
                  className="flex items-center gap-1 text-neutral-600 hover:text-primary-600 transition-colors font-medium"
                >
                  <CreditCard className="w-4 h-4" />
                  Payments
                </Link>
              </>
            )}
            
            {/* API Status Indicator */}
            <div className="border-l border-neutral-200 pl-6">
              <ApiStatusIndicator showDetails={false} />
            </div>
          </nav>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-neutral-600" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse-gentle">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>
            
            {/* User Profile Button */}
            <div className="relative">
              <button
                onClick={handleUserClick}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors flex items-center space-x-2"
              >
                <User className="w-6 h-6 text-neutral-600" />
                {isAuthenticated && (
                  <span className="hidden sm:block text-sm text-neutral-700">
                    {user?.firstName} {user?.lastName}
                  </span>
                )}
              </button>
              
              {/* User Dropdown Menu (로그인된 상태에서만) */}
              {isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-sm font-medium text-neutral-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-neutral-500">{user?.email}</p>
                  </div>
                  
                  {/* Book Table - All authenticated users */}
                  <button
                    onClick={() => setShowReservationModal(true)}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Table
                  </button>
                  
                  {/* User Management (Admin/Manager only) */}
                  {(user?.role === 'admin' || user?.role === 'manager') && (
                    <button
                      onClick={() => setShowUserManagement(true)}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      User Management
                    </button>
                  )}
                  
                  {/* Delivery & Payment Management (Admin/Manager only) */}
                  {(user?.role === 'admin' || user?.role === 'manager') && (
                    <>
                      <Link
                        to="/delivery"
                        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2"
                      >
                        <Truck className="w-4 h-4" />
                        Delivery Management
                      </Link>
                    </>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            
            {/* Action Buttons - Desktop */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Reservation Button - Only for authenticated users */}
              {isAuthenticated && (
                <Button 
                  variant="outline" 
                  size="md"
                  onClick={() => setShowReservationModal(true)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Table
                </Button>
              )}
              
              <Button variant="primary" size="md">
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* User Management Panel */}
      <UserManagementPanel
        isOpen={showUserManagement}
        onClose={() => setShowUserManagement(false)}
      />
      {/* Reservation Modal */}
      <ReservationModal
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
      />
      
    </>
  );
};