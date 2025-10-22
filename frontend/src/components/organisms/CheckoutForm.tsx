import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { OrderTypeBadge } from '../atoms/OrderTypeBadge';
import { OrderItemCard } from '../molecules/OrderItemCard';
import { OrderSummaryCard } from '../molecules/OrderSummaryCard';
import { CartItemSkeleton } from '../molecules/CartItemSkeleton';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../contexts/AuthContext';
import { useOrderApi } from '../../hooks/useOrderApi';
import { OrderCreateRequestDto, OrderType } from '../../types/order';

/**
 * CheckoutForm Organism (F105)
 * 
 * Complete checkout form with cart items, order type selection, tip input,
 * special instructions, and order summary. Handles order creation and
 * navigation to payment processing.
 * 
 * Integrates with F104 (Menu/Cart) and F106 (Payment Management).
 * 
 * @component
 * @example
 * ```tsx
 * <CheckoutForm />
 * ```
 */

export interface CheckoutFormProps {
  onOrderCreated?: (orderId: number) => void;
  className?: string;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onOrderCreated,
  className = '',
}) => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder, loading, error } = useOrderApi();

  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');
  const [tipAmount, setTipAmount] = useState<string>('0');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // Calculate totals
  // NOTE: Frontend calculates for preview only. Backend is source of truth.
  // Backend OrderService applies TAX_RATE = 0.10 and recalculates all amounts.
  const subtotal = cartTotal;
  const tax = subtotal * 0.1; // 10% tax (matches backend)
  const tip = parseFloat(tipAmount) || 0;
  const total = subtotal + tax + tip;

  const validateForm = (): boolean => {
    if (!user) {
      setValidationError('Please login to place an order');
      return false;
    }

    if (cartItems.length === 0) {
      setValidationError('Your cart is empty');
      return false;
    }

    if (tip < 0) {
      setValidationError('Tip amount cannot be negative');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    const orderRequest: OrderCreateRequestDto = {
      customerId: user!.id,
      orderType,
      items: cartItems.map(ci => ({
        menuItemId: Number(ci.menuItem.id),
        quantity: ci.quantity,
      })),
      specialInstructions: specialInstructions || undefined,
      tipAmount: tip > 0 ? tip : undefined,
    };

    try {
      const createdOrder = await createOrder(orderRequest);
      
      // Clear cart before navigation
      clearCart();
      localStorage.removeItem('cart'); // Double ensure localStorage is cleared
      
      if (onOrderCreated && createdOrder) {
        onOrderCreated(createdOrder.id);
      }
      
      // Navigate to payment page (F106 integration)
      navigate('/payment', { state: { orderId: createdOrder?.id } });
    } catch (err) {
      console.error('Failed to create order:', err);
      setValidationError('Failed to create order. Please try again.');
    }
  };

  const handleTipChange = (value: string) => {
    // Allow only valid number inputs
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setTipAmount(value);
      setValidationError('');
    }
  };

  if (!user) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <ShoppingBag className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">Login Required</h3>
        <p className="text-neutral-600 mb-4">Please login to place an order</p>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Checkout</h2>
        </div>

        {/* Error Messages */}
        {(error || validationError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-0.5">{error || validationError}</p>
            </div>
          </div>
        )}

        {/* Cart Items Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Items</h3>
          <div className="space-y-3">
            {loading ? (
              <>
                <CartItemSkeleton />
                <CartItemSkeleton />
              </>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-8 bg-neutral-50 rounded-lg">
                <p className="text-neutral-600">Your cart is empty</p>
                <Button
                  onClick={() => navigate('/menu')}
                  variant="outline"
                  className="mt-4"
                >
                  Browse Menu
                </Button>
              </div>
            ) : (
              cartItems.map(item => (
                <OrderItemCard
                  key={item.id}
                  item={{
                    id: parseInt(item.id),
                    orderId: 0,
                    menuItemId: typeof item.menuItem.id === 'string' ? parseInt(item.menuItem.id) : item.menuItem.id,
                    menuItemName: item.menuItem.name,
                    quantity: item.quantity,
                    unitPrice: item.menuItem.price,
                    subtotal: item.subtotal,
                  }}
                  editable={false}
                  loading={loading}
                />
              ))
            )}
          </div>
        </div>

        {/* Order Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-900 mb-3">
            Order Type
          </label>
          <div className="flex flex-wrap gap-3">
            {(['DINE_IN', 'TAKEOUT', 'DELIVERY'] as OrderType[]).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setOrderType(type)}
                className={`
                  px-4 py-2 rounded-lg border-2 transition-all
                  ${orderType === type
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }
                `}
                disabled={loading}
              >
                <OrderTypeBadge type={type} showIcon />
              </button>
            ))}
          </div>
        </div>

        {/* Tip Amount */}
        <div className="mb-6">
          <Input
            type="number"
            label="Tip Amount (Optional)"
            placeholder="0.00"
            value={tipAmount}
            onChange={handleTipChange}
            disabled={loading}
            helperText="Add a tip for excellent service"
          />
        </div>

        {/* Special Instructions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-900 mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special requests? (e.g., no onions, extra spicy)"
            disabled={loading}
            rows={3}
            className="
              w-full px-4 py-3 rounded-lg border border-neutral-300
              focus:ring-2 focus:ring-primary-500 focus:border-transparent
              disabled:bg-neutral-100 disabled:cursor-not-allowed
              transition-all
            "
            maxLength={500}
          />
          <p className="text-xs text-neutral-500 mt-1">
            {specialInstructions.length}/500 characters
          </p>
        </div>

        {/* Order Summary */}
        <OrderSummaryCard
          subtotal={subtotal}
          taxAmount={tax}
          tipAmount={tip}
          totalAmount={total}
          className="mb-6"
        />

        {/* Place Order Button */}
        <Button
          onClick={handlePlaceOrder}
          disabled={loading || cartItems.length === 0}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <LoadingSpinner className="mr-2" />
              Processing Order...
            </>
          ) : (
            <>Place Order & Pay</>
          )}
        </Button>

        <p className="text-xs text-neutral-500 text-center mt-3">
          By placing this order, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
};

export default CheckoutForm;
