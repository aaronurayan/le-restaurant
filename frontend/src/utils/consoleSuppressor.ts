/**
 * Console Suppressor
 * 
 * Suppresses browser console errors for network failures when backend is not available.
 * This is a workaround for browser-level network errors that cannot be completely suppressed.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

/**
 * Suppress network errors in console
 * Note: This only works for errors we can catch, browser-level errors will still show
 */
export function suppressNetworkErrors(): () => void {
  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;
  
  // Network error patterns to suppress
  const networkErrorPatterns = [
    /ERR_CONNECTION_REFUSED/i,
    /ERR_NETWORK/i,
    /Failed to fetch/i,
    /NetworkError/i,
    /Network request failed/i,
    /net::ERR_/i,
  ];
  
  // Check if error is a network error
  const isNetworkError = (message: string): boolean => {
    return networkErrorPatterns.some(pattern => pattern.test(message));
  };
  
  // Override console.error
  console.error = (...args: any[]) => {
    const message = args.map(arg => 
      typeof arg === 'string' ? arg : 
      arg instanceof Error ? arg.message : 
      JSON.stringify(arg)
    ).join(' ');
    
    // Suppress network errors
    if (isNetworkError(message)) {
      return; // Don't log network errors
    }
    
    // Log other errors normally
    originalError.apply(console, args);
  };
  
  // Override console.warn for network-related warnings
  console.warn = (...args: any[]) => {
    const message = args.map(arg => 
      typeof arg === 'string' ? arg : 
      arg instanceof Error ? arg.message : 
      JSON.stringify(arg)
    ).join(' ');
    
    // Suppress network warnings
    if (isNetworkError(message) || message.includes('Backend not connected')) {
      return; // Don't log network warnings
    }
    
    // Log other warnings normally
    originalWarn.apply(console, args);
  };
  
  // Return restore function
  return () => {
    console.error = originalError;
    console.warn = originalWarn;
  };
}

/**
 * Initialize console suppression in development mode
 */
export function initConsoleSuppression(): void {
  if (import.meta.env.DEV) {
    suppressNetworkErrors();
  }
}

