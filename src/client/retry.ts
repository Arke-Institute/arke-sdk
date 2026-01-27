/**
 * Retry logic for transient network and server errors
 */

/**
 * Configuration for retry behavior
 */
export interface RetryConfig {
  /**
   * Maximum number of retry attempts
   * @default 3
   */
  maxRetries?: number;

  /**
   * Initial delay in milliseconds before first retry
   * @default 100
   */
  initialDelay?: number;

  /**
   * Maximum delay in milliseconds (caps exponential backoff)
   * @default 5000
   */
  maxDelay?: number;

  /**
   * Whether to retry on 5xx server errors
   * @default true
   */
  retryOn5xx?: boolean;

  /**
   * Whether to retry on network errors (connection refused, DNS, timeouts)
   * @default true
   */
  retryOnNetworkError?: boolean;

  /**
   * Optional callback invoked before each retry attempt
   * Useful for logging or monitoring
   */
  onRetry?: (attempt: number, error: Error, delayMs: number) => void;
}

export const DEFAULT_RETRY_CONFIG: Required<Omit<RetryConfig, 'onRetry'>> = {
  maxRetries: 3,
  initialDelay: 100,
  maxDelay: 5000,
  retryOn5xx: true,
  retryOnNetworkError: true,
};

/**
 * HTTP status codes that should be retried
 */
const RETRYABLE_STATUS_CODES = new Set([
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
  520, // Cloudflare: Unknown Error
  521, // Cloudflare: Web Server Is Down
  522, // Cloudflare: Connection Timed Out
  523, // Cloudflare: Origin Is Unreachable
  524, // Cloudflare: A Timeout Occurred
  525, // Cloudflare: SSL Handshake Failed
  526, // Cloudflare: Invalid SSL Certificate
  527, // Cloudflare: Railgun Error
  530, // Cloudflare: Origin DNS Error
]);

/**
 * Status codes that should never be retried
 */
const NON_RETRYABLE_STATUS_CODES = new Set([
  400, // Bad Request
  401, // Unauthorized
  403, // Forbidden
  404, // Not Found
  405, // Method Not Allowed
  409, // Conflict (CAS errors)
  410, // Gone
  422, // Unprocessable Entity
  429, // Too Many Requests (should be handled separately with rate limiting)
]);

/**
 * Check if a status code is retryable
 */
export function isRetryableStatus(status: number): boolean {
  if (NON_RETRYABLE_STATUS_CODES.has(status)) {
    return false;
  }
  return RETRYABLE_STATUS_CODES.has(status);
}

/**
 * Check if an error is a network error that should be retried
 */
export function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  // TypeError is thrown by fetch for network failures
  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();
    return (
      message.includes('failed to fetch') ||
      message.includes('network') ||
      message.includes('fetch failed') ||
      message.includes('econnrefused') ||
      message.includes('econnreset') ||
      message.includes('etimedout') ||
      message.includes('enotfound') ||
      message.includes('dns') ||
      message.includes('socket')
    );
  }

  // Check for abort errors (timeouts)
  if (error.name === 'AbortError') {
    return true;
  }

  return false;
}

/**
 * Check if a response is a Cloudflare error page (HTML instead of JSON)
 */
export function isCloudflareErrorResponse(response: Response): boolean {
  const contentType = response.headers.get('content-type') || '';

  // If we expect JSON but got HTML, it's likely a Cloudflare error page
  if (contentType.includes('text/html') && !response.ok) {
    return true;
  }

  return false;
}

/**
 * Calculate delay with exponential backoff and jitter
 */
export function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number
): number {
  // Exponential backoff: initialDelay * 2^attempt
  const exponentialDelay = initialDelay * Math.pow(2, attempt);

  // Cap at maxDelay
  const cappedDelay = Math.min(exponentialDelay, maxDelay);

  // Add jitter (0-100% of the delay)
  const jitter = Math.random() * cappedDelay;

  return Math.floor(cappedDelay + jitter);
}

/**
 * Sleep for a specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a fetch function with retry logic
 *
 * @example
 * ```typescript
 * const retryFetch = createRetryFetch({
 *   maxRetries: 3,
 *   onRetry: (attempt, error, delay) => {
 *     console.log(`Retry ${attempt} after ${delay}ms: ${error.message}`);
 *   }
 * });
 *
 * // Use with openapi-fetch
 * const client = createClient<paths>({
 *   baseUrl: 'https://api.example.com',
 *   fetch: retryFetch,
 * });
 * ```
 */
export function createRetryFetch(config: RetryConfig = {}): typeof fetch {
  const {
    maxRetries = DEFAULT_RETRY_CONFIG.maxRetries,
    initialDelay = DEFAULT_RETRY_CONFIG.initialDelay,
    maxDelay = DEFAULT_RETRY_CONFIG.maxDelay,
    retryOn5xx = DEFAULT_RETRY_CONFIG.retryOn5xx,
    retryOnNetworkError = DEFAULT_RETRY_CONFIG.retryOnNetworkError,
    onRetry,
  } = config;

  return async function retryFetch(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Clone Request objects to allow retries - Request bodies can only be consumed once
        const reqInput = input instanceof Request ? input.clone() : input;
        const response = await fetch(reqInput, init);

        // Check for Cloudflare error pages
        if (isCloudflareErrorResponse(response) && attempt < maxRetries) {
          const error = new Error(
            `Cloudflare error (status ${response.status})`
          );
          lastError = error;

          const delay = calculateDelay(attempt, initialDelay, maxDelay);
          onRetry?.(attempt + 1, error, delay);
          await sleep(delay);
          continue;
        }

        // Check for retryable status codes
        if (retryOn5xx && isRetryableStatus(response.status) && attempt < maxRetries) {
          const error = new Error(
            `Server error (status ${response.status})`
          );
          lastError = error;

          const delay = calculateDelay(attempt, initialDelay, maxDelay);
          onRetry?.(attempt + 1, error, delay);
          await sleep(delay);
          continue;
        }

        // Success or non-retryable error
        return response;
      } catch (error) {
        // Network errors
        if (
          retryOnNetworkError &&
          isNetworkError(error) &&
          attempt < maxRetries
        ) {
          lastError = error as Error;

          const delay = calculateDelay(attempt, initialDelay, maxDelay);
          onRetry?.(attempt + 1, error as Error, delay);
          await sleep(delay);
          continue;
        }

        // Non-retryable error or exhausted retries
        throw error;
      }
    }

    // Exhausted all retries
    throw lastError ?? new Error('Request failed after retries');
  };
}
