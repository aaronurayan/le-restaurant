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
  
  // Design System Colors (05-frontend-design.md with Tailwind tokens)
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-700 border-primary-600',
    secondary: 'bg-secondary-100 text-secondary-700 border-secondary-600',
    success: 'bg-secondary-100 text-secondary-700 border-secondary-600', // Using green for success
    warning: 'bg-accent-yellow/20 text-neutral-800 border-accent-yellow',
    error: 'bg-accent-red/20 text-accent-red border-accent-red',
    neutral: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const dotClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-secondary-600', // Using green for success
    warning: 'bg-accent-yellow',
    error: 'bg-accent-red',
    neutral: 'bg-neutral-500',
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