/**
 * Hash and CID computation utilities
 */

import { CID } from 'multiformats/cid';
import * as raw from 'multiformats/codecs/raw';
import { sha256 } from 'multiformats/hashes/sha2';

/**
 * Compute IPFS CID v1 for a file (Node.js only)
 * Uses raw codec and SHA-256 hash
 * Returns base32-encoded CID string
 */
export async function computeFileCID(filePath: string): Promise<string> {
  // Dynamic import to avoid bundling fs in browser builds
  const fs = await import('fs/promises');

  try {
    // Read file contents
    const fileBuffer = await fs.readFile(filePath);

    // Compute SHA-256 hash
    const hash = await sha256.digest(fileBuffer);

    // Create CID v1 with raw codec
    const cid = CID.create(1, raw.code, hash);

    // Return base32-encoded string (default for v1)
    return cid.toString();
  } catch (error: any) {
    throw new Error(`CID computation failed: ${error.message}`);
  }
}

/**
 * Compute CID for a buffer (works in all environments)
 */
export async function computeBufferCID(buffer: Buffer): Promise<string> {
  const hash = await sha256.digest(buffer);
  const cid = CID.create(1, raw.code, hash);
  return cid.toString();
}

/**
 * Compute CID from Uint8Array (browser-compatible)
 */
export async function computeCIDFromBuffer(data: Uint8Array): Promise<string> {
  const hash = await sha256.digest(data);
  const cid = CID.create(1, raw.code, hash);
  return cid.toString();
}
