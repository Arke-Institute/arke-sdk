import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  withCasRetry,
  calculateMaxAttempts,
  calculateCasDelay,
  isCasConflictError,
  CasRetryExhaustedError,
  DEFAULT_CAS_RETRY_CONFIG,
} from '../src/operations/cas.js';
import { CASConflictError } from '../src/client/errors.js';

describe('calculateMaxAttempts', () => {
  it('should return minimum of 5 for low concurrency', () => {
    expect(calculateMaxAttempts(1)).toBe(5);
    expect(calculateMaxAttempts(2)).toBeGreaterThanOrEqual(5);
    expect(calculateMaxAttempts(3)).toBeGreaterThanOrEqual(5);
  });

  it('should scale with concurrency (log + linear)', () => {
    // concurrency 10 → ~14 attempts
    expect(calculateMaxAttempts(10)).toBeGreaterThanOrEqual(12);
    expect(calculateMaxAttempts(10)).toBeLessThanOrEqual(16);

    // concurrency 100 → ~28 attempts
    expect(calculateMaxAttempts(100)).toBeGreaterThanOrEqual(26);
    expect(calculateMaxAttempts(100)).toBeLessThanOrEqual(32);

    // concurrency 500 → ~41 attempts
    expect(calculateMaxAttempts(500)).toBeGreaterThanOrEqual(38);
    expect(calculateMaxAttempts(500)).toBeLessThanOrEqual(45);

    // concurrency 1000 → ~50 attempts
    expect(calculateMaxAttempts(1000)).toBeGreaterThanOrEqual(48);
    expect(calculateMaxAttempts(1000)).toBeLessThanOrEqual(55);
  });

  it('should increase with higher concurrency', () => {
    const attempts10 = calculateMaxAttempts(10);
    const attempts100 = calculateMaxAttempts(100);
    const attempts500 = calculateMaxAttempts(500);
    const attempts1000 = calculateMaxAttempts(1000);

    expect(attempts100).toBeGreaterThan(attempts10);
    expect(attempts500).toBeGreaterThan(attempts100);
    expect(attempts1000).toBeGreaterThan(attempts500);
  });
});

describe('calculateCasDelay', () => {
  it('should apply exponential backoff', () => {
    const baseDelay = 50;
    const maxDelay = 5000;

    // Attempt 0: 50 * 1.5^0 = 50 + jitter (0-50)
    const delay0 = calculateCasDelay(0, baseDelay, maxDelay);
    expect(delay0).toBeGreaterThanOrEqual(50);
    expect(delay0).toBeLessThanOrEqual(100);

    // Attempt 1: 50 * 1.5^1 = 75 + jitter (0-75)
    const delay1 = calculateCasDelay(1, baseDelay, maxDelay);
    expect(delay1).toBeGreaterThanOrEqual(75);
    expect(delay1).toBeLessThanOrEqual(150);

    // Attempt 2: 50 * 1.5^2 = 112.5 + jitter (0-112.5)
    const delay2 = calculateCasDelay(2, baseDelay, maxDelay);
    expect(delay2).toBeGreaterThanOrEqual(112);
    expect(delay2).toBeLessThanOrEqual(225);
  });

  it('should cap at maxDelay', () => {
    const baseDelay = 50;
    const maxDelay = 100;

    // High attempt should be capped
    const delay = calculateCasDelay(20, baseDelay, maxDelay);
    // Capped at 100 + jitter (0-100) = 100-200
    expect(delay).toBeGreaterThanOrEqual(100);
    expect(delay).toBeLessThanOrEqual(200);
  });

  it('should include jitter (not deterministic)', () => {
    const delays = new Set<number>();
    for (let i = 0; i < 20; i++) {
      delays.add(calculateCasDelay(0, 50, 5000));
    }
    // With 0-100% jitter, we should get varied results
    expect(delays.size).toBeGreaterThan(1);
  });
});

describe('isCasConflictError', () => {
  it('should return true for 409 status objects', () => {
    expect(isCasConflictError({ status: 409 })).toBe(true);
    expect(isCasConflictError({ status: 409, error: 'conflict' })).toBe(true);
    expect(isCasConflictError({ status: 409, details: { expected: 'a', actual: 'b' } })).toBe(true);
  });

  it('should return true for CAS failure error messages', () => {
    expect(isCasConflictError({ error: 'CAS failure: expected tip abc, got xyz' })).toBe(true);
    expect(isCasConflictError({ error: 'CAS failure: expected tip bafyxxx, got bafyyyy' })).toBe(true);
  });

  it('should return false for other status codes', () => {
    expect(isCasConflictError({ status: 400 })).toBe(false);
    expect(isCasConflictError({ status: 404 })).toBe(false);
    expect(isCasConflictError({ status: 500 })).toBe(false);
    expect(isCasConflictError({ status: 200 })).toBe(false);
  });

  it('should return false for non-objects', () => {
    expect(isCasConflictError(null)).toBe(false);
    expect(isCasConflictError(undefined)).toBe(false);
    expect(isCasConflictError('error')).toBe(false);
    expect(isCasConflictError(409)).toBe(false);
  });

  it('should return false for objects without CAS indicators', () => {
    expect(isCasConflictError({ error: 'some other error' })).toBe(false);
    expect(isCasConflictError({})).toBe(false);
  });
});

describe('withCasRetry', () => {
  it('should succeed on first attempt without retry', async () => {
    const getTip = vi.fn().mockResolvedValue('cid123');
    const update = vi.fn().mockResolvedValue({ data: { id: 'entity1' } });

    const result = await withCasRetry({ getTip, update });

    expect(result.data).toEqual({ id: 'entity1' });
    expect(result.attempts).toBe(1);
    expect(getTip).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith('cid123');
  });

  it('should retry on CAS conflict and succeed', async () => {
    // Use real timers with minimal delay for this test
    const getTip = vi.fn()
      .mockResolvedValueOnce('cid1')
      .mockResolvedValueOnce('cid2')
      .mockResolvedValueOnce('cid3');

    const update = vi.fn()
      .mockResolvedValueOnce({ error: { status: 409, details: { expected: 'cid1', actual: 'cid2' } } })
      .mockResolvedValueOnce({ error: { status: 409, details: { expected: 'cid2', actual: 'cid3' } } })
      .mockResolvedValueOnce({ data: { id: 'entity1' } });

    // Use very short delays for fast tests
    const result = await withCasRetry(
      { getTip, update },
      { baseDelayMs: 1, maxDelayMs: 5 }
    );

    expect(result.data).toEqual({ id: 'entity1' });
    expect(result.attempts).toBe(3);
    expect(getTip).toHaveBeenCalledTimes(3);
    expect(update).toHaveBeenCalledTimes(3);
    expect(update).toHaveBeenNthCalledWith(1, 'cid1');
    expect(update).toHaveBeenNthCalledWith(2, 'cid2');
    expect(update).toHaveBeenNthCalledWith(3, 'cid3');
  });

  it('should retry on CAS failure message format', async () => {
    // Test the "CAS failure: expected tip X, got Y" format from the API
    const getTip = vi.fn()
      .mockResolvedValueOnce('cid1')
      .mockResolvedValueOnce('cid2');

    const update = vi.fn()
      .mockResolvedValueOnce({ error: { error: 'CAS failure: expected tip cid1, got cid2' } })
      .mockResolvedValueOnce({ data: { id: 'entity1' } });

    // Use very short delays for fast tests
    const result = await withCasRetry(
      { getTip, update },
      { baseDelayMs: 1, maxDelayMs: 5 }
    );

    expect(result.data).toEqual({ id: 'entity1' });
    expect(result.attempts).toBe(2);
    expect(getTip).toHaveBeenCalledTimes(2);
    expect(update).toHaveBeenCalledTimes(2);
    expect(update).toHaveBeenNthCalledWith(1, 'cid1');
    expect(update).toHaveBeenNthCalledWith(2, 'cid2');
  });

  it('should throw CasRetryExhaustedError when all attempts fail', async () => {
    const getTip = vi.fn().mockResolvedValue('cid1');
    const update = vi.fn().mockResolvedValue({
      error: { status: 409, details: { expected: 'cid1', actual: 'cid2' } }
    });

    try {
      await withCasRetry(
        { getTip, update },
        { maxAttempts: 3, baseDelayMs: 1, maxDelayMs: 5 }
      );
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(CasRetryExhaustedError);
      expect((error as CasRetryExhaustedError).attempts).toBe(3);
      expect((error as CasRetryExhaustedError).lastError).toBeInstanceOf(CASConflictError);
    }

    expect(getTip).toHaveBeenCalledTimes(3);
    expect(update).toHaveBeenCalledTimes(3);
  });

  it('should respect maxAttempts option', async () => {
    const getTip = vi.fn().mockResolvedValue('cid1');
    const update = vi.fn().mockResolvedValue({ error: { status: 409 } });

    try {
      await withCasRetry(
        { getTip, update },
        { maxAttempts: 5, baseDelayMs: 1, maxDelayMs: 5 }
      );
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(CasRetryExhaustedError);
    }

    expect(update).toHaveBeenCalledTimes(5);
  });

  it('should calculate maxAttempts from concurrency when not specified', async () => {
    const getTip = vi.fn().mockResolvedValue('cid1');
    const update = vi.fn().mockResolvedValue({ error: { status: 409 } });

    // concurrency 100 should give ~20 attempts
    try {
      await withCasRetry(
        { getTip, update },
        { concurrency: 100, baseDelayMs: 1, maxDelayMs: 2 }
      );
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(CasRetryExhaustedError);
    }

    const expectedAttempts = calculateMaxAttempts(100);
    expect(update).toHaveBeenCalledTimes(expectedAttempts);
  });

  it('should call onRetry callback before each retry', async () => {
    const getTip = vi.fn().mockResolvedValue('cid1');
    const update = vi.fn()
      .mockResolvedValueOnce({ error: { status: 409, details: { expected: 'cid1', actual: 'cid2' } } })
      .mockResolvedValueOnce({ error: { status: 409, details: { expected: 'cid1', actual: 'cid3' } } })
      .mockResolvedValueOnce({ data: { id: 'entity1' } });

    const onRetry = vi.fn();

    await withCasRetry(
      { getTip, update },
      { baseDelayMs: 1, maxDelayMs: 5, onRetry }
    );

    // Should be called twice (before retry 2 and 3)
    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenNthCalledWith(
      1,
      1, // attempt number
      expect.any(CASConflictError),
      expect.any(Number) // delay
    );
    expect(onRetry).toHaveBeenNthCalledWith(
      2,
      2,
      expect.any(CASConflictError),
      expect.any(Number)
    );
  });

  it('should throw immediately on non-CAS errors (not retry)', async () => {
    const getTip = vi.fn().mockResolvedValue('cid1');
    const update = vi.fn().mockResolvedValue({
      error: { status: 400, message: 'Bad request' }
    });

    try {
      await withCasRetry({ getTip, update });
      expect.fail('Should have thrown');
    } catch (error) {
      expect((error as Error).message).toContain('non-CAS error');
    }

    expect(update).toHaveBeenCalledTimes(1); // No retry
  });

  it('should throw immediately on 404 errors', async () => {
    const getTip = vi.fn().mockResolvedValue('cid1');
    const update = vi.fn().mockResolvedValue({
      error: { status: 404, message: 'Not found' }
    });

    try {
      await withCasRetry({ getTip, update });
      expect.fail('Should have thrown');
    } catch (error) {
      expect((error as Error).message).toContain('non-CAS error');
    }

    expect(update).toHaveBeenCalledTimes(1);
  });

  it('should throw immediately on 500 errors', async () => {
    const getTip = vi.fn().mockResolvedValue('cid1');
    const update = vi.fn().mockResolvedValue({
      error: { status: 500, message: 'Server error' }
    });

    try {
      await withCasRetry({ getTip, update });
      expect.fail('Should have thrown');
    } catch (error) {
      expect((error as Error).message).toContain('non-CAS error');
    }

    expect(update).toHaveBeenCalledTimes(1);
  });

  it('should use default config values', () => {
    expect(DEFAULT_CAS_RETRY_CONFIG.concurrency).toBe(10);
    expect(DEFAULT_CAS_RETRY_CONFIG.baseDelayMs).toBe(50);
    expect(DEFAULT_CAS_RETRY_CONFIG.maxDelayMs).toBe(10000);
  });

  it('should handle getTip errors by propagating them', async () => {
    const getTip = vi.fn().mockRejectedValue(new Error('Network error'));
    const update = vi.fn();

    try {
      await withCasRetry({ getTip, update });
      expect.fail('Should have thrown');
    } catch (error) {
      expect((error as Error).message).toBe('Network error');
    }

    expect(update).not.toHaveBeenCalled();
  });

  it('should handle update throwing by propagating the error', async () => {
    const getTip = vi.fn().mockResolvedValue('cid1');
    const update = vi.fn().mockRejectedValue(new Error('Network error'));

    try {
      await withCasRetry({ getTip, update });
      expect.fail('Should have thrown');
    } catch (error) {
      expect((error as Error).message).toBe('Network error');
    }
  });
});

describe('CasRetryExhaustedError', () => {
  it('should contain attempts and lastError', () => {
    const casError = new CASConflictError('expected-cid', 'actual-cid');
    const error = new CasRetryExhaustedError(5, casError);

    expect(error.attempts).toBe(5);
    expect(error.lastError).toBe(casError);
    expect(error.message).toContain('5 attempts');
    expect(error.message).toContain('expected-cid');
    expect(error.message).toContain('actual-cid');
    expect(error.name).toBe('CasRetryExhaustedError');
  });
});
