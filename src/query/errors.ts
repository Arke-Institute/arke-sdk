/**
 * Error class for query operations
 */
export class QueryError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public details?: unknown
  ) {
    super(message);
    this.name = 'QueryError';
  }
}
