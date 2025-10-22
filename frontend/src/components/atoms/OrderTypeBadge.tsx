import React from 'react';
import { Home, ShoppingBag, Truck } from 'lucide-react';
import { OrderType } from '../../types/order';

/**
 * OrderTypeBadge Atom (F105)
 * 
 * Displays the order type (Dine-In, Takeout, Delivery) with appropriate icon and styling.
 * Follows atomic design principles and design system color palette.
 * 
 * @component
 * @example
 * ```tsx
 * <OrderTypeBadge type="DINE_IN" />
 * <OrderTypeBadge type="TAKEOUT" size="sm" />
 * ```
 */

export interface OrderTypeBadgeProps {
  type: OrderType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const typeConfig: Record<OrderType, {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
}> = {
  DINE_IN: {
    icon: <Home className="w-4 h-4" />,
    label: 'Dine-In',
    color: 'text-primary-700',
    bgColor: 'bg-primary-50 border-primary-200',
  },
  TAKEOUT: {
    icon: <ShoppingBag className="w-4 h-4" />,
    label: 'Takeout',
    color: 'text-secondary-700',
    bgColor: 'bg-secondary-50 border-secondary-200',
  },
  DELIVERY: {
    icon: <Truck className="w-4 h-4" />,
    label: 'Delivery',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

export const OrderTypeBadge: React.FC<OrderTypeBadgeProps> = ({
  type,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const config = typeConfig[type];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${config.color} ${config.bgColor} ${sizeClasses[size]} ${className}
      `}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
