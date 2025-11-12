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
      
      // Step 3: Update payment status to COMPLETED
      if (createdPayment.id) {
        await processPayment(createdPayment.id);
      }
      
      // Step 4: Update order status to CONFIRMED after successful payment
      await updateOrderStatus(orderId, 'CONFIRMED' as OrderStatus);
      
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
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Payment Successful!</h2>
          <p className="text-neutral-600 mb-6">
            Your order #{orderId} has been confirmed and is being prepared.
          </p>
          <p className="text-neutral-600 mb-6">
            You will be redirected to your order details page...
          </p>
          <Button onClick={() => navigate(`/customer/orders/${orderId}`)}>
            View Order Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/checkout')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Checkout</span>
        </button>
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center">
          <CreditCard className="w-6 h-6 mr-2" />
          Payment Details
        </h1>
        <p className="text-neutral-600 mt-1">
          Complete your payment for Order #{orderId}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmitPayment}>
          <div className="mb-4">
            <Input
              type="text"
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={formValues.cardNumber}
              onChange={handleInputChange('cardNumber')}
              maxLength={19}
              required
            />
          </div>
          
          <div className="mb-4">
            <Input
              type="text"
              label="Name on Card"
              placeholder="John Doe"
              value={formValues.cardName}
              onChange={handleInputChange('cardName')}
              required
            />
          </div>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                label="Expiry Date"
                placeholder="MM/YY"
                value={formValues.expiryDate}
                onChange={handleInputChange('expiryDate')}
                maxLength={5}
                required
              />
            </div>
            <div className="w-1/3">
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
          
          <div className="mt-4 text-center">
            <p className="text-xs text-neutral-500">
              This is a demo application. No real payments are processed.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;