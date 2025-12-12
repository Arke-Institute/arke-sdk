/**
 * Graph package error classes for the Arke SDK
 */

/**
 * Base error class for graph operations
 */
export class GraphError extends Error {
  constructor(
    message: string,
    public code: string = 'GRAPH_ERROR',
    public details?: unknown
  ) {
    super(message);
    this.name = 'GraphError';
  }
}

/**
 * Thrown when an entity is not found by canonical ID
 */
export class GraphEntityNotFoundError extends GraphError {
  constructor(canonicalId: string) {
    super(`Graph entity not found: ${canonicalId}`, 'ENTITY_NOT_FOUND', { canonicalId });
    this.name = 'GraphEntityNotFoundError';
  }
}

/**
 * Thrown when no paths are found between entities
 */
export class NoPathFoundError extends GraphError {
  constructor(sourceIds: string[], targetIds: string[]) {
    super(
      `No path found between sources and targets`,
      'NO_PATH_FOUND',
      { sourceIds, targetIds }
    );
    this.name = 'NoPathFoundError';
  }
}

/**
 * Thrown when a network error occurs
 */
export class NetworkError extends GraphError {
  constructor(message: string, public statusCode?: number) {
    super(message, 'NETWORK_ERROR', { statusCode });
    this.name = 'NetworkError';
  }
}
