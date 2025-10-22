import React from 'react';

/**
 * EmptyState Atom (Reusable)
 * 
 * Displays when no data is available.
 * Provides clear feedback and optional action button.
 * 
 * @component
 * @example
 * // Simple empty state
 * <EmptyState message="No reservations found" />
 * 
 * // With action button
 * <EmptyState 
 *   message="No orders yet" 
 *   actionText="Create Order"
 *   onAction={() => navigate('/orders/create')}
 * />
 */

export interface EmptyStateProps {
  /** Main message */
  message: string;
  /** Optional description */
  description?: string;
  /** Optional action button text */
  actionText?: string;
  /** Action button callback */
  onAction?: () => void;
  /** Icon to display */
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  actionText,
  onAction,
  icon,
}) => {
  const defaultIcon = (
    <svg
      className="w-16 h-16 text-neutral-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );

  return (
    <div
      className="
        flex flex-col items-center justify-center
        py-12 px-4
        text-center
      "
      role="status"
      aria-live="polite"
    >
      <div className="mb-4">
        {icon || defaultIcon}
      </div>

      <h3 className="text-lg font-semibold text-neutral-gray-900 mb-2">
        {message}
      </h3>

      {description && (
        <p className="text-sm text-neutral-gray-600 mb-6 max-w-md">
          {description}
        </p>
      )}

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="
            px-4 py-2
            bg-primary-orange
            hover:bg-primary-orange-dark
            text-white
            font-medium
            rounded-lg
            transition-colors
            duration-200
          "
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
