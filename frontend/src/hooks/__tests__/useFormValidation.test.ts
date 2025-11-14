import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation, ValidationRules } from '../useFormValidation';

interface TestForm {
  email: string;
  password: string;
  age?: number;
  name: string;
}

describe('useFormValidation', () => {
  const schema = {
    email: [
      ValidationRules.required('Email is required'),
      ValidationRules.email('Invalid email format'),
    ],
    password: [
      ValidationRules.required('Password is required'),
      ValidationRules.minLength(8, 'Password must be at least 8 characters'),
    ],
    age: [
      ValidationRules.min(18, 'Must be at least 18 years old'),
    ],
    name: [
      ValidationRules.required('Name is required'),
      ValidationRules.minLength(2, 'Name must be at least 2 characters'),
    ],
  };

  it('should initialize with no errors', () => {
    const { result } = renderHook(() => useFormValidation<TestForm>(schema));
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
  });

  it('should validate required fields', () => {
    const { result } = renderHook(() => useFormValidation<TestForm>(schema));

    act(() => {
      result.current.validate({ email: '', password: '', name: '' } as TestForm);
    });

    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.password).toBe('Password is required');
    expect(result.current.errors.name).toBe('Name is required');
    expect(result.current.isValid).toBe(false);
  });

  it('should validate email format', () => {
    const { result } = renderHook(() => useFormValidation<TestForm>(schema));

    act(() => {
      result.current.validate({ email: 'invalid-email', password: 'password123', name: 'John' } as TestForm);
    });

    expect(result.current.errors.email).toBe('Invalid email format');
  });

  it('should validate password minimum length', () => {
    const { result } = renderHook(() => useFormValidation<TestForm>(schema));

    act(() => {
      result.current.validate({ email: 'test@example.com', password: 'short', name: 'John' } as TestForm);
    });

    expect(result.current.errors.password).toBe('Password must be at least 8 characters');
  });

  it('should pass validation for valid form data', () => {
    const { result } = renderHook(() => useFormValidation<TestForm>(schema));

    act(() => {
      const isValid = result.current.validate({
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
      } as TestForm);
      expect(isValid).toBe(true);
    });

    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
  });

  it('should validate field in real-time', () => {
    const { result } = renderHook(() => useFormValidation<TestForm>(schema));

    act(() => {
      result.current.validateFieldRealTime('email', 'invalid', { email: 'invalid' } as TestForm);
    });

    expect(result.current.errors.email).toBe('Invalid email format');

    act(() => {
      result.current.validateFieldRealTime('email', 'valid@example.com', { email: 'valid@example.com' } as TestForm);
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('should clear all errors', () => {
    const { result } = renderHook(() => useFormValidation<TestForm>(schema));

    act(() => {
      result.current.validate({ email: '', password: '', name: '' } as TestForm);
    });

    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);

    act(() => {
      result.current.clearErrors();
    });

    expect(result.current.errors).toEqual({});
  });

  it('should clear specific field error', () => {
    const { result } = renderHook(() => useFormValidation<TestForm>(schema));

    act(() => {
      result.current.validate({ email: '', password: 'password123', name: 'John' } as TestForm);
    });

    expect(result.current.errors.email).toBeDefined();

    act(() => {
      result.current.clearFieldError('email');
    });

    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.errors.password).toBeUndefined(); // password was valid
  });

  it('should validate optional fields only when provided', () => {
    const { result } = renderHook(() => useFormValidation<TestForm>(schema));

    act(() => {
      const isValid = result.current.validate({
        email: 'test@example.com',
        password: 'password123',
        name: 'John',
        age: undefined,
      } as TestForm);
      expect(isValid).toBe(true);
    });

    expect(result.current.errors.age).toBeUndefined();
  });

  it('should validate minimum age when provided', () => {
    const { result } = renderHook(() => useFormValidation<TestForm>(schema));

    act(() => {
      result.current.validate({
        email: 'test@example.com',
        password: 'password123',
        name: 'John',
        age: 16,
      } as TestForm);
    });

    expect(result.current.errors.age).toBe('Must be at least 18 years old');
  });

  it('should handle empty string as invalid for required fields', () => {
    const { result } = renderHook(() => useFormValidation<TestForm>(schema));

    act(() => {
      result.current.validateField('name', '');
    });

    expect(result.current.validateField('name', '')).toBe('Name is required');
  });

  it('should handle whitespace-only strings as invalid for required fields', () => {
    const { result } = renderHook(() => useFormValidation<TestForm>(schema));

    const error = result.current.validateField('name', '   ');
    expect(error).toBe('Name is required');
  });
});

