import React from 'react';
import { PriceDisplay } from '../atoms/PriceDisplay';

/**
 * OrderSummaryCard Molecule (F105)
 * 
 * Displays order cost breakdown: subtotal, tax, tip, and total.
 * Used in checkout and order confirmation views.
 * 
 * @component
 * @example
 * ```tsx
 * <OrderSummaryCard
 *   subtotal={25.99}
 *   taxAmount={2.60}
 *   tipAmount={3.00}
 *   totalAmount={31.59}
 * />
 * ```
 */

export interface OrderSummaryCardProps {
  subtotal: number;
  taxAmount: number;
  tipAmount: number;
  totalAmount: number;
  className?: string;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  subtotal,
  taxAmount,
  tipAmount,
  totalAmount,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-neutral-50 rounded-lg p-4 border border-neutral-200
        space-y-2
        ${className}
      `}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm text-neutral-600">Subtotal</span>
        <PriceDisplay amount={subtotal} size="sm" />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-neutral-600">Tax (10%)</span>
        <PriceDisplay amount={taxAmount} size="sm" />
      </div>

      {tipAmount > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-600">Tip</span>
          <PriceDisplay amount={tipAmount} size="sm" />
        </div>
      )}

      <div className="border-t border-neutral-300 pt-2 mt-2">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-neutral-900">Total</span>
          <PriceDisplay amount={totalAmount} size="lg" bold color="primary" />
        </div>
      </div>
    </div>
  );
};
