import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  User, 
  Menu as MenuIcon, 
  Calendar, 
  Truck, 
  CreditCard, 
  LayoutDashboard,
  Users,
  LogOut,
  Settings,
  Package,
  ClipboardList
} from 'lucide-react';
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
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showUserDropdown]);

  const handleUserClick = () => {
    if (isAuthenticated) {
      setShowUserDropdown(!showUserDropdown);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
  };

  const closeDropdown = () => {
    setShowUserDropdown(false);
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
            aria-label="Toggle mobile menu"
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
            
            {/* Admin/Manager Primary Navigation - Only Dashboard */}
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1 text-neutral-600 hover:text-primary-600 transition-colors font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
            
            {/* Customer Primary Navigation - Only Dashboard */}
            {user?.role === 'customer' && (
              <Link
                to="/customer/dashboard"
                className="flex items-center gap-1 text-neutral-600 hover:text-primary-600 transition-colors font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                My Dashboard
              </Link>
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
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleUserClick}
                className={`p-2 rounded-lg hover:bg-neutral-100 transition-colors flex items-center space-x-2 ${
                  showUserDropdown ? 'bg-neutral-100' : ''
                }`}
                aria-expanded={showUserDropdown ? 'true' : 'false'}
                aria-haspopup="true"
                aria-label={isAuthenticated ? 'User menu' : 'Sign in'}
              >
                <User className="w-6 h-6 text-neutral-600" />
                {isAuthenticated && (
                  <span className="hidden sm:block text-sm text-neutral-700">
                    {user?.firstName} {user?.lastName}
                  </span>
                )}
              </button>
              
              {/* User Dropdown Menu - Controlled visibility */}
              {isAuthenticated && showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-sm font-semibold text-neutral-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                    <p className="text-xs text-primary-orange mt-1 font-medium capitalize">
                      {user?.role}
                    </p>
                  </div>
                  
                  {/* CUSTOMER MENU */}
                  {user?.role === 'customer' && (
                    <>
                      <div className="py-1">
                        <Link
                          to="/customer/dashboard"
                          onClick={closeDropdown}
                          className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-orange-light transition-colors flex items-center gap-3 group"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary-orange group-hover:text-primary-orange-dark" />
                          <span className="font-medium">My Dashboard</span>
                        </Link>
                        
                        <button
                          onClick={() => {
                            setShowReservationModal(true);
                            closeDropdown();
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-orange-light transition-colors flex items-center gap-3 group"
                        >
                          <Calendar className="w-4 h-4 text-neutral-500 group-hover:text-primary-orange" />
                          <span>Make Reservation</span>
                        </button>

                        <Link
                          to="/customer/orders"
                          onClick={closeDropdown}
                          className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-orange-light transition-colors flex items-center gap-3 group"
                        >
                          <Package className="w-4 h-4 text-neutral-500 group-hover:text-primary-orange" />
                          <span>My Orders</span>
                        </Link>

                        <Link
                          to="/customer/reservations"
                          onClick={closeDropdown}
                          className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-orange-light transition-colors flex items-center gap-3 group"
                        >
                          <ClipboardList className="w-4 h-4 text-neutral-500 group-hover:text-primary-orange" />
                          <span>My Reservations</span>
                        </Link>
                      </div>

                      <div className="border-t border-neutral-100 my-1"></div>

                      <Link
                        to="/customer/profile"
                        onClick={closeDropdown}
                        className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-3 group"
                      >
                        <Settings className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700" />
                        <span>Account Settings</span>
                      </Link>
                    </>
                  )}
                  
                  {/* ADMIN/MANAGER MENU */}
                  {(user?.role === 'admin' || user?.role === 'manager') && (
                    <>
                      <div className="py-1">
                        <Link
                          to="/admin/dashboard"
                          onClick={closeDropdown}
                          className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-orange-light transition-colors flex items-center gap-3 group"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary-orange group-hover:text-primary-orange-dark" />
                          <span className="font-medium">Admin Dashboard</span>
                        </Link>
                      </div>

                      <div className="border-t border-neutral-100 my-1"></div>
                      <div className="px-3 py-1.5">
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                          Management
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setShowUserManagement(true);
                          closeDropdown();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-3 group"
                      >
                        <Users className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700" />
                        <span>User Management</span>
                      </button>

                      <Link
                        to="/delivery"
                        onClick={closeDropdown}
                        className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-3 group"
                      >
                        <Truck className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700" />
                        <span>Delivery Management</span>
                      </Link>

                      <Link
                        to="/payments"
                        onClick={closeDropdown}
                        className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-3 group"
                      >
                        <CreditCard className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700" />
                        <span>Payment Management</span>
                      </Link>

                      <div className="border-t border-neutral-100 my-1"></div>

                      <button
                        onClick={() => {
                          setShowReservationModal(true);
                          closeDropdown();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-3 group"
                      >
                        <Calendar className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700" />
                        <span>Book Table</span>
                      </button>
                    </>
                  )}
                  
                  {/* Logout - Common for all roles */}
                  <div className="border-t border-neutral-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-status-error hover:bg-status-error-light transition-colors flex items-center gap-3 group"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
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