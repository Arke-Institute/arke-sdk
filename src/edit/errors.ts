/**
 * Error classes for edit operations
 */

/**
 * Base error class for edit operations
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

/**
 * Thrown when an entity is not found
 */
export class EntityNotFoundError extends EditError {
  constructor(id: string) {
    super(`Entity not found: ${id}`, 'ENTITY_NOT_FOUND', { id });
    this.name = 'EntityNotFoundError';
  }
}

/**
 * Thrown when a CAS (Compare-And-Swap) conflict occurs
 * This means the entity was modified since it was last read
 */
export class CASConflictError extends EditError {
  constructor(id: string, expectedTip: string, actualTip: string) {
    super(
      `CAS conflict: entity ${id} was modified (expected ${expectedTip}, got ${actualTip})`,
      'CAS_CONFLICT',
      { id, expectedTip, actualTip }
    );
    this.name = 'CASConflictError';
  }
}

/**
 * Thrown when an entity ID already exists (on create)
 */
export class EntityExistsError extends EditError {
  constructor(id: string) {
    super(`Entity already exists: ${id}`, 'ENTITY_EXISTS', { id });
    this.name = 'EntityExistsError';
  }
}

/**
 * Thrown when a merge operation fails
 */
export class MergeError extends EditError {
  constructor(message: string, sourceId?: string, targetId?: string) {
    super(message, 'MERGE_ERROR', { sourceId, targetId });
    this.name = 'MergeError';
  }
}

/**
 * Thrown when an unmerge operation fails
 */
export class UnmergeError extends EditError {
  constructor(message: string, sourceId?: string, targetId?: string) {
    super(message, 'UNMERGE_ERROR', { sourceId, targetId });
    this.name = 'UnmergeError';
  }
}

/**
 * Thrown when a delete operation fails
 */
export class DeleteError extends EditError {
  constructor(message: string, id?: string) {
    super(message, 'DELETE_ERROR', { id });
    this.name = 'DeleteError';
  }
}

/**
 * Thrown when an undelete operation fails
 */
export class UndeleteError extends EditError {
  constructor(message: string, id?: string) {
    super(message, 'UNDELETE_ERROR', { id });
    this.name = 'UndeleteError';
  }
}

/**
 * Thrown when reprocessing fails
 */
export class ReprocessError extends EditError {
  constructor(message: string, batchId?: string) {
    super(message, 'REPROCESS_ERROR', { batchId });
    this.name = 'ReprocessError';
  }
}

/**
 * Thrown when request validation fails
 */
export class ValidationError extends EditError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', { field });
    this.name = 'ValidationError';
  }
}

/**
 * Thrown when the user doesn't have permission
 */
export class PermissionError extends EditError {
  constructor(message: string, id?: string) {
    super(message, 'PERMISSION_DENIED', { id });
    this.name = 'PermissionError';
  }
}

/**
 * Thrown when a network error occurs
 */
export class NetworkError extends EditError {
  constructor(message: string, statusCode?: number) {
    super(message, 'NETWORK_ERROR', { statusCode });
    this.name = 'NetworkError';
  }
}

/**
 * Thrown when content is not found by CID
 */
export class ContentNotFoundError extends EditError {
  constructor(cid: string) {
    super(`Content not found: ${cid}`, 'CONTENT_NOT_FOUND', { cid });
    this.name = 'ContentNotFoundError';
  }
}

/**
 * Thrown when the IPFS backend has an error
 */
export class IPFSError extends EditError {
  constructor(message: string) {
    super(message, 'IPFS_ERROR');
    this.name = 'IPFSError';
  }
}

/**
 * Thrown when the backend API has an error
 */
export class BackendError extends EditError {
  constructor(message: string) {
    super(message, 'BACKEND_ERROR');
    this.name = 'BackendError';
  }
}
