import React from 'react';
import { ShoppingCart, User, Menu as MenuIcon } from 'lucide-react';
import { Button } from '../atoms/Button';
import ApiStatusIndicator from '../atoms/ApiStatusIndicator';

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
  return (
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
            <a href="#menu" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
              Menu
            </a>
            <a href="#about" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
              About
            </a>
            <a href="#contact" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
              Contact
            </a>
            
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
            <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <User className="w-6 h-6 text-neutral-600" />
            </button>
            
            {/* Order Now Button - Desktop */}
            <Button variant="primary" size="md" className="hidden sm:flex">
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};