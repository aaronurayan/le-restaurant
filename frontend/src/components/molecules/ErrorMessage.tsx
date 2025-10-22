import React from 'react';

/**
 * ErrorMessage Atom (Reusable)
 * 
 * Displays error messages with consistent styling.
 * Can be used for form validation, API errors, or general error states.
 * 
 * @component
 * @example
 * // Simple error
 * <ErrorMessage message="Invalid email address" />
 * 
 * // Error with retry action
 * <ErrorMessage 
 *   message="Failed to load data" 
 *   onRetry={() => refetch()}
 * />
 */

export interface ErrorMessageProps {
  /** Error message text */
  message: string;
  /** Optional retry callback */
  onRetry?: () => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show icon */
  showIcon?: boolean;
}

const sizeClasses = {
  sm: 'text-sm p-2',
  md: 'text-base p-3',
  lg: 'text-lg p-4',
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  size = 'md',
  showIcon = true,
}) => {
  return (
    <div
      className={`
        ${sizeClasses[size]}
        bg-status-error-light
        border border-status-error
        rounded-lg
        flex items-start gap-3
      `}
      role="alert"
      aria-live="assertive"
    >
      {showIcon && (
        <svg
          className="w-5 h-5 text-status-error flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )}
      
      <div className="flex-1">
        <p className="text-status-error font-medium">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="
            text-status-error 
            hover:text-status-error-dark
            font-medium 
            text-sm
            underline
            flex-shrink-0
          "
          aria-label="Retry action"
        >
          Retry
        </button>
      )}
    </div>
  );
};
