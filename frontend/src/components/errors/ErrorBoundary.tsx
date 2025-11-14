/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-11-15
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorMessage } from '../molecules/ErrorMessage';
import { Button } from '../atoms/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    // Log to error tracking service in production
    if (import.meta.env.PROD) {
      // TODO: Integrate with error tracking service (e.g., Sentry, LogRocket)
      // errorTrackingService.logError(error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    this.setState({
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              
              <h2 className="text-xl font-bold text-neutral-900 mb-2">
                Something went wrong
              </h2>
              
              <p className="text-neutral-600 mb-4">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>

              {this.state.error && (
                <div className="mb-4">
                  <ErrorMessage
                    message={this.state.error.message || 'An unknown error occurred'}
                    size="sm"
                  />
                </div>
              )}

              {import.meta.env.DEV && this.state.errorInfo && (
                <details className="mb-4 text-left">
                  <summary className="cursor-pointer text-sm text-neutral-500 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs bg-neutral-100 p-3 rounded overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex gap-3 justify-center">
                <Button
                  variant="primary"
                  onClick={this.handleReset}
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

