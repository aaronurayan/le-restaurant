/**
 * Form Validation Hook
 * 
 * Provides consistent form validation with real-time feedback.
 * Supports validation rules and error message management.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-11-15
 */

import { useState, useCallback, useMemo } from 'react';

/**
 * Validation rule function
 */
export type ValidationRule<T> = (value: T, formData?: Record<string, any>) => string | null;

/**
 * Validation schema
 */
export type ValidationSchema<T extends Record<string, any>> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

/**
 * Hook for form validation
 * 
 * @example
 * const schema: ValidationSchema<LoginForm> = {
 *   email: [
 *     (value) => !value ? 'Email is required' : null,
 *     (value) => !/\S+@\S+\.\S+/.test(value) ? 'Invalid email format' : null,
 *   ],
 *   password: [
 *     (value) => !value ? 'Password is required' : null,
 *     (value) => value.length < 8 ? 'Password must be at least 8 characters' : null,
 *   ],
 * };
 * 
 * const { errors, validate, validateField, clearErrors, isValid } = useFormValidation(schema);
 */
export const useFormValidation = <T extends Record<string, any>>(
  schema: ValidationSchema<T>
) => {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  /**
   * Validate a single field
   */
  const validateField = useCallback((field: keyof T, value: T[keyof T], formData?: T): string | null => {
    const rules = schema[field];
    if (!rules || rules.length === 0) {
      return null;
    }

    for (const rule of rules) {
      const error = rule(value, formData);
      if (error) {
        return error;
      }
    }

    return null;
  }, [schema]);

  /**
   * Validate entire form
   */
  const validate = useCallback((formData: T): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    for (const field in schema) {
      const value = formData[field];
      const error = validateField(field, value, formData);
      if (error) {
        newErrors[field] = error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [schema, validateField]);

  /**
   * Validate field in real-time (for onChange handlers)
   */
  const validateFieldRealTime = useCallback((field: keyof T, value: T[keyof T], formData?: T) => {
    const error = validateField(field, value, formData);
    setErrors(prev => {
      if (error) {
        return { ...prev, [field]: error };
      } else {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
    });
    return error === null;
  }, [validateField]);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Clear error for specific field
   */
  const clearFieldError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  /**
   * Check if form is valid
   */
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    errors,
    validate,
    validateField,
    validateFieldRealTime,
    clearErrors,
    clearFieldError,
    isValid,
  };
};

/**
 * Common validation rules
 */
export const ValidationRules = {
  required: <T,>(message = 'This field is required'): ValidationRule<T> => {
    return (value: T) => {
      if (value === null || value === undefined || value === '') {
        return message;
      }
      if (typeof value === 'string' && value.trim() === '') {
        return message;
      }
      return null;
    };
  },

  email: (message = 'Please enter a valid email address'): ValidationRule<string> => {
    return (value: string) => {
      if (!value) return null; // Let required rule handle empty values
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : message;
    };
  },

  minLength: (min: number, message?: string): ValidationRule<string> => {
    return (value: string) => {
      if (!value) return null; // Let required rule handle empty values
      const msg = message || `Must be at least ${min} characters`;
      return value.length >= min ? null : msg;
    };
  },

  maxLength: (max: number, message?: string): ValidationRule<string> => {
    return (value: string) => {
      if (!value) return null;
      const msg = message || `Must be no more than ${max} characters`;
      return value.length <= max ? null : msg;
    };
  },

  min: (min: number, message?: string): ValidationRule<number> => {
    return (value: number) => {
      if (value === null || value === undefined) return null;
      const msg = message || `Must be at least ${min}`;
      return value >= min ? null : msg;
    };
  },

  max: (max: number, message?: string): ValidationRule<number> => {
    return (value: number) => {
      if (value === null || value === undefined) return null;
      const msg = message || `Must be no more than ${max}`;
      return value <= max ? null : msg;
    };
  },

  pattern: (regex: RegExp, message: string): ValidationRule<string> => {
    return (value: string) => {
      if (!value) return null;
      return regex.test(value) ? null : message;
    };
  },
};

