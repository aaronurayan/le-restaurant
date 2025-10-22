import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { useOrderApi } from '../hooks/useOrderApi';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { EmptyState } from '../components/molecules/EmptyState';
import OrderDetailsPanel from '../components/organisms/OrderDetailsPanel';
import { OrderStatus } from '../types/order';
import { OrderStatusBadge } from '../components/atoms/OrderStatusBadge';

/**
 * Orders Page (F105)
 * 
 * Displays customer order history with filtering and search capabilities.
 * Shows order details, status tracking, and order management actions.
 * 
 * Features:
 * - Order history list
 * - Status filtering
 * - Order details view
 * - Order tracking timeline
 */

interface OrdersProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export const Orders: React.FC<OrdersProps> = () => {
  const { user } = useAuth();
  const { orders, getOrdersByCustomer, deleteOrder, loading, error } = useOrderApi();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (user && user.id) {
      getOrdersByCustomer(user.id).catch(console.error);
    }
  }, [user, getOrdersByCustomer]);

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toString().includes(searchTerm) ||
      order.items.some(item => 
        item.menuItemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCancelOrder = async (orderId: number) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await deleteOrder(orderId);
        // Refresh orders
        if (user && user.id) {
          await getOrdersByCustomer(user.id);
        }
      } catch (err) {
        console.error('Failed to cancel order:', err);
      }
    }
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBag className="w-8 h-8 text-primary-600" />
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900">
              Your Orders
            </h2>
          </div>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Track and review your orders here
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg
                  focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  transition-all
                "
              />
            </div>

            {/* Status Filter */}
            <div className="sm:w-48 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
                className="
                  w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg
                  focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  transition-all appearance-none bg-white
                "
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY">Ready</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="max-w-3xl mx-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-neutral-600">Loading orders...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && filteredOrders.length === 0 && (
            <EmptyState
              icon={<ShoppingBag className="w-16 h-16" />}
              message="No orders found"
              description={
                searchTerm || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filter'
                  : 'You haven\'t placed any orders yet'
              }
              actionText="Browse Menu"
              onAction={() => window.location.href = '/menu'}
            />
          )}

          {!loading && !error && filteredOrders.length > 0 && (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="relative">
                  {selectedOrderId === order.id ? (
                    <OrderDetailsPanel
                      order={order}
                      showTimeline
                      onCancel={handleCancelOrder}
                    />
                  ) : (
                    <div
                      className="
                        bg-white rounded-xl shadow-md p-6 cursor-pointer
                        hover:shadow-lg transition-shadow
                      "
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-neutral-600 mt-1">
                            {new Date(order.orderTime).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <OrderStatusBadge status={order.status} />
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-neutral-600">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                        <p className="text-lg font-bold text-primary-600">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedOrderId === order.id && (
                    <button
                      onClick={() => setSelectedOrderId(null)}
                      className="
                        mt-3 w-full py-2 text-sm font-medium text-neutral-700
                        bg-white border border-neutral-300 rounded-lg
                        hover:bg-neutral-50 transition-colors
                      "
                    >
                      Close Details
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
