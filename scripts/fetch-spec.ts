/**
 * Fetch OpenAPI spec from arke_v1 API
 *
 * Usage:
 *   npx tsx scripts/fetch-spec.ts           # Fetch from production
 *   npx tsx scripts/fetch-spec.ts --local   # Fetch from localhost:8787
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const URLS = {
  production: 'https://arke-v1.arke.institute/openapi.json',
  local: 'http://localhost:8787/openapi.json',
};

interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  'x-arke-version'?: string;
  [key: string]: unknown;
}

async function fetchSpec() {
  const isLocal = process.argv.includes('--local');
  const url = isLocal ? URLS.local : URLS.production;

  console.log(`Fetching OpenAPI spec from ${url}...`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch spec: ${response.status} ${response.statusText}`);
  }

  const spec = (await response.json()) as OpenAPISpec;

  // Ensure openapi directory exists
  const openapiDir = join(ROOT, 'openapi');
  mkdirSync(openapiDir, { recursive: true });

  // Write spec.json
  const specPath = join(openapiDir, 'spec.json');
  writeFileSync(specPath, JSON.stringify(spec, null, 2));
  console.log(`Wrote ${specPath}`);

  // Write version.json with metadata
  const versionInfo = {
    specVersion: spec['x-arke-version'] ?? spec.info.version,
    apiVersion: spec.info.version,
    fetchedAt: new Date().toISOString(),
    sourceUrl: url,
    openApiVersion: spec.openapi,
  };

  const versionPath = join(openapiDir, 'version.json');
  writeFileSync(versionPath, JSON.stringify(versionInfo, null, 2));
  console.log(`Wrote ${versionPath}`);

  console.log(`\nSpec info:`);
  console.log(`  Title: ${spec.info.title}`);
  console.log(`  Version: ${spec.info.version}`);
  console.log(`  OpenAPI: ${spec.openapi}`);
}

fetchSpec().catch((error) => {
  console.error('Error fetching spec:', error.message);
  process.exit(1);
});
