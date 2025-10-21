import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Badge } from '../atoms/Badge';

/**
 * NavLink Molecule (Reusable)
 * 
 * Navigation link with active state styling and optional badge.
 * Combines RouterNavLink with Badge atom for role-based navigation.
 * 
 * @component
 * @example
 * // Simple nav link
 * <NavLink to="/dashboard" icon={<HomeIcon />}>
 *   Dashboard
 * </NavLink>
 * 
 * // With badge (notification count)
 * <NavLink to="/orders" icon={<OrderIcon />} badgeCount={5}>
 *   Orders
 * </NavLink>
 */

export interface NavLinkProps {
  /** Link destination */
  to: string;
  /** Link text */
  children: React.ReactNode;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Badge count (shows if > 0) */
  badgeCount?: number;
  /** Exact match for active state */
  exact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  icon,
  badgeCount,
  exact = false,
  className = '',
}) => {
  const baseClasses = `
    flex items-center gap-3
    px-4 py-2
    rounded-lg
    font-medium
    transition-all duration-200
    hover:bg-neutral-gray-100
  `;

  const activeClasses = 'bg-primary-orange-light text-primary-orange-dark';
  const inactiveClasses = 'text-neutral-gray-700 hover:text-neutral-gray-900';

  return (
    <RouterNavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${className}`
      }
    >
      {icon && <span className="w-5 h-5 flex-shrink-0">{icon}</span>}
      
      <span className="flex-1">{children}</span>

      {badgeCount !== undefined && badgeCount > 0 && (
        <Badge variant="primary" size="sm">
          {badgeCount > 99 ? '99+' : badgeCount}
        </Badge>
      )}
    </RouterNavLink>
  );
};
