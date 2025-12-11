import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CollectionsClient, CollectionsError } from '../src/collections/index';

describe('CollectionsClient', () => {
  let client: CollectionsClient;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    client = new CollectionsClient({
      gatewayUrl: 'https://gateway.arke.institute',
      authToken: 'test-token',
      fetchImpl: mockFetch,
    });
  });

  describe('constructor', () => {
    it('should create client with gatewayUrl', () => {
      const c = new CollectionsClient({ gatewayUrl: 'https://example.com' });
      expect(c).toBeInstanceOf(CollectionsClient);
    });

    it('should strip trailing slash from gatewayUrl', () => {
      const c = new CollectionsClient({
        gatewayUrl: 'https://example.com/',
        fetchImpl: mockFetch,
      });
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ collections: [], pagination: { total: 0, limit: 20, offset: 0 } }),
      });
      c.listCollections();
      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/collections',
        expect.any(Object)
      );
    });
  });

  describe('setAuthToken', () => {
    it('should update auth token', () => {
      client.setAuthToken('new-token');
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ owned: [], editing: [] }),
      });
      client.getMyCollections();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.any(Headers),
        })
      );
    });
  });

  describe('listCollections', () => {
    it('should fetch collections without auth', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          collections: [
            { id: '1', title: 'Test Collection', slug: 'test' },
          ],
          pagination: { total: 1, limit: 20, offset: 0 },
        }),
      });

      const result = await client.listCollections();
      expect(result.collections).toHaveLength(1);
      expect(result.collections[0].title).toBe('Test Collection');
    });

    it('should support pagination params', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          collections: [],
          pagination: { total: 0, limit: 10, offset: 5 },
        }),
      });

      await client.listCollections({ limit: 10, offset: 5 });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://gateway.arke.institute/collections?limit=10&offset=5',
        expect.any(Object)
      );
    });
  });

  describe('getCollection', () => {
    it('should fetch collection by id', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          id: 'coll-123',
          title: 'My Collection',
          slug: 'my-collection',
          visibility: 'public',
        }),
      });

      const result = await client.getCollection('coll-123');
      expect(result.id).toBe('coll-123');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://gateway.arke.institute/collections/coll-123',
        expect.any(Object)
      );
    });
  });

  describe('getCollectionRoot', () => {
    it('should fetch collection root PI', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          rootPi: 'pi:abc123',
        }),
      });

      const result = await client.getCollectionRoot('coll-123');
      expect(result.rootPi).toBe('pi:abc123');
    });
  });

  describe('createCollection', () => {
    it('should create collection with auth', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          id: 'new-coll',
          title: 'New Collection',
          slug: 'new-collection',
          visibility: 'private',
        }),
      });

      const result = await client.createCollection({
        title: 'New Collection',
        slug: 'new-collection',
        visibility: 'private',
      });

      expect(result.id).toBe('new-coll');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://gateway.arke.institute/collections',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            title: 'New Collection',
            slug: 'new-collection',
            visibility: 'private',
          }),
        })
      );
    });

    it('should throw AUTH_REQUIRED without token', async () => {
      const noAuthClient = new CollectionsClient({
        gatewayUrl: 'https://gateway.arke.institute',
        fetchImpl: mockFetch,
      });

      await expect(
        noAuthClient.createCollection({ title: 'Test', slug: 'test' })
      ).rejects.toThrow('Authentication required');
    });
  });

  describe('registerRoot', () => {
    it('should register root PI for collection', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          id: 'coll-123',
          title: 'My Collection',
          rootPi: 'pi:root123',
        }),
      });

      const result = await client.registerRoot({
        title: 'My Collection',
        slug: 'my-collection',
        rootPi: 'pi:root123',
      });

      expect(result.rootPi).toBe('pi:root123');
    });
  });

  describe('updateCollection', () => {
    it('should update collection', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          id: 'coll-123',
          title: 'Updated Title',
          slug: 'my-collection',
        }),
      });

      const result = await client.updateCollection('coll-123', {
        title: 'Updated Title',
      });

      expect(result.title).toBe('Updated Title');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://gateway.arke.institute/collections/coll-123',
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });
  });

  describe('deleteCollection', () => {
    it('should delete collection', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ success: true }),
      });

      const result = await client.deleteCollection('coll-123');
      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://gateway.arke.institute/collections/coll-123',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('listMembers', () => {
    it('should list collection members', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          members: [
            { user_id: 'user-1', role: 'owner', email: 'owner@example.com' },
            { user_id: 'user-2', role: 'editor', email: 'editor@example.com' },
          ],
        }),
      });

      const result = await client.listMembers('coll-123');
      expect(result.members).toHaveLength(2);
      expect(result.members[0].role).toBe('owner');
    });
  });

  describe('updateMemberRole', () => {
    it('should update member role', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ success: true, role: 'editor' }),
      });

      const result = await client.updateMemberRole('coll-123', 'user-1', 'editor');
      expect(result.role).toBe('editor');
    });
  });

  describe('removeMember', () => {
    it('should remove member from collection', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ success: true }),
      });

      const result = await client.removeMember('coll-123', 'user-1');
      expect(result.success).toBe(true);
    });
  });

  describe('createInvitation', () => {
    it('should create invitation', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          id: 'inv-123',
          collection_id: 'coll-123',
          email: 'invitee@example.com',
          role: 'editor',
          status: 'pending',
        }),
      });

      const result = await client.createInvitation('coll-123', 'invitee@example.com', 'editor');
      expect(result.id).toBe('inv-123');
      expect(result.role).toBe('editor');
    });
  });

  describe('listInvitations', () => {
    it('should list collection invitations', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          invitations: [
            { id: 'inv-1', email: 'user1@example.com', role: 'editor', status: 'pending' },
          ],
        }),
      });

      const result = await client.listInvitations('coll-123');
      expect(result.invitations).toHaveLength(1);
    });
  });

  describe('acceptInvitation', () => {
    it('should accept invitation', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ success: true, role: 'editor' }),
      });

      const result = await client.acceptInvitation('inv-123');
      expect(result.success).toBe(true);
      expect(result.role).toBe('editor');
    });
  });

  describe('declineInvitation', () => {
    it('should decline invitation', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ success: true }),
      });

      const result = await client.declineInvitation('inv-123');
      expect(result.success).toBe(true);
    });
  });

  describe('revokeInvitation', () => {
    it('should revoke invitation', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ success: true }),
      });

      const result = await client.revokeInvitation('inv-123');
      expect(result.success).toBe(true);
    });
  });

  describe('getMyCollections', () => {
    it('should fetch user collections', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          owned: [{ id: 'coll-1', title: 'My Collection' }],
          editing: [{ id: 'coll-2', title: 'Shared Collection' }],
        }),
      });

      const result = await client.getMyCollections();
      expect(result.owned).toHaveLength(1);
      expect(result.editing).toHaveLength(1);
    });
  });

  describe('getMyInvitations', () => {
    it('should fetch user invitations', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          invitations: [
            { id: 'inv-1', collection_id: 'coll-1', role: 'editor', status: 'pending' },
          ],
        }),
      });

      const result = await client.getMyInvitations();
      expect(result.invitations).toHaveLength(1);
    });
  });

  describe('getPiPermissions', () => {
    it('should fetch PI permissions', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          pi: 'pi:abc123',
          canView: true,
          canEdit: true,
          canAdminister: false,
          collection: {
            id: 'coll-123',
            title: 'Test Collection',
            role: 'editor',
          },
        }),
      });

      const result = await client.getPiPermissions('pi:abc123');
      expect(result.pi).toBe('pi:abc123');
      expect(result.canEdit).toBe(true);
      expect(result.collection?.role).toBe('editor');
    });

    it('should handle PI not in any collection', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          pi: 'pi:standalone',
          canView: true,
          canEdit: true,
          canAdminister: false,
          collection: null,
        }),
      });

      const result = await client.getPiPermissions('pi:standalone');
      expect(result.collection).toBeNull();
    });
  });

  describe('getMyAccess', () => {
    it('should fetch user access to collection', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          role: 'editor',
          canView: true,
          canEdit: true,
          canAdminister: false,
        }),
      });

      const result = await client.getMyAccess('coll-123');
      expect(result.role).toBe('editor');
      expect(result.canEdit).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should throw CollectionsError on HTTP error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        headers: new Map([['content-type', 'application/json']]),
        text: async () => JSON.stringify({ error: 'Collection not found' }),
      });

      await expect(client.getCollection('nonexistent')).rejects.toThrow(CollectionsError);
      await expect(client.getCollection('nonexistent')).rejects.toThrow('Collection not found');
    });

    it('should handle non-JSON error responses', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        headers: new Map([['content-type', 'text/plain']]),
        text: async () => 'Internal Server Error',
      });

      await expect(client.getCollection('error')).rejects.toThrow('Request failed with status 500');
    });

    it('should include status in error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 403,
        headers: new Map([['content-type', 'application/json']]),
        text: async () => JSON.stringify({ error: 'Forbidden' }),
      });

      try {
        await client.getCollection('forbidden');
        expect.fail('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(CollectionsError);
        expect((e as CollectionsError).details?.status).toBe(403);
      }
    });
  });

  describe('changeRoot', () => {
    it('should change collection root', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          success: true,
          newRootPi: 'pi:newroot123',
          previousRootPi: 'pi:oldroot123',
        }),
      });

      const result = await client.changeRoot('coll-123', { newRootPi: 'pi:newroot123' });
      expect(result.newRootPi).toBe('pi:newroot123');
    });
  });
});
