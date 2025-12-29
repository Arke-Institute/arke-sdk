/**
 * SDK error classes
 */

/**
 * Base error class for all Arke SDK errors
 */
export class ArkeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ArkeError';
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace?.(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details,
    };
  }
}

/**
 * CAS (Compare-And-Swap) conflict - entity was modified by another request
 */
export class CASConflictError extends ArkeError {
  constructor(
    public readonly expectedTip?: string,
    public readonly actualTip?: string
  ) {
    super(
      'Entity was modified by another request. Refresh and retry with the current tip.',
      'CAS_CONFLICT',
      409,
      { expectedTip, actualTip }
    );
    this.name = 'CASConflictError';
  }
}

/**
 * Resource not found
 */
export class NotFoundError extends ArkeError {
  constructor(resourceType: string, id: string) {
    super(`${resourceType} not found: ${id}`, 'NOT_FOUND', 404, { resourceType, id });
    this.name = 'NotFoundError';
  }
}

/**
 * Validation error - invalid request data
 */
export class ValidationError extends ArkeError {
  constructor(
    message: string,
    public readonly field?: string,
    details?: unknown
  ) {
    super(message, 'VALIDATION_ERROR', 400, details ?? { field });
    this.name = 'ValidationError';
  }
}

/**
 * Authentication required or invalid
 */
export class AuthenticationError extends ArkeError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTH_REQUIRED', 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Permission denied
 */
export class ForbiddenError extends ArkeError {
  constructor(action?: string, resource?: string) {
    const msg = action
      ? `Permission denied: ${action}${resource ? ` on ${resource}` : ''}`
      : 'Permission denied';
    super(msg, 'FORBIDDEN', 403, { action, resource });
    this.name = 'ForbiddenError';
  }
}

/**
 * Parse API error response into appropriate error class
 */
export function parseApiError(status: number, body: unknown): ArkeError {
  const errorBody = body as { error?: string; message?: string; details?: unknown } | null;
  const message = errorBody?.error ?? errorBody?.message ?? 'Unknown error';

  switch (status) {
    case 400:
      return new ValidationError(message, undefined, errorBody?.details);

    case 401:
      return new AuthenticationError(message);

    case 403:
      return new ForbiddenError(message);

    case 404:
      return new NotFoundError('Resource', 'unknown');

    case 409: {
      // Parse CAS conflict details if available
      const details = errorBody?.details as { expected?: string; actual?: string } | undefined;
      return new CASConflictError(details?.expected, details?.actual);
    }

    default:
      return new ArkeError(message, 'API_ERROR', status, errorBody?.details);
  }
}
