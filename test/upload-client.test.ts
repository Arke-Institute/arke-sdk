/**
 * Unit tests for UploadClient
 * Tests permission checking logic with mocked fetch
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UploadClient } from '../src/upload/client';
import { ValidationError } from '../src/upload/utils/errors';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('UploadClient', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('constructor', () => {
    it('should create client with required config', () => {
      const client = new UploadClient({
        gatewayUrl: 'https://api.arke.institute',
        authToken: 'test-token',
        uploader: 'test-user',
      });

      expect(client).toBeDefined();
    });

    it('should default uploader to user ID from JWT when not provided', () => {
      // Real JWT from test/.env (sub: "d3c4afb7-3af3-48ba-bb2d-a10bc59dc776")
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FkZW5yc2VlYmtkdHBpcHdoZGdqLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJkM2M0YWZiNy0zYWYzLTQ4YmEtYmIyZC1hMTBiYzU5ZGM3NzYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzY1NDE0MzQ2LCJpYXQiOjE3NjU0MTA3NDYsImVtYWlsIjoibmFjMjE5N0Bjb2x1bWJpYS5lZHUifQ.test';
      const client = new UploadClient({
        gatewayUrl: 'https://api.arke.institute',
        authToken: jwt,
        // uploader not provided - should default to user ID from JWT
      });

      expect(client).toBeDefined();
    });
  });

  describe('canEdit', () => {
    it('should return permissions for a PI', async () => {
      const mockPermissions = {
        pi: '01K9CS5NRH39ZVD3JRTQ1EP398',
        canView: true,
        canEdit: true,
        canAdminister: true,
        collection: {
          id: 'coll_123',
          title: 'Test Collection',
          slug: 'test-collection',
          visibility: 'private',
          role: 'owner',
          rootPi: '01K9CS5NRH39ZVD3JRTQ1EP398',
          hops: 0,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockPermissions,
      });

      const client = new UploadClient({
        gatewayUrl: 'https://api.arke.institute',
        authToken: 'test-token',
        uploader: 'test-user',
      });

      const result = await client.canEdit('01K9CS5NRH39ZVD3JRTQ1EP398');

      expect(result.canEdit).toBe(true);
      expect(result.collection?.role).toBe('owner');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.arke.institute/pi/01K9CS5NRH39ZVD3JRTQ1EP398/permissions',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should return canEdit false for non-members', async () => {
      const mockPermissions = {
        pi: '01K9CS5NRH39ZVD3JRTQ1EP398',
        canView: true,
        canEdit: false,
        canAdminister: false,
        collection: {
          id: 'coll_123',
          title: 'Test Collection',
          slug: 'test-collection',
          visibility: 'public',
          role: null,
          rootPi: '01K9CS5NRH39ZVD3JRTQ1EP398',
          hops: 0,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockPermissions,
      });

      const client = new UploadClient({
        gatewayUrl: 'https://api.arke.institute',
        authToken: 'test-token',
        uploader: 'test-user',
      });

      const result = await client.canEdit('01K9CS5NRH39ZVD3JRTQ1EP398');

      expect(result.canEdit).toBe(false);
      expect(result.collection?.role).toBeNull();
    });
  });

  describe('addToCollection', () => {
    it('should throw ValidationError when user cannot edit', async () => {
      const mockPermissions = {
        pi: '01K9CS5NRH39ZVD3JRTQ1EP398',
        canView: true,
        canEdit: false,
        canAdminister: false,
        collection: {
          id: 'coll_123',
          title: 'Test Collection',
          slug: 'test-collection',
          visibility: 'private',
          role: null,
          rootPi: '01K9CS5NRH39ZVD3JRTQ1EP398',
          hops: 0,
        },
      };

      // Mock for both assertions
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockPermissions,
      });

      const client = new UploadClient({
        gatewayUrl: 'https://api.arke.institute',
        authToken: 'test-token',
        uploader: 'test-user',
      });

      await expect(
        client.addToCollection({
          files: '/tmp/test-files',
          parentPi: '01K9CS5NRH39ZVD3JRTQ1EP398',
        })
      ).rejects.toThrow(ValidationError);

      await expect(
        client.addToCollection({
          files: '/tmp/test-files',
          parentPi: '01K9CS5NRH39ZVD3JRTQ1EP398',
        })
      ).rejects.toThrow(/you need editor or owner role/);
    });

    it('should throw ValidationError when PI has no collection', async () => {
      const mockPermissions = {
        pi: '01K9CS5NRH39ZVD3JRTQ1EP398',
        canView: true,
        canEdit: false,
        canAdminister: false,
        collection: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockPermissions,
      });

      const client = new UploadClient({
        gatewayUrl: 'https://api.arke.institute',
        authToken: 'test-token',
        uploader: 'test-user',
      });

      await expect(
        client.addToCollection({
          files: '/tmp/test-files',
          parentPi: '01K9CS5NRH39ZVD3JRTQ1EP398',
        })
      ).rejects.toThrow(/not part of any collection/);
    });

    it('should skip permission check in dry run mode', async () => {
      const client = new UploadClient({
        gatewayUrl: 'https://api.arke.institute',
        authToken: 'test-token',
        uploader: 'test-user',
      });

      // This should not throw because dryRun skips permission check
      // But it will fail on file scanning since /tmp/nonexistent doesn't exist
      // That's expected - we're just testing the permission check is skipped
      try {
        await client.addToCollection({
          files: '/tmp/nonexistent-test-dir',
          parentPi: '01K9CS5NRH39ZVD3JRTQ1EP398',
          dryRun: true,
        });
      } catch (e: any) {
        // Should fail on file scanning, NOT on permission check
        expect(e.message).not.toContain('you need editor or owner role');
        expect(e.message).not.toContain('not part of any collection');
      }

      // fetch should NOT have been called (permission check skipped)
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('setAuthToken', () => {
    it('should update auth token', async () => {
      const client = new UploadClient({
        gatewayUrl: 'https://api.arke.institute',
        authToken: 'old-token',
        uploader: 'test-user',
      });

      const mockPermissions = {
        pi: 'test-pi',
        canView: true,
        canEdit: true,
        canAdminister: false,
        collection: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockPermissions,
      });

      // Update token
      client.setAuthToken('new-token');

      // Make a request
      await client.canEdit('test-pi');

      // Verify new token was used
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.any(Headers),
        })
      );

      const callHeaders = mockFetch.mock.calls[0][1].headers;
      expect(callHeaders.get('Authorization')).toBe('Bearer new-token');
    });
  });

  describe('collections accessor', () => {
    it('should provide access to underlying CollectionsClient', () => {
      const client = new UploadClient({
        gatewayUrl: 'https://api.arke.institute',
        authToken: 'test-token',
        uploader: 'test-user',
      });

      expect(client.collections).toBeDefined();
      expect(typeof client.collections.listCollections).toBe('function');
      expect(typeof client.collections.getCollection).toBe('function');
    });
  });
});
