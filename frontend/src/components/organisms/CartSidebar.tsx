import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../../types';
import { Button } from '../atoms/Button';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">Your Cart</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X className="w-6 h-6 text-neutral-600" />
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-neutral-400" />
                </div>
                <p className="text-neutral-500 text-lg">Your cart is empty</p>
                <p className="text-neutral-400 text-sm mt-1">Add some delicious items to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((cartItem) => (
                  <div key={cartItem.id} className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-lg">
                    <img
                      src={cartItem.menuItem.image}
                      alt={cartItem.menuItem.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-neutral-900 truncate">
                        {cartItem.menuItem.name}
                      </h4>
                      <p className="text-sm text-neutral-600 mt-1">
                        ${cartItem.menuItem.price.toFixed(2)} each
                      </p>
                      
                      {cartItem.specialInstructions && (
                        <p className="text-xs text-neutral-500 mt-1 italic">
                          Note: {cartItem.specialInstructions}
                        </p>
                      )}
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-neutral-300 rounded-lg">
                          <button
                            onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity - 1)}
                            className="px-2 py-1 hover:bg-neutral-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 text-center min-w-[2rem]">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                            className="px-2 py-1 hover:bg-neutral-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-neutral-900">
                            ${cartItem.subtotal.toFixed(2)}
                          </p>
                          <button
                            onClick={() => onRemoveItem(cartItem.id)}
                            className="text-xs text-accent-red hover:underline mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-neutral-200 p-6 bg-neutral-50">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="text-neutral-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Tax</span>
                  <span className="text-neutral-900">${(cartTotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-neutral-300">
                  <span className="text-neutral-900">Total</span>
                  <span className="text-primary-600">${(cartTotal * 1.1).toFixed(2)}</span>
                </div>
              </div>
              
              <Button onClick={onCheckout} size="lg" className="w-full">
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};