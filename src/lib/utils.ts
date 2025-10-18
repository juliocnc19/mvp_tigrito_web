import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Development logging utilities for Auth module
// API Error handling utilities
export function processApiError(error: any): string {
  if (!error) return 'Ha ocurrido un error desconocido';

  // Handle structured API errors
  if (error.error && error.error.details) {
    const { details } = error.error;

    // Handle validation errors (array of error messages)
    if (Array.isArray(details)) {
      // Join validation errors with newlines for better readability
      return details.join('\n');
    }

    // Handle other details
    if (typeof details === 'string') {
      return details;
    }
  }

  // Handle direct error messages
  if (error.error && error.error.message) {
    return error.error.message;
  }

  // Handle generic message
  if (error.message) {
    return error.message;
  }

  // Fallback
  return 'Ha ocurrido un error en la solicitud';
}

export const authLogger = {
  info: (operation: string, data?: any, userId?: string) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const userInfo = userId ? ` [User: ${userId}]` : '';
      console.log(`[${timestamp}] 🔐 AUTH ${operation}${userInfo}`, data || '');
    }
  },

  warn: (operation: string, message: string, data?: any, userId?: string) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const userInfo = userId ? ` [User: ${userId}]` : '';
      console.warn(`[${timestamp}] ⚠️  AUTH ${operation}${userInfo}: ${message}`, data || '');
    }
  },

  error: (operation: string, error: any, data?: any, userId?: string) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const userInfo = userId ? ` [User: ${userId}]` : '';
      console.error(`[${timestamp}] ❌ AUTH ${operation}${userInfo}:`, {
        error: error.message || error,
        stack: error.stack,
        data: data || {}
      });
    }
  },

  success: (operation: string, data?: any, userId?: string) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const userInfo = userId ? ` [User: ${userId}]` : '';
      console.log(`[${timestamp}] ✅ AUTH ${operation}${userInfo}`, data || '');
    }
  },

  // Specific auth operations
  loginAttempt: (identifier: string) => {
    authLogger.info('LOGIN_ATTEMPT', { identifier });
  },

  loginSuccess: (userId: string, role: string) => {
    authLogger.success('LOGIN_SUCCESS', { role }, userId);
  },

  loginFailed: (identifier: string, reason: string) => {
    authLogger.warn('LOGIN_FAILED', reason, { identifier });
  },

  registerAttempt: (email?: string, phone?: string) => {
    authLogger.info('REGISTER_ATTEMPT', { email, phone });
  },

  registerSuccess: (userId: string, role: string) => {
    authLogger.success('REGISTER_SUCCESS', { role }, userId);
  },

  registerFailed: (email?: string, phone?: string, reason?: string) => {
    authLogger.warn('REGISTER_FAILED', reason || 'Registration failed', { email, phone });
  },

  tokenGenerated: (userId: string, type: 'access' | 'refresh') => {
    authLogger.info('TOKEN_GENERATED', { type }, userId);
  },

  validationFailed: (operation: string, errors: any[], userId?: string) => {
    authLogger.warn('VALIDATION_FAILED', `Validation errors: ${errors.length}`, JSON.stringify(errors) || '', userId);
  },

  dbOperation: (operation: string, success: boolean, userId?: string, data?: any) => {
    if (success) {
      authLogger.info(`DB_${operation.toUpperCase()}_SUCCESS`, data || {}, userId);
    } else {
      authLogger.error(`DB_${operation.toUpperCase()}_FAILED`, new Error('Database operation failed'), data || {}, userId);
    }
  },

  securityEvent: (event: string, details: any, userId?: string) => {
    authLogger.warn(`SECURITY_${event.toUpperCase()}`, event, details, userId);
  },

  // Complete AUTH flow logging
  authFlowComplete: (operation: string, flowData: any, userId?: string) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const userInfo = userId ? ` [User: ${userId}]` : '';
      console.log(`[${timestamp}] 🔐 AUTH ${operation}_FLOW_COMPLETE${userInfo}`, flowData);
    }
  }
};
