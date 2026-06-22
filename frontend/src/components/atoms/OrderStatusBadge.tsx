import React from 'react';
import { Clock, CheckCircle, ChefHat, XCircle, Package } from 'lucide-react';
import { OrderStatus } from '../../types/order';
import { getOrderStatusClasses } from '../../utils/statusColors';

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

// Icon + label per status. Colours come from the shared getOrderStatusClasses()
// so the same status renders identically across every page.
const statusConfig: Record<OrderStatus, {
  icon: React.ReactNode;
  label: string;
}> = {
  PENDING: { icon: <Clock className="w-4 h-4" />, label: 'Pending' },
  CONFIRMED: { icon: <CheckCircle className="w-4 h-4" />, label: 'Confirmed' },
  PREPARING: { icon: <ChefHat className="w-4 h-4" />, label: 'Preparing' },
  READY: { icon: <Package className="w-4 h-4" />, label: 'Ready' },
  COMPLETED: { icon: <CheckCircle className="w-4 h-4" />, label: 'Completed' },
  CANCELLED: { icon: <XCircle className="w-4 h-4" />, label: 'Cancelled' },
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
  const colors = getOrderStatusClasses(status);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${colors.text} ${colors.bg} ${colors.border} ${sizeClasses[size]}
        ${animated ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
