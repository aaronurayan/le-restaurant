import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOrderApi } from '../hooks/useOrderApi';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { ErrorMessage } from '../components/molecules/ErrorMessage';
import { EmptyState } from '../components/molecules/EmptyState';
import { Badge } from '../components/atoms/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { OrderDto, OrderStatus } from '../types/order';
import { ShoppingBag, Clock, ArrowLeft } from 'lucide-react';

/**
 * Status color mapping
 * Maps order status to badge variant that's defined in Badge component
 */
const getStatusColor = (status: OrderStatus): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' => {
  const statusMap: Record<OrderStatus, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'> = {
    PENDING: 'warning',
    CONFIRMED: 'primary',
    PREPARING: 'primary',
    READY: 'primary',
    COMPLETED: 'success',
    CANCELLED: 'error',
  };
  return statusMap[status] || 'neutral';
};

/**
 * Customer Orders Page Component
 * Displays all orders for the logged-in customer
 */
const TIMELINE_STEPS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];

const CustomerOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { loading, error, orders, getOrdersByCustomer } = useOrderApi();
  const [displayOrders, setDisplayOrders] = useState<OrderDto[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      getOrdersByCustomer(user.id)
        .catch(err => console.error('Error loading orders:', err));
    }
  }, [user, getOrdersByCustomer]);

  useEffect(() => {
    if (orders) {
      if (activeFilter === 'all') {
        setDisplayOrders(orders);
      } else {
        setDisplayOrders(orders.filter(order => order.status === activeFilter));
      }
    }
  }, [orders, activeFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const renderOrderItems = (order: OrderDto) => {
    const itemsToShow = order.items.slice(0, 3);
    const remainingCount = order.items.length - itemsToShow.length;

    return (
      <div className="mt-2">
        <div className="text-sm text-neutral-gray-700">
          {itemsToShow.map((item, index) => (
            <span key={item.id}>
              {item.quantity}x {item.menuItemName}
              {index < itemsToShow.length - 1 ? ', ' : ''}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="text-neutral-gray-500"> +{remainingCount} more</span>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading your orders..." variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ErrorMessage 
          message="Failed to load your orders" 
          onRetry={() => user?.id && getOrdersByCustomer(user.id)} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <Link to="/customer/dashboard" className="flex items-center text-primary-600 hover:text-primary-700 mb-3">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <h1 className="text-3xl font-serif font-bold text-neutral-gray-900 flex items-center">
            <ShoppingBag className="w-7 h-7 inline-block mr-2" />
            Culinary Stories
          </h1>
          <p className="text-neutral-gray-600">
            Relive each course with timeline tracking and handoff notes from our kitchen.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto mb-6 pb-2" role="tablist" aria-label="Order status filters">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => handleFilterChange('PENDING')}
          className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
            activeFilter === 'PENDING'
              ? 'bg-accent-yellow text-white'
              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => handleFilterChange('CONFIRMED')}
          className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
            activeFilter === 'CONFIRMED'
              ? 'bg-accent-blue text-white'
              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
          }`}
        >
          Confirmed
        </button>
        <button
          onClick={() => handleFilterChange('PREPARING')}
          className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
            activeFilter === 'PREPARING'
              ? 'bg-accent-purple text-white'
              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
          }`}
        >
          Preparing
        </button>
        <button
          onClick={() => handleFilterChange('COMPLETED')}
          className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
            activeFilter === 'COMPLETED'
              ? 'bg-secondary-600 text-white'
              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => handleFilterChange('CANCELLED')}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            activeFilter === 'CANCELLED'
              ? 'bg-accent-red text-white'
              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Orders List */}
      {displayOrders && displayOrders.length > 0 ? (
        <div className="space-y-4">
          {displayOrders.map((order) => {
            const currentStatusIndex = TIMELINE_STEPS.indexOf(order.status);
            return (
            <div key={order.id} className="bg-white rounded-lg border-2 border-neutral-gray-200 p-5">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-xl font-semibold text-neutral-gray-800 mr-3">
                      Order #{order.id}
                    </h3>
                    <Badge 
                      variant={getStatusColor(order.status)}
                      size="md"
                    >
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-neutral-gray-600 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {new Date(order.orderTime).toLocaleDateString()} at {new Date(order.orderTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  
                  {renderOrderItems(order)}
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="font-bold text-lg text-neutral-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                  
                  <Link
                    to={`/customer/orders/${order.id}`}
                    className="mt-2 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                {TIMELINE_STEPS.map((step) => {
                  const stepIndex = TIMELINE_STEPS.indexOf(step);
                  const isActive = currentStatusIndex === stepIndex;
                  const isCompleted =
                    currentStatusIndex !== -1 && stepIndex < currentStatusIndex;
                  return (
                    <span
                      key={`${order.id}-${step}`}
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : isCompleted
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {step}
                    </span>
                  );
                })}
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          message={
            activeFilter === 'all'
              ? "You haven't placed any orders yet"
              : `No ${activeFilter.toLowerCase()} orders found`
          }
          actionText="Browse Menu"
          onAction={() => navigate('/')}
        />
      )}
    </div>
  );
};

export default CustomerOrdersPage;