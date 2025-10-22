import React from 'react';
import { Badge } from '../atoms/Badge';

export interface StatCardProps {
  /** Statistic title */
  title: string;
  /** Main value to display */
  value: string | number;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Trend indicator (positive/negative/neutral) */
  trend?: 'up' | 'down' | 'neutral';
  /** Change percentage or description */
  change?: string;
  /** Additional description */
  description?: string;
  /** Card variant */
  variant?: 'default' | 'primary' | 'secondary';
  /** Click handler */
  onClick?: () => void;
}

/**
 * StatCard Molecule
 * 
 * Reusable statistics card for dashboards combining:
 * - Badge atom for trend indicator
 * - Typography for value/title
 * - Optional icon and click action
 * 
 * Used in: AdminDashboard, CustomerDashboard
 * 
 * @example
 * <StatCard
 *   title="Total Revenue"
 *   value="$12,345"
 *   icon={<DollarIcon />}
 *   trend="up"
 *   change="+12.5%"
 *   variant="primary"
 * />
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  change,
  description,
  variant = 'default',
  onClick,
}) => {
  const variantClasses = {
    default: 'bg-white border-neutral-gray-200',
    primary: 'bg-primary-orange-light border-primary-orange',
    secondary: 'bg-secondary-green-light border-secondary-green',
  };

  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  const trendBadge = trend && (
    <Badge
      variant={trend === 'up' ? 'success' : trend === 'down' ? 'error' : 'neutral'}
      size="sm"
      showDot={false}
    >
      {trendIcon} {change}
    </Badge>
  );

  return (
    <div
      className={`
        rounded-lg border-2 p-6 transition-all
        ${variantClasses[variant]}
        ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : ''}
      `}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {/* Header: Icon + Trend Badge */}
      <div className="flex items-start justify-between mb-2">
        {icon && (
          <div className="text-primary-orange text-2xl" aria-hidden="true">
            {icon}
          </div>
        )}
        {trendBadge}
      </div>

      {/* Main Value */}
      <div className="text-3xl font-bold text-neutral-gray-800 mb-1">
        {value}
      </div>

      {/* Title */}
      <div className="text-sm font-medium text-neutral-gray-600 mb-1">
        {title}
      </div>

      {/* Description */}
      {description && (
        <div className="text-xs text-neutral-gray-400 mt-2">
          {description}
        </div>
      )}
    </div>
  );
};
