import { describe, it, expect } from 'vitest';
import {
  ArkeClient,
  createArkeClient,
  ArkeError,
  CASConflictError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  parseApiError,
  DEFAULT_CONFIG,
} from '../src/index.js';

describe('ArkeClient', () => {
  it('creates a client with default config', () => {
    const client = new ArkeClient();
    expect(client.baseUrl).toBe(DEFAULT_CONFIG.baseUrl);
    expect(client.isAuthenticated).toBe(false);
  });

  it('creates a client with custom config', () => {
    const client = new ArkeClient({
      baseUrl: 'https://custom.api.example.com',
      authToken: 'test-token',
      network: 'test',
    });
    expect(client.baseUrl).toBe('https://custom.api.example.com');
    expect(client.isAuthenticated).toBe(true);
  });

  it('can set and clear auth token', () => {
    const client = new ArkeClient();
    expect(client.isAuthenticated).toBe(false);

    client.setAuthToken('new-token');
    expect(client.isAuthenticated).toBe(true);

    client.clearAuthToken();
    expect(client.isAuthenticated).toBe(false);
  });

  it('exposes api property for making requests', () => {
    const client = new ArkeClient();
    expect(client.api).toBeDefined();
    expect(typeof client.api.GET).toBe('function');
    expect(typeof client.api.POST).toBe('function');
    expect(typeof client.api.PUT).toBe('function');
    expect(typeof client.api.DELETE).toBe('function');
  });

  it('returns config as readonly copy', () => {
    const client = new ArkeClient({ authToken: 'secret' });
    const config = client.getConfig();
    expect(config.authToken).toBe('secret');
    // Modifying returned config shouldn't affect client
    (config as { authToken?: string }).authToken = 'modified';
    expect(client.getConfig().authToken).toBe('secret');
  });
});

describe('createArkeClient', () => {
  it('creates a client instance', () => {
    const client = createArkeClient();
    expect(client).toBeInstanceOf(ArkeClient);
  });

  it('passes config to client', () => {
    const client = createArkeClient({ authToken: 'my-token' });
    expect(client.isAuthenticated).toBe(true);
  });
});

describe('Error classes', () => {
  describe('ArkeError', () => {
    it('creates error with all properties', () => {
      const error = new ArkeError('Test error', 'TEST_CODE', 500, { extra: 'data' });
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.status).toBe(500);
      expect(error.details).toEqual({ extra: 'data' });
      expect(error.name).toBe('ArkeError');
    });

    it('serializes to JSON', () => {
      const error = new ArkeError('Test', 'CODE', 400);
      const json = error.toJSON();
      expect(json).toEqual({
        name: 'ArkeError',
        message: 'Test',
        code: 'CODE',
        status: 400,
        details: undefined,
      });
    });
  });

  describe('CASConflictError', () => {
    it('creates with tip information', () => {
      const error = new CASConflictError('expected-cid', 'actual-cid');
      expect(error.name).toBe('CASConflictError');
      expect(error.code).toBe('CAS_CONFLICT');
      expect(error.status).toBe(409);
      expect(error.expectedTip).toBe('expected-cid');
      expect(error.actualTip).toBe('actual-cid');
    });
  });

  describe('NotFoundError', () => {
    it('creates with resource info', () => {
      const error = new NotFoundError('Entity', '01ABC123');
      expect(error.name).toBe('NotFoundError');
      expect(error.message).toBe('Entity not found: 01ABC123');
      expect(error.status).toBe(404);
    });
  });

  describe('ValidationError', () => {
    it('creates with field info', () => {
      const error = new ValidationError('Invalid email', 'email');
      expect(error.name).toBe('ValidationError');
      expect(error.field).toBe('email');
      expect(error.status).toBe(400);
    });
  });

  describe('AuthenticationError', () => {
    it('creates with default message', () => {
      const error = new AuthenticationError();
      expect(error.message).toBe('Authentication required');
      expect(error.status).toBe(401);
    });

    it('creates with custom message', () => {
      const error = new AuthenticationError('Token expired');
      expect(error.message).toBe('Token expired');
    });
  });

  describe('ForbiddenError', () => {
    it('creates with action and resource', () => {
      const error = new ForbiddenError('entity:delete', '01ABC123');
      expect(error.message).toBe('Permission denied: entity:delete on 01ABC123');
      expect(error.status).toBe(403);
    });

    it('creates with just action', () => {
      const error = new ForbiddenError('collection:manage');
      expect(error.message).toBe('Permission denied: collection:manage');
    });

    it('creates with no arguments', () => {
      const error = new ForbiddenError();
      expect(error.message).toBe('Permission denied');
    });
  });
});

describe('parseApiError', () => {
  it('parses 400 as ValidationError', () => {
    const error = parseApiError(400, { error: 'Invalid input' });
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe('Invalid input');
  });

  it('parses 401 as AuthenticationError', () => {
    const error = parseApiError(401, { error: 'Token invalid' });
    expect(error).toBeInstanceOf(AuthenticationError);
  });

  it('parses 403 as ForbiddenError', () => {
    const error = parseApiError(403, { error: 'Access denied' });
    expect(error).toBeInstanceOf(ForbiddenError);
  });

  it('parses 404 as NotFoundError', () => {
    const error = parseApiError(404, {});
    expect(error).toBeInstanceOf(NotFoundError);
  });

  it('parses 409 as CASConflictError', () => {
    const error = parseApiError(409, {
      error: 'Conflict',
      details: { expected: 'cid1', actual: 'cid2' },
    });
    expect(error).toBeInstanceOf(CASConflictError);
    expect((error as CASConflictError).expectedTip).toBe('cid1');
    expect((error as CASConflictError).actualTip).toBe('cid2');
  });

  it('parses unknown status as ArkeError', () => {
    const error = parseApiError(500, { error: 'Server error' });
    expect(error).toBeInstanceOf(ArkeError);
    expect(error.status).toBe(500);
  });

  it('handles null body', () => {
    const error = parseApiError(500, null);
    expect(error.message).toBe('Unknown error');
  });
});
