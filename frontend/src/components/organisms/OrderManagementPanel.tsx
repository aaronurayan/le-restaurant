import React, { useEffect, useState } from 'react';
import { OrderDto, OrderStatus } from '../../types/order';
import { useOrderApi } from '../../hooks/useOrderApi';
import { OrderCard } from '../molecules/OrderCard';
import { Button } from '../atoms/Button';

interface OrderManagementPanelProps {
  customerId?: number;
  onCreateOrder?: () => void;
}

/**
 * OrderManagementPanel Organism Component
 * Main panel for managing orders with filtering and actions
 */
export const OrderManagementPanel: React.FC<OrderManagementPanelProps> = ({
  customerId,
  onCreateOrder,
}) => {
  const { orders, loading, error, getAllOrders, getOrdersByCustomer, getOrdersByStatus, deleteOrder } = useOrderApi();
  const [filteredOrders, setFilteredOrders] = useState<OrderDto[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Load orders on mount
  useEffect(() => {
    if (customerId) {
      getOrdersByCustomer(customerId);
    } else {
      getAllOrders();
    }
  }, [customerId, getAllOrders, getOrdersByCustomer]);

  // Filter orders by status
  useEffect(() => {
    if (selectedStatus === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === selectedStatus));
    }
  }, [orders, selectedStatus]);

  const handleStatusChange = async (status: OrderStatus | 'ALL') => {
    setSelectedStatus(status);
    if (status !== 'ALL' && !customerId) {
      await getOrdersByStatus(status);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId);
      } catch (err) {
        console.error('Error deleting order:', err);
      }
    }
  };

  const statusOptions: (OrderStatus | 'ALL')[] = [
    'ALL',
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'COMPLETED',
    'CANCELLED',
  ];

  return (
    <div className="p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {customerId ? 'My Orders' : 'Order Management'}
        </h2>
        {onCreateOrder && (
          <Button variant="primary" onClick={onCreateOrder}>
            Create Order
          </Button>
        )}
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Filter by Status:</p>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 rounded mb-6">
          <p className="text-red-800 font-semibold">Error</p>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No orders found</p>
          {onCreateOrder && (
            <Button variant="primary" onClick={onCreateOrder}>
              Create Your First Order
            </Button>
          )}
        </div>
      )}

      {/* Orders Grid */}
      {!loading && !error && filteredOrders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrderId(order.id)}
              className="cursor-pointer"
            >
              <OrderCard
                order={order}
                onViewDetails={(o) => setSelectedOrderId(o.id)}
                onDelete={handleDeleteOrder}
              />
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal (if selected) */}
      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
};

// Modal component for order details
interface OrderDetailsModalProps {
  orderId: number;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ orderId, onClose }) => {
  const { currentOrder, getOrderById, loading } = useOrderApi();

  useEffect(() => {
    getOrderById(orderId);
  }, [orderId, getOrderById]);

  if (loading || !currentOrder) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-semibold text-gray-800">#{currentOrder.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold text-gray-800">{currentOrder.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Customer</p>
            <p className="font-semibold text-gray-800">{currentOrder.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="font-semibold text-gray-800">{currentOrder.orderType}</p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Items</h4>
          <div className="space-y-2">
            {currentOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-700">
                  {item.quantity}x {item.menuItemName}
                </span>
                <span className="font-semibold text-gray-800">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-2 mb-6 pb-6 border-b">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>${currentOrder.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Tax (10%):</span>
            <span>${currentOrder.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg text-gray-800">
            <span>Total:</span>
            <span>${currentOrder.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded font-semibold hover:bg-gray-400 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
