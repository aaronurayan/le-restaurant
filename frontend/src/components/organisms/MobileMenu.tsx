import React from 'react';
import { Link } from 'react-router-dom';
import { X, Menu as MenuIcon, LayoutDashboard, Calendar, Package, ShoppingBag, ClipboardList, Users, Truck, CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  cartItemCount: number;
  onCartClick: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  cartItemCount,
  onCartClick,
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Menu Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-serif text-xl font-bold text-neutral-900">
                Le Restaurant
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-neutral-600" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {/* Public Links */}
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-orange-light hover:text-primary-orange transition-colors"
              >
                <MenuIcon className="w-5 h-5" />
                <span className="font-medium">Menu</span>
              </Link>

              {/* Customer Links */}
              {isAuthenticated && user?.role === 'customer' && (
                <>
                  <div className="pt-4 pb-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide px-4">
                      My Account
                    </p>
                  </div>
                  <Link
                    to="/customer/dashboard"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-orange-light hover:text-primary-orange transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>My Dashboard</span>
                  </Link>
                  <Link
                    to="/customer/orders"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-orange-light hover:text-primary-orange transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/customer/reservations"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-orange-light hover:text-primary-orange transition-colors"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>My Reservations</span>
                  </Link>
                  <Link
                    to="/customer/profile"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-orange-light hover:text-primary-orange transition-colors"
                  >
                    <Users className="w-5 h-5" />
                    <span>My Profile</span>
                  </Link>
                </>
              )}

              {/* Admin/Manager Links */}
              {(user?.role === 'admin' || user?.role === 'manager') && (
                <>
                  <div className="pt-4 pb-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide px-4">
                      Management
                    </p>
                  </div>
                  <Link
                    to="/admin/dashboard"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-orange-light hover:text-primary-orange transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                  <Link
                    to="/admin/menu"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-orange-light hover:text-primary-orange transition-colors"
                  >
                    <ClipboardList className="w-5 h-5" />
                    <span>Menu Management</span>
                  </Link>
                  <Link
                    to="/admin/reservations"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-orange-light hover:text-primary-orange transition-colors"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Reservation Management</span>
                  </Link>
                  <Link
                    to="/admin/users"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-orange-light hover:text-primary-orange transition-colors"
                  >
                    <Users className="w-5 h-5" />
                    <span>User Management</span>
                  </Link>
                  <Link
                    to="/delivery"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-orange-light hover:text-primary-orange transition-colors"
                  >
                    <Truck className="w-5 h-5" />
                    <span>Delivery Management</span>
                  </Link>
                  <Link
                    to="/payments"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-orange-light hover:text-primary-orange transition-colors"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Management</span>
                  </Link>
                </>
              )}

              {/* Cart Button */}
              <button
                onClick={() => {
                  onCartClick();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-primary-orange-light hover:text-primary-orange transition-colors relative"
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Cart</span>
                {cartItemCount > 0 && (
                  <span className="ml-auto bg-primary-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-neutral-200 p-4">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-status-error hover:bg-status-error-light transition-colors font-medium"
              >
                <span>Logout</span>
              </button>
            ) : (
              <p className="text-sm text-neutral-500 text-center">
                <button
                  onClick={onClose}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign in
                </button>
                {' '}to access your account
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

