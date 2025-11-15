/**
 * Request Validator
 * 
 * Validates API requests before sending to ensure data integrity.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

export interface ValidationRule<T = any> {
  validate: (value: T) => boolean | string;
  message?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class ValidationError extends Error {
  constructor(
    public errors: string[],
    message: string = 'Validation failed'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate request body
 */
export function validateRequest<T>(
  data: T,
  rules: Record<string, ValidationRule[]>
): ValidationResult {
  const errors: string[] = [];

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = (data as any)[field];
    
    for (const rule of fieldRules) {
      const result = rule.validate(value);
      if (result !== true) {
        const errorMessage = typeof result === 'string' 
          ? result 
          : rule.message || `Validation failed for ${field}`;
        errors.push(`${field}: ${errorMessage}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Common validation rules
 */
export const ValidationRules = {
  required: <T>(message?: string): ValidationRule<T> => ({
    validate: (value: T) => {
      if (value === null || value === undefined || value === '') {
        return message || 'This field is required';
      }
      return true;
    },
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value: string) => {
      if (typeof value !== 'string' || value.length < min) {
        return message || `Must be at least ${min} characters`;
      }
      return true;
    },
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value: string) => {
      if (typeof value !== 'string' || value.length > max) {
        return message || `Must be at most ${max} characters`;
      }
      return true;
    },
  }),

  email: (message?: string): ValidationRule<string> => ({
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value !== 'string' || !emailRegex.test(value)) {
        return message || 'Invalid email format';
      }
      return true;
    },
  }),

  min: (min: number, message?: string): ValidationRule<number> => ({
    validate: (value: number) => {
      if (typeof value !== 'number' || value < min) {
        return message || `Must be at least ${min}`;
      }
      return true;
    },
  }),

  max: (max: number, message?: string): ValidationRule<number> => ({
    validate: (value: number) => {
      if (typeof value !== 'number' || value > max) {
        return message || `Must be at most ${max}`;
      }
      return true;
    },
  }),

  pattern: (regex: RegExp, message?: string): ValidationRule<string> => ({
    validate: (value: string) => {
      if (typeof value !== 'string' || !regex.test(value)) {
        return message || 'Invalid format';
      }
      return true;
    },
  }),
};

