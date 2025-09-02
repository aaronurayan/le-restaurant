import React from 'react';
import { Clock, CheckCircle, Truck, ChefHat } from 'lucide-react';
import { Order, OrderStatus as OrderStatusType } from '../../types';

interface OrderStatusProps {
  order: Order;
}

const statusConfig: Record<OrderStatusType, { 
  icon: React.ReactNode; 
  color: string; 
  bgColor: string;
  title: string;
  description: string;
}> = {
  PENDING: {
    icon: <Clock className="w-5 h-5" />,
    color: 'text-neutral-600',
    bgColor: 'bg-neutral-100',
    title: 'Order Received',
    description: 'We have received your order and are preparing it',
  },
  CONFIRMED: {
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-100',
    title: 'Order Confirmed',
    description: 'Your order has been confirmed by the restaurant',
  },
  IN_PREPARATION: {
    icon: <ChefHat className="w-5 h-5" />,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
    title: 'Being Prepared',
    description: 'Our chefs are preparing your delicious meal',
  },
  READY_FOR_PICKUP: {
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-100',
    title: 'Ready for Pickup',
    description: 'Your order is ready! Please come pick it up',
  },
  OUT_FOR_DELIVERY: {
    icon: <Truck className="w-5 h-5" />,
    color: 'text-accent-blue',
    bgColor: 'bg-blue-100',
    title: 'Out for Delivery',
    description: 'Your order is on its way to you',
  },
  COMPLETED: {
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-100',
    title: 'Order Complete',
    description: 'Thank you for your order! Enjoy your meal',
  },
  CANCELLED: {
    icon: <Clock className="w-5 h-5" />,
    color: 'text-accent-red',
    bgColor: 'bg-red-100',
    title: 'Order Cancelled',
    description: 'This order has been cancelled',
  },
};

export const OrderStatus: React.FC<OrderStatusProps> = ({ order }) => {
  const config = statusConfig[order.status];
  const estimatedTime = new Date(order.deliveryInfo.estimatedTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-neutral-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-1">
            Order #{order.orderNumber}
          </h3>
          <p className="text-sm text-neutral-600">
            Placed on {new Date(order.orderDate).toLocaleDateString()}
          </p>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${config.bgColor}`}>
          <span className={config.color}>{config.icon}</span>
          <span className={`text-sm font-medium ${config.color}`}>
            {config.title}
          </span>
        </div>
      </div>
      
      <p className="text-neutral-600 mb-4">{config.description}</p>
      
      {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
        <div className="bg-neutral-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Estimated {order.deliveryInfo.type.toLowerCase()} time:</span>
            <span className="font-semibold text-neutral-900">{estimatedTime}</span>
          </div>
        </div>
      )}
      
      {/* Order Items Summary */}
      <div className="space-y-2">
        <h4 className="font-medium text-neutral-900">Order Items:</h4>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-neutral-600">
              {item.quantity}x {item.menuItem.name}
            </span>
            <span className="text-neutral-900">${item.subtotal.toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-primary-600">${order.pricing.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};