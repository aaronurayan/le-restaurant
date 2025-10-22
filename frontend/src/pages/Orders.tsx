import React, { useEffect } from 'react';
import { OrderStatus } from '../components/organisms/OrderStatus';
import { useOrderApi } from '../hooks/useOrderApi';
import { useAuth } from '../contexts/AuthContext';

interface OrdersProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export const Orders: React.FC<OrdersProps> = () => {
  const { user } = useAuth();
  const { orders, getOrdersByCustomer, loading, error } = useOrderApi();

  useEffect(() => {
    if (user && user.id) {
      getOrdersByCustomer(user.id).catch(console.error);
    }
  }, [user, getOrdersByCustomer]);

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
          {loading && <p>Loading orders...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && orders && orders.length === 0 && (
            <p className="text-neutral-600">No orders found.</p>
          )}

          {!loading && !error && orders && orders.length > 0 && orders.map((order) => (
            <OrderStatus key={order.id} order={order} />
          ))}
        </div>
      </div>
    </section>
  );
};
