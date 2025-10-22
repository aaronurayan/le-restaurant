import React from 'react';
import { Clock, CheckCircle, ChefHat, XCircle, Package } from 'lucide-react';
import { OrderStatus } from '../../types/order';

/**
 * OrderStatusBadge Atom (F105)
 * 
 * Displays the order status with appropriate icon, color, and animation.
 * Supports all order states from PENDING to COMPLETED/CANCELLED.
 * 
 * @component
 * @example
 * ```tsx
 * <OrderStatusBadge status="IN_PREPARATION" />
 * <OrderStatusBadge status="COMPLETED" size="lg" animated />
 * ```
 */

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<OrderStatus, {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  PENDING: {
    icon: <Clock className="w-4 h-4" />,
    label: 'Pending',
    color: 'text-neutral-700',
    bgColor: 'bg-neutral-100',
    borderColor: 'border-neutral-300',
  },
  CONFIRMED: {
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Confirmed',
    color: 'text-secondary-700',
    bgColor: 'bg-secondary-100',
    borderColor: 'border-secondary-300',
  },
  PREPARING: {
    icon: <ChefHat className="w-4 h-4" />,
    label: 'Preparing',
    color: 'text-primary-700',
    bgColor: 'bg-primary-100',
    borderColor: 'border-primary-300',
  },
  READY: {
    icon: <Package className="w-4 h-4" />,
    label: 'Ready',
    color: 'text-secondary-700',
    bgColor: 'bg-secondary-100',
    borderColor: 'border-secondary-300',
  },
  COMPLETED: {
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Completed',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
  },
  CANCELLED: {
    icon: <XCircle className="w-4 h-4" />,
    label: 'Cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = 'md',
  animated = false,
  showIcon = true,
  className = '',
}) => {
  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${config.color} ${config.bgColor} ${config.borderColor} ${sizeClasses[size]}
        ${animated ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
