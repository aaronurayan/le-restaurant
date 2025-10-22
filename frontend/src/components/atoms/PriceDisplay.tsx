import React from 'react';

/**
 * PriceDisplay Atom (F105)
 * 
 * Displays price with consistent formatting and styling.
 * Supports different sizes, bold variants, and optional labels.
 * 
 * @component
 * @example
 * ```tsx
 * <PriceDisplay amount={25.99} />
 * <PriceDisplay amount={100.50} size="lg" bold label="Total" />
 * ```
 */

export interface PriceDisplayProps {
  amount: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  bold?: boolean;
  label?: string;
  color?: 'primary' | 'secondary' | 'neutral' | 'green';
  className?: string;
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const colorClasses = {
  primary: 'text-primary-600',
  secondary: 'text-secondary-600',
  neutral: 'text-neutral-900',
  green: 'text-green-600',
};

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  size = 'md',
  bold = false,
  label,
  color = 'neutral',
  className = '',
}) => {
  const formattedPrice = `$${amount.toFixed(2)}`;

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      {label && (
        <span className={`${sizeClasses[size]} text-neutral-600`}>
          {label}:
        </span>
      )}
      <span
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          ${bold ? 'font-bold' : 'font-medium'}
        `}
      >
        {formattedPrice}
      </span>
    </div>
  );
};
