/**
 * Retry logic with exponential backoff
 */

import { isRetryableError } from './errors.js';

export interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  shouldRetry?: (error: any) => boolean;
  jitter?: boolean; // Add randomization to prevent thundering herd
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  shouldRetry: isRetryableError,
  jitter: true,
};

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  let lastError: any;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry if we've exhausted attempts
      if (attempt >= opts.maxRetries) {
        throw error;
      }

      // Check if error is retryable
      if (opts.shouldRetry && !opts.shouldRetry(error)) {
        throw error;
      }

      // Handle 429 Rate Limit with Retry-After header
      let delay: number;
      if (error.statusCode === 429 && error.retryAfter) {
        // Use Retry-After header if present (in seconds)
        delay = Math.min(error.retryAfter * 1000, opts.maxDelay);
      } else {
        // Calculate delay with exponential backoff
        delay = Math.min(
          opts.initialDelay * Math.pow(2, attempt),
          opts.maxDelay
        );
      }

      // Add jitter to prevent thundering herd (±25% randomization)
      if (opts.jitter) {
        const jitterAmount = delay * 0.25;
        delay = delay + (Math.random() * jitterAmount * 2 - jitterAmount);
      }

      await sleep(Math.floor(delay));
    }
  }

  throw lastError;
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
