import React from 'react';

type InputType = 'text' | 'email' | 'password' | 'number';

interface InputProps {
  label?: string;
  type?: InputType;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  maxLength,
  icon: Icon,
  className = ''
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}

      <div className={`relative`}>
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-neutral-400" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          className={
            `w-full rounded-lg border ${error ? 'border-red-300' : 'border-neutral-300'} ` +
            `bg-white text-neutral-900 placeholder-neutral-400 ` +
            `focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ` +
            `${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2`
          }
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;


