/**
 * Enterprise-Grade Logging Utility
 * 
 * Provides structured logging with different log levels, context, and
 * integration with external logging services.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogContext {
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
  requestId?: string;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private minLevel: LogLevel;
  private isDevelopment: boolean;
  private logBuffer: LogEntry[] = [];
  private bufferSize = 100;
  private flushInterval: number | null = null;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
    this.startBufferFlush();
  }

  /**
   * Start periodic buffer flush (for batching logs)
   */
  private startBufferFlush(): void {
    if (this.isDevelopment) return; // Don't buffer in development
    
    this.flushInterval = window.setInterval(() => {
      this.flushBuffer();
    }, 5000); // Flush every 5 seconds
  }

  /**
   * Flush log buffer to external service
   */
  private async flushBuffer(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    const logs = [...this.logBuffer];
    this.logBuffer = [];

    try {
      // In production, send to logging service
      if (import.meta.env.PROD) {
        // await this.sendToLoggingService(logs);
        // For now, just log to console in structured format
        console.group('📊 Batched Logs');
        logs.forEach(log => this.formatLog(log));
        console.groupEnd();
      }
    } catch (error) {
      console.error('Failed to flush logs:', error);
      // Re-add logs to buffer if flush failed
      this.logBuffer.unshift(...logs);
    }
  }

  /**
   * Format log entry for console
   */
  private formatLog(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const levelEmoji = {
      [LogLevel.DEBUG]: '🔍',
      [LogLevel.INFO]: 'ℹ️',
      [LogLevel.WARN]: '⚠️',
      [LogLevel.ERROR]: '❌',
      [LogLevel.FATAL]: '💀',
    }[entry.level];

    const levelName = LogLevel[entry.level];
    const prefix = `${levelEmoji} [${timestamp}] [${levelName}]`;

    const logData: any = {
      message: entry.message,
      ...(entry.context && { context: entry.context }),
      ...(entry.requestId && { requestId: entry.requestId }),
      ...(entry.userId && { userId: entry.userId }),
      ...(entry.error && { error: this.formatError(entry.error) }),
    };

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, logData);
        break;
      case LogLevel.INFO:
        console.info(prefix, logData);
        break;
      case LogLevel.WARN:
        console.warn(prefix, logData);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(prefix, logData);
        break;
    }
  }

  /**
   * Format error for logging
   */
  private formatError(error: Error): any {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof Error && 'status' in error && { status: (error as any).status }),
    };
  }

  /**
   * Log entry
   */
  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): void {
    if (level < this.minLevel) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
      requestId: this.getRequestId(),
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
    };

    // In development, log immediately
    if (this.isDevelopment) {
      this.formatLog(entry);
    } else {
      // In production, buffer logs
      this.logBuffer.push(entry);
      if (this.logBuffer.length >= this.bufferSize) {
        this.flushBuffer();
      }
    }

    // Always send errors to error tracking service
    if (level >= LogLevel.ERROR && import.meta.env.PROD) {
      this.sendToErrorTracking(entry);
    }
  }

  /**
   * Get current request ID from context
   */
  private getRequestId(): string | undefined {
    // Could be extracted from request headers or context
    return undefined;
  }

  /**
   * Get current user ID
   */
  private getUserId(): string | undefined {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.userId || parsed.user?.id;
      }
    } catch {
      // Ignore
    }
    return undefined;
  }

  /**
   * Get session ID
   */
  private getSessionId(): string | undefined {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  /**
   * Send error to error tracking service (e.g., Sentry)
   */
  private async sendToErrorTracking(entry: LogEntry): Promise<void> {
    // TODO: Integrate with error tracking service
    // Example: Sentry.captureException(entry.error, { extra: entry.context });
  }

  /**
   * Send logs to external logging service
   */
  private async sendToLoggingService(logs: LogEntry[]): Promise<void> {
    // TODO: Integrate with logging service (e.g., DataDog, CloudWatch)
    // Example: await fetch('/api/logs', { method: 'POST', body: JSON.stringify(logs) });
  }

  /**
   * Debug log
   */
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Info log
   */
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Warning log
   */
  warn(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  /**
   * Error log
   */
  error(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Fatal log
   */
  fatal(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  /**
   * Flush all buffered logs
   */
  async flush(): Promise<void> {
    await this.flushBuffer();
  }

  /**
   * Set minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
}

// Export singleton instance
export const logger = new Logger();

