import React from 'react';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';
import { OrderDto } from '../../types/order';
import { OrderTypeBadge } from '../atoms/OrderTypeBadge';
import { OrderStatusBadge } from '../atoms/OrderStatusBadge';
import { PriceDisplay } from '../atoms/PriceDisplay';
import { OrderStatusTimeline } from '../molecules/OrderStatusTimeline';

/**
 * OrderDetailsPanel Organism (F105)
 * 
 * Displays complete order details including status timeline, items, customer info,
 * and pricing breakdown. Used in order history and order tracking views.
 * 
 * @component
 * @example
 * ```tsx
 * <OrderDetailsPanel order={order} showTimeline />
 * ```
 */

export interface OrderDetailsPanelProps {
  order: OrderDto;
  showTimeline?: boolean;
  showCustomerInfo?: boolean;
  onCancel?: (orderId: number) => void;
  isLoading?: boolean;
  className?: string;
}

export const OrderDetailsPanel: React.FC<OrderDetailsPanelProps> = ({
  order,
  showTimeline = true,
  showCustomerInfo = false,
  onCancel,
  isLoading = false,
  className = '',
}) => {
  const orderDate = new Date(order.orderTime);
  const canCancel = order.status === 'PENDING' && onCancel;

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Order #{order.id}</h3>
            <p className="text-sm text-primary-100 mt-0.5">
              {orderDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              {' at '}
              {orderDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <OrderStatusBadge status={order.status} size="md" />
            <OrderTypeBadge type={order.orderType} size="sm" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Status Timeline */}
        {showTimeline && order.status !== 'CANCELLED' && (
          <div className="mb-6 pb-6 border-b border-neutral-200">
            <h4 className="text-sm font-semibold text-neutral-900 mb-4">Order Progress</h4>
            <OrderStatusTimeline
              currentStatus={order.status}
              orderType={order.orderType}
              estimatedCompletion={order.estimatedCompletion}
            />
          </div>
        )}

        {/* Customer Information */}
        {showCustomerInfo && (
          <div className="mb-6 pb-6 border-b border-neutral-200">
            <h4 className="text-sm font-semibold text-neutral-900 mb-3">Customer Information</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Mail className="w-4 h-4 text-neutral-500" />
                <span>{order.customerEmail}</span>
              </div>
              {order.customerPhone && (
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <Phone className="w-4 h-4 text-neutral-500" />
                  <span>{order.customerPhone}</span>
                </div>
              )}
              {order.tableNumber && (
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <MapPin className="w-4 h-4 text-neutral-500" />
                  <span>Table {order.tableNumber}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-neutral-900 mb-3">Order Items</h4>
          <div className="space-y-3">
            {order.items.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{item.menuItemName}</p>
                  <p className="text-sm text-neutral-600">
                    {item.quantity} × ${item.unitPrice.toFixed(2)}
                  </p>
                </div>
                <PriceDisplay amount={item.subtotal} size="sm" bold />
              </div>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-medium text-amber-900 mb-1">Special Instructions</p>
            <p className="text-sm text-amber-800">{order.specialInstructions}</p>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="space-y-2 pb-4 border-b border-neutral-200">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Subtotal</span>
            <PriceDisplay amount={order.subtotal} size="sm" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Tax</span>
            <PriceDisplay amount={order.taxAmount} size="sm" />
          </div>
          {order.tipAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Tip</span>
              <PriceDisplay amount={order.tipAmount} size="sm" />
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4">
          <span className="text-lg font-semibold text-neutral-900">Total</span>
          <PriceDisplay amount={order.totalAmount} size="xl" bold color="primary" />
        </div>

        {/* Estimated Completion */}
        {order.estimatedCompletion && order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
          <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
            <Clock className="w-4 h-4" />
            <span>
              Estimated completion:{' '}
              {new Date(order.estimatedCompletion).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}

        {/* Cancel Button */}
        {canCancel && (
          <button
            onClick={() => onCancel(order.id)}
            disabled={isLoading}
            className="
              mt-4 w-full px-4 py-2 text-sm font-medium text-red-700
              bg-red-50 border border-red-200 rounded-lg
              hover:bg-red-100 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isLoading ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPanel;
