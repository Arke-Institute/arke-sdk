/**
 * Upload E2E Tests
 *
 * Tests the full upload flow against the real Arke API:
 * 1. Create collection
 * 2. Upload files and folders
 * 3. Verify created entities
 * 4. Verify folder structure (relationships)
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ArkeClient } from '../../src/client/ArkeClient.js';
import { uploadTree, type UploadResult } from '../../src/operations/upload/index.js';
import { loadConfig, createTestUser, createJWT, registerUser, apiRequest, type E2EConfig } from './setup.js';
import {
  createSimpleTestTree,
  createNestedTestTree,
  createFlatTestTree,
  createDeeplyNestedTree,
  summarizeTree,
} from './fixtures/test-data.js';

describe('Upload E2E', () => {
  let config: E2EConfig;
  let token: string;
  let client: ArkeClient;
  let userId: string;

  // Track created collections for potential cleanup
  const createdCollections: string[] = [];

  beforeAll(async () => {
    // Load config and create authenticated client
    config = loadConfig();
    const testUser = createTestUser();
    token = await createJWT(testUser, config);

    // Register user
    const user = await registerUser(token, config);
    userId = user.id;
    console.log(`Registered test user: ${userId}`);

    // Create SDK client
    client = new ArkeClient({
      baseUrl: config.baseUrl,
      authToken: token,
    });
  });

  afterAll(async () => {
    // Log created collections (manual cleanup if needed)
    if (createdCollections.length > 0) {
      console.log('\nCreated collections (for manual cleanup if needed):');
      createdCollections.forEach((id) => console.log(`  - ${id}`));
    }
  });

  describe('Simple Upload', () => {
    it('should upload flat files to a new collection', async () => {
      const tree = createFlatTestTree();
      console.log(`\nUploading flat tree: ${summarizeTree(tree)}`);

      const result = await uploadTree(client, tree, {
        target: {
          createCollection: {
            label: `SDK Test - Flat ${Date.now()}`,
            description: 'Test collection with flat file structure',
          },
        },
        onProgress: (p) => {
          if (p.phase === 'complete' || p.phase === 'error') {
            console.log(`  Phase: ${p.phase}`);
          }
        },
      });

      // Track for cleanup
      createdCollections.push(result.collection.id);

      // Verify result
      expect(result.success).toBe(true);
      expect(result.collection.created).toBe(true);
      expect(result.collection.id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
      expect(result.files).toHaveLength(3);
      expect(result.folders).toHaveLength(0);
      expect(result.errors).toHaveLength(0);

      console.log(`  Created collection: ${result.collection.id}`);
      console.log(`  Files created: ${result.files.map((f) => f.relativePath).join(', ')}`);

      // Verify files are accessible via API
      for (const file of result.files) {
        const { data, error } = await client.api.GET('/files/{id}', {
          params: { path: { id: file.id } },
        });

        expect(error).toBeUndefined();
        expect(data).toBeDefined();
        expect(data!.id).toBe(file.id);
        expect(data!.type).toBe('file');
      }
    });

    it('should upload files with nested folders', async () => {
      const tree = createNestedTestTree();
      console.log(`\nUploading nested tree: ${summarizeTree(tree)}`);

      const progressLog: string[] = [];
      const result = await uploadTree(client, tree, {
        target: {
          createCollection: {
            label: `SDK Test - Nested ${Date.now()}`,
            description: 'Test collection with nested folder structure',
          },
        },
        onProgress: (p) => {
          progressLog.push(p.phase);
        },
      });

      createdCollections.push(result.collection.id);

      // Verify result
      expect(result.success).toBe(true);
      expect(result.files).toHaveLength(9); // All files from nestedTestTree
      expect(result.folders).toHaveLength(5); // docs, docs/images, src, src/components, data
      expect(result.errors).toHaveLength(0);

      console.log(`  Collection: ${result.collection.id}`);
      console.log(`  Folders: ${result.folders.map((f) => f.relativePath).join(', ')}`);
      console.log(`  Files: ${result.files.length}`);

      // Verify progress phases occurred in order
      expect(progressLog).toContain('computing-cids');
      expect(progressLog).toContain('creating-folders');
      expect(progressLog).toContain('creating-files');
      expect(progressLog).toContain('uploading-content');
      expect(progressLog).toContain('linking');
      expect(progressLog).toContain('complete');

      // Verify folder structure via API
      const docsFolder = result.folders.find((f) => f.relativePath === 'docs');
      expect(docsFolder).toBeDefined();

      const { data: folderData } = await client.api.GET('/folders/{id}', {
        params: { path: { id: docsFolder!.id } },
      });

      expect(folderData).toBeDefined();
      expect(folderData!.type).toBe('folder');

      // Check that folder has 'contains' relationships
      const containsRels = folderData!.relationships?.filter((r) => r.predicate === 'contains') || [];
      expect(containsRels.length).toBeGreaterThan(0);
      console.log(`  docs folder contains ${containsRels.length} items`);
    });

    it('should upload deeply nested folders', async () => {
      const tree = createDeeplyNestedTree();
      console.log(`\nUploading deeply nested tree: ${summarizeTree(tree)}`);

      const result = await uploadTree(client, tree, {
        target: {
          createCollection: {
            label: `SDK Test - Deep ${Date.now()}`,
          },
        },
      });

      createdCollections.push(result.collection.id);

      expect(result.success).toBe(true);
      expect(result.folders).toHaveLength(5); // a, a/b, a/b/c, a/b/c/d, a/b/c/d/e
      expect(result.files).toHaveLength(5);

      // Verify the deepest folder exists and has the file
      const deepestFolder = result.folders.find((f) => f.relativePath === 'a/b/c/d/e');
      expect(deepestFolder).toBeDefined();

      const { data: deepFolderData } = await client.api.GET('/folders/{id}', {
        params: { path: { id: deepestFolder!.id } },
      });

      expect(deepFolderData).toBeDefined();
      const containsRels = deepFolderData!.relationships?.filter((r) => r.predicate === 'contains') || [];
      expect(containsRels).toHaveLength(1); // Should contain file.txt

      console.log(`  Deep folder ${deepestFolder!.id} contains ${containsRels.length} item`);
    });
  });

  describe('Upload to Existing Collection', () => {
    let testCollectionId: string;
    let testCollectionCid: string;

    beforeAll(async () => {
      // Create a collection to upload to
      const { data, error } = await client.api.POST('/collections', {
        body: {
          label: `SDK Test - Existing ${Date.now()}`,
          description: 'Pre-existing collection for upload tests',
        },
      });

      expect(error).toBeUndefined();
      testCollectionId = data!.id;
      testCollectionCid = data!.cid;
      createdCollections.push(testCollectionId);
      console.log(`\nCreated test collection: ${testCollectionId}`);
    });

    it('should upload to an existing collection', async () => {
      const tree = createSimpleTestTree();
      console.log(`\nUploading to existing collection: ${summarizeTree(tree)}`);

      const result = await uploadTree(client, tree, {
        target: {
          collectionId: testCollectionId,
        },
      });

      expect(result.success).toBe(true);
      expect(result.collection.created).toBe(false);
      expect(result.collection.id).toBe(testCollectionId);
      expect(result.files).toHaveLength(2);

      console.log(`  Uploaded ${result.files.length} files to ${testCollectionId}`);

      // Verify files are in the collection (have collection relationship)
      for (const file of result.files) {
        const { data } = await client.api.GET('/files/{id}', {
          params: { path: { id: file.id } },
        });

        const collectionRel = data?.relationships?.find((r) => r.predicate === 'collection');
        expect(collectionRel).toBeDefined();
        expect(collectionRel!.peer).toBe(testCollectionId);
      }
    });
  });

  describe('File Content Verification', () => {
    it('should upload and download file with correct content', async () => {
      const testContent = `Test content ${Date.now()} - Hello World!`;
      const tree = buildUploadTree([
        {
          path: 'verify-content.txt',
          data: new Blob([testContent]),
          mimeType: 'text/plain',
        },
      ]);

      const result = await uploadTree(client, tree, {
        target: {
          createCollection: {
            label: `SDK Test - Content Verify ${Date.now()}`,
          },
        },
      });

      createdCollections.push(result.collection.id);

      expect(result.success).toBe(true);
      expect(result.files).toHaveLength(1);

      // Get download URL
      const fileId = result.files[0]!.id;
      const { data: downloadData, error } = await client.api.GET('/files/{id}/download', {
        params: { path: { id: fileId } },
      });

      expect(error).toBeUndefined();
      expect(downloadData?.download_url).toBeDefined();

      // Download and verify content
      const downloadRes = await fetch(downloadData!.download_url);
      expect(downloadRes.ok).toBe(true);

      const downloadedContent = await downloadRes.text();
      expect(downloadedContent).toBe(testContent);

      console.log(`\nContent verification passed for file ${fileId}`);
    });
  });

  describe('Error Handling', () => {
    it('should fail gracefully with invalid collection ID', async () => {
      const tree = createSimpleTestTree();

      const result = await uploadTree(client, tree, {
        target: {
          collectionId: 'INVALID_COLLECTION_ID_12345',
        },
        continueOnError: false,
      });

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      console.log(`\nExpected error: ${result.errors[0]?.error}`);
    });
  });
});

// Import for content verification test
import { buildUploadTree } from '../../src/operations/upload/index.js';
