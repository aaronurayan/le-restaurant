import React from 'react';
import { MapPin as MapPinIcon, Navigation } from 'lucide-react';

interface MapPinProps {
  latitude: number;
  longitude: number;
  label?: string;
  variant?: 'default' | 'delivery' | 'pickup' | 'current';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  default: 'text-primary-600 bg-primary-100 border-primary-200',
  delivery: 'text-green-600 bg-green-100 border-green-200',
  pickup: 'text-blue-600 bg-blue-100 border-blue-200',
  current: 'text-orange-600 bg-orange-100 border-orange-200'
};

const sizeStyles = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base'
};

export const MapPin: React.FC<MapPinProps> = ({
  latitude,
  longitude,
  label,
  variant = 'default',
  size = 'md',
  className = '',
  onClick
}) => {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: open in maps
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(mapsUrl, '_blank');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center rounded-full border-2
        transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500
        ${variantStyle}
        ${sizeStyle}
        ${className}
      `}
      title={`${label || 'Location'}: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
    >
      {variant === 'current' ? (
        <Navigation className="w-4 h-4" />
      ) : (
        <MapPinIcon className="w-4 h-4" />
      )}
    </button>
  );
};
