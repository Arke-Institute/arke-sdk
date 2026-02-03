/**
 * CAS (Compare-And-Swap) retry utility for concurrent updates
 *
 * Use this for additive operations where your update doesn't depend on
 * current state - you just need the tip for CAS validation.
 */

import { CASConflictError } from '../client/errors.js';

/**
 * Configuration for CAS retry behavior
 */
export interface CasRetryOptions {
  /**
   * Expected number of concurrent writers - affects retry timing.
   * Higher concurrency = more initial spread and more retry headroom.
   * @default 10
   */
  concurrency?: number;

  /**
   * Override: maximum retry attempts.
   * If not specified, calculated from concurrency.
   */
  maxAttempts?: number;

  /**
   * Base delay between retries in ms.
   * Actual delay grows exponentially with jitter.
   * @default 50
   */
  baseDelayMs?: number;

  /**
   * Maximum delay between retries in ms (caps exponential growth).
   * @default 10000
   */
  maxDelayMs?: number;

  /**
   * Add initial random delay before first attempt to spread concurrent requests.
   * Delay range: 0 to (concurrency * 100)ms. E.g., 500 concurrent = 0-50s spread.
   * This dramatically reduces collisions by staggering first attempts.
   * @default true
   */
  spreadInitial?: boolean;

  /**
   * Called before each retry attempt.
   * Useful for logging or monitoring.
   */
  onRetry?: (attempt: number, error: CASConflictError, delayMs: number) => void;
}

/**
 * Result of a successful CAS retry operation
 */
export interface CasRetryResult<T> {
  /** The successful response data */
  data: T;
  /** Number of attempts made (1 = succeeded first try) */
  attempts: number;
}

/**
 * Callbacks for CAS retry operation
 */
export interface CasRetryCallbacks<T> {
  /** Get the current tip/CID - called before each attempt */
  getTip: () => Promise<string>;
  /** Perform the update with given tip - return {data, error} like openapi-fetch */
  update: (tip: string) => Promise<{ data?: T; error?: unknown }>;
}

/**
 * Default configuration values
 */
export const DEFAULT_CAS_RETRY_CONFIG = {
  concurrency: 10,
  baseDelayMs: 50,
  maxDelayMs: 10000, // 10 seconds - allows more spread at high concurrency
} as const;

/**
 * Calculate max attempts from concurrency level.
 * Formula: max(5, ceil(log2(concurrency) * 4) + floor(concurrency / 100))
 *
 * The logarithmic component handles the base scaling, while the linear
 * component adds extra headroom at very high concurrency levels.
 *
 * Examples:
 * - concurrency 10 → 14 attempts
 * - concurrency 100 → 28 attempts
 * - concurrency 500 → 41 attempts
 * - concurrency 1000 → 50 attempts
 */
export function calculateMaxAttempts(concurrency: number): number {
  const logComponent = Math.ceil(Math.log2(Math.max(2, concurrency)) * 4);
  const linearComponent = Math.floor(concurrency / 100);
  return Math.max(5, logComponent + linearComponent);
}

/**
 * Calculate delay with exponential backoff and heavy jitter.
 * Jitter is 0-100% of the base delay to spread concurrent retries.
 *
 * Formula: min(baseDelay * 1.5^attempt + random(0, baseDelay * 1.5^attempt), maxDelay)
 */
export function calculateCasDelay(
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number
): number {
  // Exponential backoff: baseDelay * 1.5^attempt
  const exponentialDelay = baseDelayMs * Math.pow(1.5, attempt);

  // Cap at maxDelay before adding jitter
  const cappedDelay = Math.min(exponentialDelay, maxDelayMs);

  // Heavy jitter: 0-100% of the delay (critical for spreading concurrent retries)
  const jitter = Math.random() * cappedDelay;

  return Math.floor(cappedDelay + jitter);
}

/**
 * Check if an error is a CAS conflict.
 * Handles multiple error shapes:
 * - openapi-fetch: { status: 409, ... }
 * - API error body: { error: "CAS failure: ..." }
 */
export function isCasConflictError(error: unknown): boolean {
  if (error === null || error === undefined) {
    return false;
  }

  if (typeof error !== 'object') {
    return false;
  }

  // Check for status 409 (openapi-fetch error shape)
  if ('status' in error && (error as { status: unknown }).status === 409) {
    return true;
  }

  // Check for error message pattern (API returns CAS failures this way)
  if ('error' in error) {
    const errorMsg = (error as { error: unknown }).error;
    if (typeof errorMsg === 'string' && errorMsg.startsWith('CAS failure:')) {
      return true;
    }
  }

  return false;
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Error thrown when CAS retries are exhausted
 */
export class CasRetryExhaustedError extends Error {
  constructor(
    public readonly attempts: number,
    public readonly lastError: CASConflictError
  ) {
    super(
      `CAS update failed after ${attempts} attempts. ` +
        `Expected tip: ${lastError.expectedTip}, actual: ${lastError.actualTip}`
    );
    this.name = 'CasRetryExhaustedError';
    Error.captureStackTrace?.(this, this.constructor);
  }
}

/**
 * Wrap a CAS update operation with automatic retry on conflicts.
 *
 * Use this for additive operations where your update doesn't depend on
 * current state - you just need the tip for CAS validation.
 *
 * @example
 * ```typescript
 * const { data, attempts } = await withCasRetry({
 *   getTip: async () => {
 *     const { data } = await client.api.GET('/entities/{id}/tip', {
 *       params: { path: { id: entityId } }
 *     });
 *     return data!.cid;
 *   },
 *   update: async (tip) => {
 *     return client.api.PUT('/entities/{id}', {
 *       params: { path: { id: entityId } },
 *       body: {
 *         expect_tip: tip,
 *         relationships_add: [{ predicate: 'contains', peer: childId }]
 *       }
 *     });
 *   }
 * }, { concurrency: 100 });
 * ```
 *
 * @param callbacks.getTip - Function to fetch the current tip/CID
 * @param callbacks.update - Function to perform the update with the tip
 * @param options - Retry configuration
 * @returns The successful result with attempt count
 * @throws {CasRetryExhaustedError} When all retries are exhausted
 * @throws {Error} For non-CAS errors (not retried)
 */
export async function withCasRetry<T>(
  callbacks: CasRetryCallbacks<T>,
  options?: CasRetryOptions
): Promise<CasRetryResult<T>> {
  const {
    concurrency = DEFAULT_CAS_RETRY_CONFIG.concurrency,
    maxAttempts: maxAttemptsOverride,
    baseDelayMs = DEFAULT_CAS_RETRY_CONFIG.baseDelayMs,
    maxDelayMs = DEFAULT_CAS_RETRY_CONFIG.maxDelayMs,
    spreadInitial = true,
    onRetry,
  } = options ?? {};

  const maxAttempts = maxAttemptsOverride ?? calculateMaxAttempts(concurrency);

  // Initial spread: random delay before first attempt to reduce initial collisions
  // Range: 0 to (concurrency * 100)ms - e.g., 500 concurrent = 0-50s spread
  // This spreads first attempts over time, dramatically reducing collisions
  if (spreadInitial && concurrency > 1) {
    const initialSpread = Math.floor(Math.random() * concurrency * 100);
    await sleep(initialSpread);
  }

  let lastCasError: CASConflictError | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Get fresh tip before each attempt
    const tip = await callbacks.getTip();

    // Attempt the update
    const { data, error } = await callbacks.update(tip);

    // Success!
    if (!error && data !== undefined) {
      return { data, attempts: attempt };
    }

    // Check if it's a CAS conflict
    if (isCasConflictError(error)) {
      // Parse the error details from various formats
      let expectedTip: string | undefined;
      let actualTip: string | undefined;

      const errorObj = error as Record<string, unknown>;

      // Format 1: { details: { expected, actual } }
      if (errorObj.details && typeof errorObj.details === 'object') {
        const details = errorObj.details as { expected?: string; actual?: string };
        expectedTip = details.expected;
        actualTip = details.actual;
      }

      // Format 2: { error: "CAS failure: expected tip X, got Y" }
      if (!expectedTip && typeof errorObj.error === 'string') {
        const match = errorObj.error.match(/expected tip (\S+), got (\S+)/);
        if (match) {
          expectedTip = match[1];
          actualTip = match[2];
        }
      }

      lastCasError = new CASConflictError(expectedTip, actualTip);

      // If we have more attempts, wait and retry
      if (attempt < maxAttempts) {
        const delay = calculateCasDelay(attempt - 1, baseDelayMs, maxDelayMs);
        onRetry?.(attempt, lastCasError, delay);
        await sleep(delay);
        continue;
      }
    } else {
      // Non-CAS error - throw immediately, don't retry
      throw new Error(
        `Update failed with non-CAS error: ${JSON.stringify(error)}`
      );
    }
  }

  // Exhausted all attempts
  throw new CasRetryExhaustedError(
    maxAttempts,
    lastCasError ?? new CASConflictError()
  );
}
