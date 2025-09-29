import React from 'react';
import { OrderStatus } from '../components/organisms/OrderStatus';
import { mockOrders } from '../data/mockData';

interface OrdersProps {
  // You can keep these if needed for the header in MainLayout
  cartItemCount?: number;
  onCartClick?: () => void;
}

export const Orders: React.FC<OrdersProps> = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900 mb-4">
            Your Orders
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Track and review your orders here.
          </p>
        </div>

        <div className="space-y-8 max-w-3xl mx-auto">
          {mockOrders.map((order) => (
            <OrderStatus key={order.id} order={order} />
          ))}
        </div>
      </div>
    </section>
  );
};
