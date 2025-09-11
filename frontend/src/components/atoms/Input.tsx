import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'time';
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  icon?: LucideIcon;
  min?: string;
  max?: string;
  step?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  label,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  value,
  onChange,
  className = '',
  icon,
  min,
  max,
  step,
  ...props
}, ref) => {
  const inputId = React.useId();
  
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-accent-red ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
            {React.createElement(icon, { className: 'w-4 h-4' })}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={'w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent' + (icon ? ' pl-10' : '') + (error ? ' border-accent-red focus:ring-accent-red' : ' border-neutral-300 focus:border-transparent') + (disabled ? ' bg-neutral-100 cursor-not-allowed' : ' bg-white')}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-accent-red">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
