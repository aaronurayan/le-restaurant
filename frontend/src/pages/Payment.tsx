import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Check, ArrowLeft } from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { useOrderApi } from '../hooks/useOrderApi';
import { usePayment } from '../hooks/usePaymentApi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../hooks/useCart';
import { OrderStatus } from '../types/order';
import { PaymentMethod } from '../types/payment';

/**
 * Payment Page Component (F105/F106 integration)
 * Handles payment processing after checkout
 */
const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus, loading: orderLoading, error: orderError } = useOrderApi();
  const { createPayment, processPayment, loading: paymentLoading, error: paymentError } = usePayment();
  const { user } = useAuth();
  const { clearCart } = useCart();
  
  const [orderId, setOrderId] = useState<number | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [formValues, setFormValues] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  
  const loading = orderLoading || paymentLoading;
  const error = orderError || paymentError;

  useEffect(() => {
    // Get orderId from location state
    const state = location.state as { orderId?: number };
    if (state?.orderId) {
      setOrderId(state.orderId);
      
      // Load order details
      getOrderById(state.orderId)
        .then(orderData => {
          setOrder(orderData);
        })
        .catch(err => {
          console.error('Error loading order:', err);
        });
    } else {
      // No orderId provided, redirect to orders page
      navigate('/customer/orders');
    }
    
    // Cleanup function - make sure cart is cleared when navigating away
    return () => {
      if (paymentComplete) {
        clearCart();
        localStorage.removeItem('cart'); // Double ensure localStorage is cleared
      }
    };
  }, [location, navigate, getOrderById, paymentComplete, clearCart]);

  const handleInputChange = (name: string) => (value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Simple validation - in a real app, you'd have more robust validation
    return (
      formValues.cardNumber.replace(/\s/g, '').length === 16 &&
      formValues.cardName.trim() !== '' &&
      formValues.expiryDate.match(/^\d{2}\/\d{2}$/) &&
      formValues.cvv.match(/^\d{3,4}$/)
    );
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId || !order || !user || !validateForm()) {
      return;
    }

    setProcessingPayment(true);

    try {
      // Step 1: Create payment record (F106)
      const totalAmount = order.totalAmount || (order.subtotal || 0) + (order.taxAmount || 0) + (order.tipAmount || 0);
      
      const paymentData = {
        orderId: orderId,
        amount: totalAmount,
        currency: 'USD',
        method: PaymentMethod.CREDIT_CARD,
        paymentDetails: {
          cardLast4: formValues.cardNumber.replace(/\s/g, '').slice(-4),
          cardName: formValues.cardName,
          expiryDate: formValues.expiryDate,
        },
        customerName: (user.firstName || '') + ' ' + (user.lastName || ''),
        customerEmail: user.email || '',
      };
      
      const createdPayment = await createPayment(paymentData);
      
      if (!createdPayment) {
        throw new Error('Failed to create payment');
      }
      
      // Step 2: Process payment (simulate payment gateway processing)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 3: Process payment (updates payment status to COMPLETED and order status to CONFIRMED automatically)
      if (createdPayment.id) {
        await processPayment(createdPayment.id);
        // Note: Order status is now automatically updated to CONFIRMED by PaymentService.processPayment()
      }
      
      // Clear the cart after successful payment
      clearCart();
      localStorage.removeItem('cart'); // Double ensure localStorage is cleared
      
      setPaymentComplete(true);
      
      // Redirect to order details page after 2 seconds
      setTimeout(() => {
        navigate(`/customer/orders/${orderId}`);
      }, 2000);
    } catch (err) {
      console.error('Payment processing error:', err);
      alert('Payment processing failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading payment details..." variant="primary" />
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <main className="bg-neutral-50 min-h-screen py-12">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-9 h-9 text-green-600" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-3">Payment Confirmed</h2>
            <p className="text-neutral-600 mb-6">
              Your order #{orderId} is now in the kitchen queue. We’ve preserved all celebration notes and pairings.
            </p>
            <Button onClick={() => navigate(`/customer/orders/${orderId}`)}>
              View Order Details
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-neutral-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/checkout')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Checkout</span>
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <section className="bg-white rounded-3xl shadow-lg border border-neutral-100 p-6">
            <h1 className="text-3xl font-serif font-bold text-neutral-900 flex items-center mb-2">
              <CreditCard className="w-6 h-6 mr-3" />
              Experience Confirmation
            </h1>
            <p className="text-neutral-600 mb-6">
              Secure order #{orderId}. Chef and courier timelines update as soon as payment clears.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <Input
                type="text"
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={formValues.cardNumber}
                onChange={handleInputChange('cardNumber')}
                maxLength={19}
                required
              />
              <Input
                type="text"
                label="Name on Card"
                placeholder="Full Name"
                value={formValues.cardName}
                onChange={handleInputChange('cardName')}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={formValues.expiryDate}
                  onChange={handleInputChange('expiryDate')}
                  maxLength={5}
                  required
                />
                <Input
                  type="text"
                  label="CVV"
                  placeholder="123"
                  value={formValues.cvv}
                  onChange={handleInputChange('cvv')}
                  maxLength={4}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={processingPayment || !validateForm()}
              >
                {processingPayment ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing...
                  </>
                ) : (
                  'Complete Payment'
                )}
              </Button>
              <p className="text-xs text-neutral-500 text-center">
                This is a demo application. No real payments are processed.
              </p>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-400 mb-2">Order Summary</p>
              <h2 className="text-2xl font-serif text-neutral-900 mb-2">Tonight’s highlights</h2>
              <p className="text-sm text-neutral-600 mb-4">
                Chef Amélie and our couriers will finalize pacing once you confirm payment.
              </p>
              {order && (
                <div className="space-y-2 text-sm text-neutral-700">
                  <p>Subtotal: ${(order.subtotal || 0).toFixed(2)}</p>
                  <p>Tax: ${(order.taxAmount || 0).toFixed(2)}</p>
                  {order.tipAmount ? <p>Tip: ${(order.tipAmount || 0).toFixed(2)}</p> : null}
                  <p className="text-lg font-semibold text-primary-700">
                    Total: ${(order.totalAmount || (order.subtotal || 0) + (order.taxAmount || 0) + (order.tipAmount || 0)).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
            <div className="bg-primary-600 text-white rounded-3xl p-6">
              <h3 className="text-xl font-semibold mb-2">Concierge adjustments?</h3>
              <p className="text-sm text-primary-50 mb-4">
                Call us to tweak pairings, delivery timing, or celebration notes before confirming payment.
              </p>
              <button
                type="button"
                className="w-full rounded-full bg-white text-primary-700 font-semibold px-4 py-2"
                onClick={() => window.open('tel:+11234567890')}
              >
                +1 (123) 456-7890
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Payment;