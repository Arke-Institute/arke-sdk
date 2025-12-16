/**
 * Content package error classes for the Arke SDK
 */

/**
 * Base error class for content operations
 */
export class ContentError extends Error {
  constructor(
    message: string,
    public code: string = 'CONTENT_ERROR',
    public details?: unknown
  ) {
    super(message);
    this.name = 'ContentError';
  }
}

/**
 * Thrown when an entity is not found by ID
 */
export class EntityNotFoundError extends ContentError {
  constructor(id: string) {
    super(`Entity not found: ${id}`, 'ENTITY_NOT_FOUND', { id });
    this.name = 'EntityNotFoundError';
  }
}

/**
 * Thrown when content is not found by CID
 */
export class ContentNotFoundError extends ContentError {
  constructor(cid: string) {
    super(`Content not found: ${cid}`, 'CONTENT_NOT_FOUND', { cid });
    this.name = 'ContentNotFoundError';
  }
}

/**
 * Thrown when a component is not found on an entity
 */
export class ComponentNotFoundError extends ContentError {
  constructor(id: string, componentName: string) {
    super(
      `Component '${componentName}' not found on entity ${id}`,
      'COMPONENT_NOT_FOUND',
      { id, componentName }
    );
    this.name = 'ComponentNotFoundError';
  }
}

/**
 * Thrown when a version is not found
 */
export class VersionNotFoundError extends ContentError {
  constructor(id: string, selector: string) {
    super(
      `Version not found: ${selector} for entity ${id}`,
      'VERSION_NOT_FOUND',
      { id, selector }
    );
    this.name = 'VersionNotFoundError';
  }
}

/**
 * Thrown when a network error occurs
 */
export class NetworkError extends ContentError {
  constructor(message: string, public statusCode?: number) {
    super(message, 'NETWORK_ERROR', { statusCode });
    this.name = 'NetworkError';
  }
}
