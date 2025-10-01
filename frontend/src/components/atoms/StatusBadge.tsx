import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  className?: string;
}

const statusStyles = {
  preparing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  ready_for_pickup: 'bg-blue-100 text-blue-800 border-blue-200',
  assigned: 'bg-purple-100 text-purple-800 border-purple-200',
  picked_up: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  in_transit: 'bg-orange-100 text-orange-800 border-orange-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  available: 'bg-green-100 text-green-800 border-green-200',
  busy: 'bg-orange-100 text-orange-800 border-orange-200',
  offline: 'bg-gray-100 text-gray-800 border-gray-200',
  low: 'bg-gray-100 text-gray-800 border-gray-200',
  normal: 'bg-blue-100 text-blue-800 border-blue-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200'
};

const variantStyles = {
  default: 'border',
  outline: 'border-2 bg-transparent',
  solid: 'border-0'
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = ''
}) => {
  const statusStyle = statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800 border-gray-200';
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${statusStyle}
        ${variantStyle}
        ${sizeStyle}
        ${className}
      `}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );
};
