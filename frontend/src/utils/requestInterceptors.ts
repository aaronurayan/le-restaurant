/**
 * Request Interceptors
 * 
 * Provides middleware-like functionality for API requests.
 * Allows transformation of requests before they're sent.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

export interface RequestContext {
  url: string;
  method: string;
  headers: HeadersInit;
  body?: any;
  endpoint: string;
  requestId: string;
  timestamp: number;
}

export interface ResponseContext {
  url: string;
  status: number;
  headers: Headers;
  data: any;
  requestId: string;
  timestamp: number;
  duration: number;
}

export type RequestInterceptor = (context: RequestContext) => RequestContext | Promise<RequestContext>;
export type ResponseInterceptor = (context: ResponseContext) => ResponseContext | Promise<ResponseContext>;
export type ErrorInterceptor = (error: Error, context: RequestContext) => Error | Promise<Error>;

class InterceptorManager {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor);
    // Return unsubscribe function
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.requestInterceptors.splice(index, 1);
      }
    };
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor);
    // Return unsubscribe function
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.responseInterceptors.splice(index, 1);
      }
    };
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
    this.errorInterceptors.push(interceptor);
    // Return unsubscribe function
    return () => {
      const index = this.errorInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.errorInterceptors.splice(index, 1);
      }
    };
  }

  /**
   * Execute request interceptors
   */
  async executeRequestInterceptors(context: RequestContext): Promise<RequestContext> {
    let result = context;
    for (const interceptor of this.requestInterceptors) {
      result = await interceptor(result);
    }
    return result;
  }

  /**
   * Execute response interceptors
   */
  async executeResponseInterceptors(context: ResponseContext): Promise<ResponseContext> {
    let result = context;
    for (const interceptor of this.responseInterceptors) {
      result = await interceptor(result);
    }
    return result;
  }

  /**
   * Execute error interceptors
   */
  async executeErrorInterceptors(error: Error, context: RequestContext): Promise<Error> {
    let result = error;
    for (const interceptor of this.errorInterceptors) {
      result = await interceptor(result, context);
    }
    return result;
  }

  /**
   * Clear all interceptors
   */
  clear(): void {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.errorInterceptors = [];
  }
}

// Export singleton instance
export const interceptorManager = new InterceptorManager();

// =============================================================================
// Built-in Interceptors
// =============================================================================

/**
 * Request timestamp interceptor
 * Adds request timestamp to headers
 */
export const timestampInterceptor: RequestInterceptor = (context) => {
  return {
    ...context,
    headers: {
      ...context.headers,
      'X-Request-Timestamp': context.timestamp.toString(),
    },
  };
};

/**
 * Client info interceptor
 * Adds client information to headers
 */
export const clientInfoInterceptor: RequestInterceptor = (context) => {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  const language = typeof navigator !== 'undefined' ? navigator.language : 'en';
  
  return {
    ...context,
    headers: {
      ...context.headers,
      'X-Client-User-Agent': userAgent,
      'X-Client-Language': language,
      'X-Client-TimeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
};

/**
 * Response data transformation interceptor
 * Extracts data from standard API response format
 */
export const responseDataInterceptor: ResponseInterceptor = (context) => {
  // If response follows ApiResponse<T> format, extract data
  if (context.data && typeof context.data === 'object' && 'data' in context.data) {
    return {
      ...context,
      data: context.data.data,
    };
  }
  return context;
};

/**
 * Error normalization interceptor
 * Normalizes different error types
 */
export const errorNormalizationInterceptor: ErrorInterceptor = (error, context) => {
  // Add context to error if it's a standard Error
  if (error instanceof Error && !('context' in error)) {
    (error as any).context = {
      url: context.url,
      method: context.method,
      requestId: context.requestId,
    };
  }
  return error;
};

