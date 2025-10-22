import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import { useOrderApi } from '../hooks/useOrderApi';
import { OrderCreateRequestDto, OrderType } from '../types/order';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { CartItemSkeleton } from '../components/molecules/CartItemSkeleton';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const { createOrder, loading, error } = useOrderApi();

  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const orderRequest: OrderCreateRequestDto = {
      customerId: user.id,
      orderType,
      items: cartItems.map(ci => ({
        menuItemId: Number(ci.menuItem.id),
        quantity: ci.quantity
      })),
      specialInstructions: specialInstructions || undefined,
      tipAmount: tipAmount || undefined,
    };

    try {
      await createOrder(orderRequest);
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Failed to create order', err);
    }
  };

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-medium">Items</h3>
          <div className="space-y-3 mt-3">
            {loading ? (
              <div className="space-y-3">
                <CartItemSkeleton />
                <CartItemSkeleton />
                <CartItemSkeleton />
              </div>
            ) : cartItems.length === 0 ? (
              <p className="text-neutral-600">Your cart is empty.</p>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between border p-3 rounded">
                  <div>
                    <div className="font-medium">{item.menuItem.name}</div>
                    <div className="text-sm text-neutral-500">{item.quantity} × ${item.menuItem.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-semibold">${item.subtotal.toFixed(2)}</div>
                    <button 
                      className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50 disabled:hover:text-red-500" 
                      onClick={() => removeFromCart(item.id)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="orderType">
            Order Type
          </label>
          <select
            id="orderType"
            value={orderType}
            onChange={e => setOrderType(e.target.value as OrderType)}
            className="border rounded px-3 py-2 w-full disabled:opacity-50 disabled:bg-neutral-50"
            disabled={loading}
          >
            <option value="DINE_IN">Dine In</option>
            <option value="TAKEOUT">Takeout</option>
            <option value="DELIVERY">Delivery</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="tipAmount">
            Tip Amount
          </label>
          <input
            id="tipAmount"
            type="number"
            min="0"
            step="0.01"
            value={tipAmount}
            onChange={e => setTipAmount(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full disabled:opacity-50 disabled:bg-neutral-50"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="specialInstructions">
            Special Instructions
          </label>
          <textarea
            id="specialInstructions"
            value={specialInstructions}
            onChange={e => setSpecialInstructions(e.target.value)}
            className="border rounded px-3 py-2 w-full disabled:opacity-50 disabled:bg-neutral-50"
            rows={3}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between mt-6">
          <div>
            <div className="text-sm text-neutral-500">Total (with tip)</div>
            <div className="text-xl font-semibold">
              ${(cartTotal + tipAmount).toFixed(2)}
            </div>
          </div>
          <div className="text-right">
            <button
              onClick={handlePlaceOrder}
              disabled={loading || cartItems.length === 0}
              className={`
                px-4 py-2 rounded text-white 
                ${loading || cartItems.length === 0 
                  ? 'bg-neutral-400 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700 transition-colors'
                }
                flex items-center
              `}
            >
              {loading && <LoadingSpinner size="sm" variant="white" className="mr-2" />}
              {loading ? 'Placing order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};