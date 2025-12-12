/**
 * Error classes for edit operations
 */

export class EditError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public details?: unknown
  ) {
    super(message);
    this.name = 'EditError';
  }
}

export class EntityNotFoundError extends EditError {
  constructor(pi: string) {
    super(`Entity not found: ${pi}`, 'ENTITY_NOT_FOUND', { pi });
    this.name = 'EntityNotFoundError';
  }
}

export class CASConflictError extends EditError {
  constructor(pi: string, expectedTip: string, actualTip: string) {
    super(
      `CAS conflict: entity ${pi} was modified (expected ${expectedTip}, got ${actualTip})`,
      'CAS_CONFLICT',
      { pi, expectedTip, actualTip }
    );
    this.name = 'CASConflictError';
  }
}

export class ReprocessError extends EditError {
  constructor(message: string, batchId?: string) {
    super(message, 'REPROCESS_ERROR', { batchId });
    this.name = 'ReprocessError';
  }
}

export class ValidationError extends EditError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', { field });
    this.name = 'ValidationError';
  }
}

export class PermissionError extends EditError {
  constructor(message: string, pi?: string) {
    super(message, 'PERMISSION_DENIED', { pi });
    this.name = 'PermissionError';
  }
}
