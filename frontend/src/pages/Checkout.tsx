import React from 'react';
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
  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <CheckoutForm />
    </section>
  );
};