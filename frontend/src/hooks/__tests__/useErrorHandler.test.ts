import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '../useErrorHandler';
import { ApiError } from '../../services/apiClient.unified';

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with no error', () => {
    const { result } = renderHook(() => useErrorHandler());
    expect(result.current.error).toBeNull();
  });

  it('should handle ApiError correctly', () => {
    const { result } = renderHook(() => useErrorHandler());
    const apiError = new ApiError('Not found', 404);

    act(() => {
      result.current.handleError(apiError);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe('Not found');
    expect(result.current.error?.status).toBe(404);
    expect(result.current.error?.recoverable).toBe(false);
    expect(result.current.error?.suggestions).toContain('The requested resource was not found');
  });

  it('should handle standard Error correctly', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Something went wrong');

    act(() => {
      result.current.handleError(error);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe('Something went wrong');
    expect(result.current.error?.recoverable).toBe(true);
  });

  it('should handle server errors as recoverable', () => {
    const { result } = renderHook(() => useErrorHandler());
    const apiError = new ApiError('Internal server error', 500);

    act(() => {
      result.current.handleError(apiError);
    });

    expect(result.current.error?.recoverable).toBe(true);
    expect(result.current.error?.suggestions).toContain('Server error occurred');
  });

  it('should handle timeout errors correctly', () => {
    const { result } = renderHook(() => useErrorHandler());
    const timeoutError = { name: 'AbortError' };

    act(() => {
      result.current.handleError(timeoutError);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe('Request was cancelled or timed out');
    expect(result.current.error?.code).toBe('TIMEOUT');
    expect(result.current.error?.recoverable).toBe(true);
  });

  it('should clear error when clearError is called', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Test error');

    act(() => {
      result.current.handleError(error);
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should provide appropriate suggestions for 401 errors', () => {
    const { result } = renderHook(() => useErrorHandler());
    const apiError = new ApiError('Unauthorized', 401);

    act(() => {
      result.current.handleError(apiError);
    });

    expect(result.current.error?.suggestions).toContain('Please log in again');
  });

  it('should provide appropriate suggestions for 403 errors', () => {
    const { result } = renderHook(() => useErrorHandler());
    const apiError = new ApiError('Forbidden', 403);

    act(() => {
      result.current.handleError(apiError);
    });

    expect(result.current.error?.suggestions).toContain('You do not have permission to perform this action');
  });

  it('should handle unknown error types', () => {
    const { result } = renderHook(() => useErrorHandler());
    const unknownError = { someProperty: 'value' };

    act(() => {
      result.current.handleError(unknownError);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe('An unexpected error occurred');
    expect(result.current.error?.recoverable).toBe(true);
  });

  it('should log errors in development mode', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Test error');

    act(() => {
      result.current.handleError(error, 'Test context');
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

