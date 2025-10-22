import React from 'react';

/**
 * Badge Atom (Reusable)
 * 
 * Displays status badges, role indicators, or tags.
 * Follows 05-frontend-design.md color system.
 * 
 * @component
 * @example
 * // Status badge
 * <Badge variant="success" showDot>CONFIRMED</Badge>
 * 
 * // Role badge
 * <Badge variant="primary" size="sm">ADMIN</Badge>
 */

interface BadgeProps {
  children: React.ReactNode;
  /** Color variant (follows design system) */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  /** Show with dot indicator */
  showDot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  showDot = false,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 font-semibold rounded-full border';
  
  // Design System Colors (05-frontend-design.md)
  const variantClasses = {
    primary: 'bg-primary-orange-light text-primary-orange-dark border-primary-orange',
    secondary: 'bg-secondary-green-light text-secondary-green-dark border-secondary-green',
    success: 'bg-status-success-light text-status-success-dark border-status-success',
    warning: 'bg-status-warning-light text-status-warning-dark border-status-warning',
    error: 'bg-status-error-light text-status-error-dark border-status-error',
    neutral: 'bg-neutral-gray-100 text-neutral-gray-700 border-neutral-gray-300',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const dotClasses = {
    primary: 'bg-primary-orange',
    secondary: 'bg-secondary-green',
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    error: 'bg-status-error',
    neutral: 'bg-neutral-gray-500',
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {showDot && (
        <span
          className={`${dotClasses[variant]} w-2 h-2 rounded-full`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};