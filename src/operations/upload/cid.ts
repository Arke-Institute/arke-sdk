/**
 * CID Computation Utility
 *
 * Computes IPFS CIDv1 (base32) for file content.
 * Uses raw codec (0x55) and SHA-256 hash.
 *
 * Note: This module is not used internally by the upload engine (the server
 * computes CIDs from uploaded content). It is exported for convenience in case
 * you want to verify entity CIDs, detect duplicates before upload, or perform
 * other content-addressed operations.
 */

import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import * as raw from 'multiformats/codecs/raw';

/**
 * Compute CIDv1 for binary content.
 * Returns base32 encoded string (bafk... prefix for raw codec).
 *
 * @param data - Binary content as ArrayBuffer, Uint8Array, or Blob
 * @returns CIDv1 string in base32 encoding
 *
 * @example
 * ```typescript
 * const cid = await computeCid(new TextEncoder().encode('hello world'));
 * // Returns: "bafkreifzjut3te2nhyekklss27nh3k72ysco7y32koao5eei66wof36n5e"
 * ```
 */
export async function computeCid(data: ArrayBuffer | Uint8Array | Blob): Promise<string> {
  // Convert to Uint8Array
  let bytes: Uint8Array;

  if (data instanceof Blob) {
    const buffer = await data.arrayBuffer();
    bytes = new Uint8Array(buffer);
  } else if (data instanceof ArrayBuffer) {
    bytes = new Uint8Array(data);
  } else {
    bytes = data;
  }

  // Compute SHA-256 hash
  const hash = await sha256.digest(bytes);

  // Create CIDv1 with raw codec
  const cid = CID.create(1, raw.code, hash);

  // Return base32 encoded string
  return cid.toString();
}

/**
 * Verify a CID matches the content.
 *
 * @param data - Binary content
 * @param expectedCid - CID to verify against
 * @returns true if CID matches
 */
export async function verifyCid(
  data: ArrayBuffer | Uint8Array | Blob,
  expectedCid: string
): Promise<boolean> {
  const computed = await computeCid(data);
  return computed === expectedCid;
}
