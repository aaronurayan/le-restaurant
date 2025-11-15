import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CheckoutForm from '../components/organisms/CheckoutForm';

/**
 * Checkout Page (F105)
 * 
 * Customer checkout page for reviewing cart items and placing orders.
 * Integrates with F104 (Menu/Cart) and F106 (Payment Management).
 * 
 * User Flow: Menu → Cart → Checkout → Payment
 */

export const Checkout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Menu</span>
        </button>
        <CheckoutForm />
      </div>
    </section>
  );
};