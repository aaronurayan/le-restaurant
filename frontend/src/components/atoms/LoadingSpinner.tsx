import React from 'react';

/**
 * LoadingSpinner Atom (Reusable)
 * 
 * Displays a spinning loading indicator with optional text.
 * Can be used in any loading state across the application.
 * 
 * @component
 * @example
 * // Small spinner
 * <LoadingSpinner size="sm" />
 * 
 * // Large spinner with text
 * <LoadingSpinner size="lg" text="Loading data..." />
 */

export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Optional loading text */
  text?: string;
  /** Color variant (follows design system) */
  variant?: 'primary' | 'secondary' | 'white';
  /** Center the spinner in its container */
  centered?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

const colorClasses = {
  primary: 'border-primary-orange border-t-transparent',
  secondary: 'border-secondary-green border-t-transparent',
  white: 'border-white border-t-transparent',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  variant = 'primary',
  centered = true,
  className = '',
}) => {
  const containerClass = `${centered 
    ? 'flex flex-col items-center justify-center gap-3' 
    : 'flex flex-col items-start gap-3'} ${className}`;

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[variant]}
          rounded-full
          animate-spin
        `}
        aria-hidden="true"
      />
      {text && (
        <span className="text-sm text-neutral-gray-600 dark:text-neutral-gray-300">
          {text}
        </span>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
