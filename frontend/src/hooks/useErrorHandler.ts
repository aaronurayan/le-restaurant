/**
 * Error Handler Hook
 * 
 * Provides consistent error handling across the application.
 * Normalizes errors, provides user-friendly messages, and handles error logging.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-11-15
 */

import { useState, useCallback } from 'react';
import { ApiError } from '../services/apiClient.unified';

/**
 * Normalized error structure
 */
export interface NormalizedError {
  message: string;
  code?: string;
  status?: number;
  recoverable: boolean;
  suggestions?: string[];
}

/**
 * Hook for consistent error handling
 */
export const useErrorHandler = () => {
  const [error, setError] = useState<NormalizedError | null>(null);

  /**
   * Normalize different error types to a consistent format
   */
  const normalizeError = useCallback((err: unknown): NormalizedError => {
    // ApiError from unified API client
    if (err instanceof ApiError) {
      return {
        message: err.message || 'An error occurred while communicating with the server',
        code: err.status.toString(),
        status: err.status,
        recoverable: err.status >= 500 || err.status === 408, // Server errors and timeouts are recoverable
        suggestions: getErrorSuggestions(err.status),
      };
    }

    // Standard Error
    if (err instanceof Error) {
      return {
        message: err.message || 'An unexpected error occurred',
        recoverable: true,
        suggestions: ['Please try again', 'Check your internet connection'],
      };
    }

    // Network errors
    if (err && typeof err === 'object' && 'name' in err) {
      if (err.name === 'AbortError') {
        return {
          message: 'Request was cancelled or timed out',
          code: 'TIMEOUT',
          recoverable: true,
          suggestions: ['Please try again', 'Check your internet connection'],
        };
      }
    }

    // Unknown error type
    return {
      message: 'An unexpected error occurred',
      recoverable: true,
      suggestions: ['Please try again', 'Refresh the page'],
    };
  }, []);

  /**
   * Handle an error
   */
  const handleError = useCallback((err: unknown, context?: string) => {
    const normalizedError = normalizeError(err);
    
    // Completely suppress network errors in console
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : '';
    const fullErrorText = `${errorMessage} ${errorStack}`;
    
    const isNetworkError = 
      errorMessage.includes('Network Error') || 
      errorMessage.includes('ERR_CONNECTION_REFUSED') ||
      errorMessage.includes('ERR_NETWORK') ||
      errorMessage.includes('fetch') ||
      errorMessage.includes('Failed to fetch') ||
      fullErrorText.includes('net::ERR_') ||
      (err instanceof Error && err.name === 'TypeError' && errorMessage.includes('fetch'));
    
    // Only log non-network errors or critical errors
    if (import.meta.env.DEV && (!isNetworkError || context?.includes('critical'))) {
      if (!isNetworkError) {
        console.error(`[Error Handler] ${context || 'Error'}:`, err);
        console.error('Normalized error:', normalizedError);
      }
    }

    // In production, log to error tracking service
    if (import.meta.env.PROD) {
      // TODO: Integrate with error tracking service
      // errorTrackingService.logError(normalizedError, { context });
    }

    setError(normalizedError);
  }, [normalizeError]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    normalizeError,
  };
};

/**
 * Get user-friendly suggestions based on HTTP status code
 */
function getErrorSuggestions(status: number): string[] {
  switch (status) {
    case 400:
      return ['Please check your input and try again', 'Make sure all required fields are filled'];
    case 401:
      return ['Please log in again', 'Your session may have expired'];
    case 403:
      return ['You do not have permission to perform this action', 'Contact your administrator'];
    case 404:
      return ['The requested resource was not found', 'It may have been deleted or moved'];
    case 408:
    case 504:
      return ['The request took too long', 'Please try again', 'Check your internet connection'];
    case 409:
      return ['This resource already exists', 'Please check for duplicates'];
    case 429:
      return ['Too many requests', 'Please wait a moment and try again'];
    case 500:
    case 502:
    case 503:
      return ['Server error occurred', 'Please try again in a moment', 'If the problem persists, contact support'];
    default:
      return ['Please try again', 'If the problem persists, contact support'];
  }
}

