/**
 * Generate TypeScript types from OpenAPI spec
 *
 * Usage:
 *   npx tsx scripts/generate.ts
 *
 * Requires: openapi/spec.json (run fetch-spec.ts first)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import openapiTS, { astToString } from 'openapi-typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SPEC_PATH = join(ROOT, 'openapi', 'spec.json');
const OUTPUT_PATH = join(ROOT, 'src', 'generated', 'types.ts');

async function generate() {
  // Check spec exists
  if (!existsSync(SPEC_PATH)) {
    console.error('Error: openapi/spec.json not found');
    console.error('Run "npm run generate:fetch" first');
    process.exit(1);
  }

  console.log('Reading OpenAPI spec...');
  const specContent = readFileSync(SPEC_PATH, 'utf-8');
  const spec = JSON.parse(specContent);

  console.log('Generating TypeScript types...');
  const ast = await openapiTS(spec, {
    exportType: true,
    // Don't use pathParamsAsTypes - it creates index signature conflicts
    pathParamsAsTypes: false,
  });

  let output = astToString(ast);

  // Post-process: Make nullable boolean properties with defaults truly optional
  // openapi-typescript generates `prop: boolean | null` but we want `prop?: boolean | null`
  // for properties that have defaults and are not in the required array
  const optionalNullableProps = ['sync_index', 'use_roles_default'];
  for (const prop of optionalNullableProps) {
    // Match the property definition and add ? if not already present
    const pattern = new RegExp(`(\\s+)(${prop})(:)\\s*(boolean \\| null)`, 'g');
    output = output.replace(pattern, '$1$2?$3 $4');
  }

  // Add header comment
  const header = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 *
 * This file was generated from the Arke v1 OpenAPI spec.
 * To regenerate, run: npm run generate
 *
 * Source: ${spec.info?.title ?? 'Arke API'}
 * Version: ${spec.info?.version ?? 'unknown'}
 * Generated: ${new Date().toISOString()}
 */

`;

  // Ensure output directory exists
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });

  // Write output
  writeFileSync(OUTPUT_PATH, header + output);
  console.log(`Wrote ${OUTPUT_PATH}`);

  // Log stats
  const pathCount = Object.keys(spec.paths ?? {}).length;
  const schemaCount = Object.keys(spec.components?.schemas ?? {}).length;
  console.log(`\nGenerated types for:`);
  console.log(`  ${pathCount} API paths`);
  console.log(`  ${schemaCount} schemas`);
}

generate().catch((error) => {
  console.error('Error generating types:', error);
  process.exit(1);
});
