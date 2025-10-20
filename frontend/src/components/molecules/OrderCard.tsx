import React from 'react';
import { OrderDto } from '../../types/order';

interface OrderCardProps {
  order: OrderDto;
  onViewDetails?: (order: OrderDto) => void;
  onEdit?: (order: OrderDto) => void;
  onDelete?: (orderId: number) => void;
}

/**
 * OrderCard Molecule Component
 * Displays order summary in card format
 */
export const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails, onEdit, onDelete }) => {
  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-purple-100 text-purple-800',
    READY: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  const typeColors: Record<string, string> = {
    DINE_IN: 'text-blue-600',
    TAKEOUT: 'text-orange-600',
    DELIVERY: 'text-green-600',
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
          <p className="text-sm text-gray-600">{order.customerName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Type:</span>
          <p className={`font-semibold ${typeColors[order.orderType]}`}>{order.orderType}</p>
        </div>
        <div>
          <span className="text-gray-600">Total:</span>
          <p className="font-semibold text-gray-800">${order.totalAmount.toFixed(2)}</p>
        </div>
        {order.tableNumber && (
          <div>
            <span className="text-gray-600">Table:</span>
            <p className="font-semibold text-gray-800">{order.tableNumber}</p>
          </div>
        )}
        <div>
          <span className="text-gray-600">Items:</span>
          <p className="font-semibold text-gray-800">{order.items.length}</p>
        </div>
      </div>

      {/* Items preview */}
      <div className="bg-gray-50 rounded p-2 mb-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">Items:</p>
        <div className="space-y-1">
          {order.items.slice(0, 2).map((item: typeof order.items[0]) => (
            <p key={item.id} className="text-xs text-gray-700">
              {item.quantity}x {item.menuItemName} - ${item.subtotal.toFixed(2)}
            </p>
          ))}
          {order.items.length > 2 && (
            <p className="text-xs text-gray-600">+{order.items.length - 2} more items</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(order)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            View
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(order)}
            className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(order.id)}
            className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
