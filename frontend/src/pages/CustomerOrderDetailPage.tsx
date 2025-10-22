import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrderApi } from '../hooks/useOrderApi';
import { OrderDto } from '../types/order';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { ErrorMessage } from '../components/atoms/ErrorMessage';
import { Badge } from '../components/atoms/Badge';
import { ArrowLeft, Calendar, Clock, MapPin, FileText, CreditCard } from 'lucide-react';

/**
 * Status color mapping
 * Maps order status to badge variant that's defined in Badge component
 */
const getStatusColor = (status: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' => {
  const statusMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'> = {
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
 * CustomerOrderDetailPage Component
 * Displays detailed information about a specific order
 */
const CustomerOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { loading, error, getOrderById } = useOrderApi();
  const [order, setOrder] = useState<OrderDto | null>(null);

  useEffect(() => {
    if (orderId) {
      getOrderById(parseInt(orderId, 10))
        .then(orderData => setOrder(orderData))
        .catch(err => console.error('Error loading order:', err));
    }
  }, [orderId, getOrderById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading order details..." variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ErrorMessage 
          message="Failed to load order details" 
          onRetry={() => orderId && getOrderById(parseInt(orderId, 10))} 
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-neutral-gray-800 mb-2">
            Order Not Found
          </h2>
          <p className="text-neutral-gray-600 mb-4">
            We couldn't find the order you're looking for.
          </p>
          <Link
            to="/customer/orders"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <Link to="/customer/orders" className="flex items-center text-primary-600 hover:text-primary-700 mb-3">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Orders</span>
        </Link>
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-neutral-gray-800">
            Order #{order.id}
          </h1>
          <Badge 
            variant={getStatusColor(order.status)}
            size="lg"
            showDot
          >
            {order.status}
          </Badge>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-lg border-2 border-neutral-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-gray-800 mb-3">Order Information</h2>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-neutral-gray-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium">Date Placed</div>
                  <div className="text-neutral-gray-600">
                    {new Date(order.orderTime).toLocaleDateString()} at {' '}
                    {new Date(order.orderTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-neutral-gray-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium">Estimated Completion</div>
                  <div className="text-neutral-gray-600">
                    {order.estimatedCompletion ? (
                      new Date(order.estimatedCompletion).toLocaleString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        month: 'short',
                        day: 'numeric'
                      })
                    ) : (
                      'Not available'
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-neutral-gray-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium">Order Type</div>
                  <div className="text-neutral-gray-600">
                    {order.orderType}
                    {order.tableNumber && ` • Table ${order.tableNumber}`}
                  </div>
                </div>
              </div>
              
              {order.specialInstructions && (
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-neutral-gray-600 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Special Instructions</div>
                    <div className="text-neutral-gray-600">
                      {order.specialInstructions}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-gray-800 mb-3">Payment Details</h2>
            
            <div className="flex items-start mb-3">
              <CreditCard className="w-5 h-5 text-neutral-gray-600 mr-3 mt-0.5" />
              <div>
                <div className="font-medium">Payment Method</div>
                <div className="text-neutral-gray-600">
                  Credit Card (ending in 1234)
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-gray-50 rounded-lg p-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-neutral-gray-600">Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-neutral-gray-600">Tax</span>
                <span className="font-medium">${order.taxAmount.toFixed(2)}</span>
              </div>
              {order.tipAmount > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-gray-600">Tip</span>
                  <span className="font-medium">${order.tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-neutral-gray-200 my-2 pt-2 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg border-2 border-neutral-gray-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-gray-800 mb-4">Order Items</h2>
        
        <div className="divide-y divide-neutral-gray-200">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex justify-between">
              <div>
                <div className="font-medium">{item.quantity}x {item.menuItemName}</div>
                <div className="text-neutral-gray-600 text-sm">
                  ${item.unitPrice.toFixed(2)} each
                </div>
              </div>
              <div className="font-medium">
                ${item.subtotal.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderDetailPage;