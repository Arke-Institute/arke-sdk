import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createRetryFetch,
  isRetryableStatus,
  isNetworkError,
  isCloudflareErrorResponse,
  calculateDelay,
  DEFAULT_RETRY_CONFIG,
} from '../src/client/retry.js';

describe('isRetryableStatus', () => {
  it('should return true for 5xx server errors', () => {
    expect(isRetryableStatus(500)).toBe(true);
    expect(isRetryableStatus(502)).toBe(true);
    expect(isRetryableStatus(503)).toBe(true);
    expect(isRetryableStatus(504)).toBe(true);
  });

  it('should return true for Cloudflare error codes', () => {
    expect(isRetryableStatus(520)).toBe(true);
    expect(isRetryableStatus(521)).toBe(true);
    expect(isRetryableStatus(522)).toBe(true);
    expect(isRetryableStatus(523)).toBe(true);
    expect(isRetryableStatus(524)).toBe(true);
    expect(isRetryableStatus(530)).toBe(true);
  });

  it('should return false for 4xx client errors', () => {
    expect(isRetryableStatus(400)).toBe(false);
    expect(isRetryableStatus(401)).toBe(false);
    expect(isRetryableStatus(403)).toBe(false);
    expect(isRetryableStatus(404)).toBe(false);
    expect(isRetryableStatus(409)).toBe(false); // CAS conflict
    expect(isRetryableStatus(422)).toBe(false);
  });

  it('should return false for success codes', () => {
    expect(isRetryableStatus(200)).toBe(false);
    expect(isRetryableStatus(201)).toBe(false);
    expect(isRetryableStatus(204)).toBe(false);
  });
});

describe('isNetworkError', () => {
  it('should return true for fetch failure TypeErrors', () => {
    expect(isNetworkError(new TypeError('Failed to fetch'))).toBe(true);
    expect(isNetworkError(new TypeError('fetch failed'))).toBe(true);
    expect(isNetworkError(new TypeError('Network request failed'))).toBe(true);
  });

  it('should return true for connection errors', () => {
    expect(isNetworkError(new TypeError('ECONNREFUSED'))).toBe(true);
    expect(isNetworkError(new TypeError('ECONNRESET'))).toBe(true);
    expect(isNetworkError(new TypeError('ETIMEDOUT'))).toBe(true);
    expect(isNetworkError(new TypeError('ENOTFOUND'))).toBe(true);
  });

  it('should return true for DNS errors', () => {
    expect(isNetworkError(new TypeError('DNS lookup failed'))).toBe(true);
  });

  it('should return false for non-network errors', () => {
    expect(isNetworkError(new Error('Some other error'))).toBe(false);
    expect(isNetworkError(new TypeError('Cannot read property'))).toBe(false);
    expect(isNetworkError('string error')).toBe(false);
    expect(isNetworkError(null)).toBe(false);
  });

  it('should return true for AbortError', () => {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    expect(isNetworkError(abortError)).toBe(true);
  });
});

describe('isCloudflareErrorResponse', () => {
  it('should return true for HTML error responses', () => {
    const response = new Response('<html>Error</html>', {
      status: 502,
      headers: { 'Content-Type': 'text/html' },
    });
    expect(isCloudflareErrorResponse(response)).toBe(true);
  });

  it('should return false for JSON error responses', () => {
    const response = new Response('{"error": "bad request"}', {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(isCloudflareErrorResponse(response)).toBe(false);
  });

  it('should return false for successful HTML responses', () => {
    const response = new Response('<html>OK</html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
    expect(isCloudflareErrorResponse(response)).toBe(false);
  });
});

describe('calculateDelay', () => {
  it('should calculate exponential backoff', () => {
    // With no jitter consideration, base delay should grow exponentially
    const delay0 = calculateDelay(0, 100, 5000);
    const delay1 = calculateDelay(1, 100, 5000);
    const delay2 = calculateDelay(2, 100, 5000);

    // delay0 should be 100 + jitter (0-100), so 100-200
    expect(delay0).toBeGreaterThanOrEqual(100);
    expect(delay0).toBeLessThanOrEqual(200);

    // delay1 should be 200 + jitter (0-200), so 200-400
    expect(delay1).toBeGreaterThanOrEqual(200);
    expect(delay1).toBeLessThanOrEqual(400);

    // delay2 should be 400 + jitter (0-400), so 400-800
    expect(delay2).toBeGreaterThanOrEqual(400);
    expect(delay2).toBeLessThanOrEqual(800);
  });

  it('should cap at maxDelay', () => {
    const delay = calculateDelay(10, 100, 1000);
    // Max is 1000 + jitter (0-1000), so 1000-2000
    expect(delay).toBeGreaterThanOrEqual(1000);
    expect(delay).toBeLessThanOrEqual(2000);
  });
});

describe('createRetryFetch', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return response immediately on success', async () => {
    const successResponse = new Response('{"ok": true}', { status: 200 });
    mockFetch.mockResolvedValueOnce(successResponse);

    const retryFetch = createRetryFetch({ maxRetries: 3 });
    const response = await retryFetch('https://api.example.com/test');

    expect(response).toBe(successResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on 5xx errors and succeed', async () => {
    const errorResponse = new Response('Server Error', { status: 503 });
    const successResponse = new Response('{"ok": true}', { status: 200 });

    mockFetch
      .mockResolvedValueOnce(errorResponse)
      .mockResolvedValueOnce(successResponse);

    const retryFetch = createRetryFetch({
      maxRetries: 3,
      initialDelay: 10, // Short delay for testing
    });
    const response = await retryFetch('https://api.example.com/test');

    expect(response).toBe(successResponse);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should NOT retry on 409 CAS conflict', async () => {
    const conflictResponse = new Response('{"error": "CAS conflict"}', {
      status: 409,
    });
    mockFetch.mockResolvedValueOnce(conflictResponse);

    const retryFetch = createRetryFetch({ maxRetries: 3 });
    const response = await retryFetch('https://api.example.com/test');

    expect(response.status).toBe(409);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should NOT retry on 400 bad request', async () => {
    const badRequestResponse = new Response('{"error": "Bad request"}', {
      status: 400,
    });
    mockFetch.mockResolvedValueOnce(badRequestResponse);

    const retryFetch = createRetryFetch({ maxRetries: 3 });
    const response = await retryFetch('https://api.example.com/test');

    expect(response.status).toBe(400);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should NOT retry on 401 unauthorized', async () => {
    const unauthorizedResponse = new Response('{"error": "Unauthorized"}', {
      status: 401,
    });
    mockFetch.mockResolvedValueOnce(unauthorizedResponse);

    const retryFetch = createRetryFetch({ maxRetries: 3 });
    const response = await retryFetch('https://api.example.com/test');

    expect(response.status).toBe(401);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should NOT retry on 404 not found', async () => {
    const notFoundResponse = new Response('{"error": "Not found"}', {
      status: 404,
    });
    mockFetch.mockResolvedValueOnce(notFoundResponse);

    const retryFetch = createRetryFetch({ maxRetries: 3 });
    const response = await retryFetch('https://api.example.com/test');

    expect(response.status).toBe(404);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on network errors', async () => {
    const successResponse = new Response('{"ok": true}', { status: 200 });

    mockFetch
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(successResponse);

    const retryFetch = createRetryFetch({
      maxRetries: 3,
      initialDelay: 10,
    });
    const response = await retryFetch('https://api.example.com/test');

    expect(response).toBe(successResponse);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should throw after exhausting all retries', async () => {
    const errorResponse = new Response('Server Error', { status: 503 });
    mockFetch.mockResolvedValue(errorResponse);

    const retryFetch = createRetryFetch({
      maxRetries: 2,
      initialDelay: 10,
    });

    // Should return the error response after retries exhausted
    const response = await retryFetch('https://api.example.com/test');
    expect(response.status).toBe(503);
    expect(mockFetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });

  it('should call onRetry callback', async () => {
    const errorResponse = new Response('Server Error', { status: 503 });
    const successResponse = new Response('{"ok": true}', { status: 200 });

    mockFetch
      .mockResolvedValueOnce(errorResponse)
      .mockResolvedValueOnce(successResponse);

    const onRetry = vi.fn();
    const retryFetch = createRetryFetch({
      maxRetries: 3,
      initialDelay: 10,
      onRetry,
    });

    await retryFetch('https://api.example.com/test');

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(
      1, // attempt number
      expect.any(Error), // error
      expect.any(Number) // delay
    );
  });

  it('should respect retryOn5xx: false', async () => {
    const errorResponse = new Response('Server Error', { status: 503 });
    mockFetch.mockResolvedValueOnce(errorResponse);

    const retryFetch = createRetryFetch({
      maxRetries: 3,
      retryOn5xx: false,
    });
    const response = await retryFetch('https://api.example.com/test');

    expect(response.status).toBe(503);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should respect retryOnNetworkError: false', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const retryFetch = createRetryFetch({
      maxRetries: 3,
      retryOnNetworkError: false,
    });

    await expect(retryFetch('https://api.example.com/test')).rejects.toThrow(
      'Failed to fetch'
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on Cloudflare HTML error pages', async () => {
    const cloudflareError = new Response(
      '<html><body>502 Bad Gateway</body></html>',
      {
        status: 502,
        headers: { 'Content-Type': 'text/html' },
      }
    );
    const successResponse = new Response('{"ok": true}', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    mockFetch
      .mockResolvedValueOnce(cloudflareError)
      .mockResolvedValueOnce(successResponse);

    const retryFetch = createRetryFetch({
      maxRetries: 3,
      initialDelay: 10,
    });
    const response = await retryFetch('https://api.example.com/test');

    expect(response).toBe(successResponse);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should clone Request objects to allow retries', async () => {
    const errorResponse = new Response('Server Error', { status: 503 });
    const successResponse = new Response('{"ok": true}', { status: 200 });

    mockFetch
      .mockResolvedValueOnce(errorResponse)
      .mockResolvedValueOnce(successResponse);

    const retryFetch = createRetryFetch({
      maxRetries: 3,
      initialDelay: 10,
    });

    // Use a Request object as input (like openapi-fetch does)
    const request = new Request('https://api.example.com/test', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await retryFetch(request);

    expect(response).toBe(successResponse);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    // Verify fetch was called with cloned requests (not the original)
    const firstCallArg = mockFetch.mock.calls[0][0];
    const secondCallArg = mockFetch.mock.calls[1][0];
    expect(firstCallArg).toBeInstanceOf(Request);
    expect(secondCallArg).toBeInstanceOf(Request);
    // They should be different Request instances (clones)
    expect(firstCallArg).not.toBe(request);
    expect(secondCallArg).not.toBe(request);
  });
});

describe('DEFAULT_RETRY_CONFIG', () => {
  it('should have sensible defaults', () => {
    expect(DEFAULT_RETRY_CONFIG.maxRetries).toBe(3);
    expect(DEFAULT_RETRY_CONFIG.initialDelay).toBe(100);
    expect(DEFAULT_RETRY_CONFIG.maxDelay).toBe(5000);
    expect(DEFAULT_RETRY_CONFIG.retryOn5xx).toBe(true);
    expect(DEFAULT_RETRY_CONFIG.retryOnNetworkError).toBe(true);
  });
});
