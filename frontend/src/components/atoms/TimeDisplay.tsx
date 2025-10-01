import React from 'react';
import { Clock, Calendar } from 'lucide-react';

interface TimeDisplayProps {
  time: string;
  type?: 'time' | 'datetime' | 'date' | 'relative';
  showIcon?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  time,
  type = 'datetime',
  showIcon = true,
  variant = 'default',
  className = ''
}) => {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));

    if (type === 'relative') {
      if (diffInMinutes < 0) {
        const absDiff = Math.abs(diffInMinutes);
        if (absDiff < 60) return `${absDiff}m ago`;
        if (absDiff < 1440) return `${Math.floor(absDiff / 60)}h ago`;
        return `${Math.floor(absDiff / 1440)}d ago`;
      } else {
        if (diffInMinutes < 60) return `in ${diffInMinutes}m`;
        if (diffInMinutes < 1440) return `in ${Math.floor(diffInMinutes / 60)}h`;
        return `in ${Math.floor(diffInMinutes / 1440)}d`;
      }
    }

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };

    const dateTimeOptions: Intl.DateTimeFormatOptions = {
      ...dateOptions,
      ...timeOptions
    };

    switch (type) {
      case 'time':
        return date.toLocaleTimeString('en-US', timeOptions);
      case 'date':
        return date.toLocaleDateString('en-US', dateOptions);
      case 'datetime':
        return date.toLocaleString('en-US', dateTimeOptions);
      default:
        return date.toLocaleString('en-US', dateTimeOptions);
    }
  };

  const getIcon = () => {
    if (!showIcon) return null;
    
    switch (type) {
      case 'time':
        return <Clock className="w-4 h-4" />;
      case 'date':
        return <Calendar className="w-4 h-4" />;
      case 'datetime':
        return <Clock className="w-4 h-4" />;
      case 'relative':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return 'text-xs text-neutral-500';
      case 'detailed':
        return 'text-sm font-medium text-neutral-700';
      default:
        return 'text-sm text-neutral-600';
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${getVariantStyles()} ${className}`}>
      {getIcon()}
      <span>{formatTime(time)}</span>
    </div>
  );
};
