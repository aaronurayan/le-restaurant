import React from 'react';
import { Trash2 } from 'lucide-react';
import { PriceDisplay } from '../atoms/PriceDisplay';
import { OrderItemDto } from '../../types/order';

/**
 * OrderItemCard Molecule (F105)
 * 
 * Displays a single order item with name, quantity, unit price, and subtotal.
 * Used in both checkout and order history views.
 * 
 * @component
 * @example
 * ```tsx
 * <OrderItemCard
 *   item={orderItem}
 *   onRemove={handleRemove}
 *   editable
 * />
 * ```
 */

export interface OrderItemCardProps {
  item: OrderItemDto;
  onRemove?: (itemId: number) => void;
  editable?: boolean;
  loading?: boolean;
  className?: string;
}

export const OrderItemCard: React.FC<OrderItemCardProps> = ({
  item,
  onRemove,
  editable = false,
  loading = false,
  className = '',
}) => {
  return (
    <div
      className={`
        flex items-center justify-between p-4 rounded-lg border border-neutral-200
        bg-white hover:shadow-sm transition-shadow
        ${className}
      `}
    >
      <div className="flex-1">
        <h4 className="font-medium text-neutral-900">{item.menuItemName}</h4>
        <div className="text-sm text-neutral-600 mt-0.5 flex items-baseline gap-1">
          <span>{item.quantity} ×</span>
          <PriceDisplay amount={item.unitPrice} size="sm" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <PriceDisplay
          amount={item.subtotal}
          size="md"
          bold
          color="primary"
        />

        {editable && onRemove && (
          <button
            onClick={() => onRemove(item.id)}
            disabled={loading}
            className="
              p-2 text-red-500 hover:bg-red-50 rounded-lg
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            "
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
