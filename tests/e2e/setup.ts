/**
 * E2E Test Setup for Arke SDK
 *
 * Adapted from arke_v1 test setup - provides JWT generation and API helpers.
 * Supports both API key auth (preferred) and JWT auth (for user registration tests).
 */

import * as jose from 'jose';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// Configuration
// =============================================================================

export const PROD_URL = 'https://api.arke.institute';

export interface E2EConfig {
  baseUrl: string;
  jwtSecret?: string;
  supabaseUrl?: string;
  apiKey?: string;
}

let cachedConfig: E2EConfig | null = null;

/**
 * Load an env file and return key-value pairs
 */
function loadEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};

  const content = fs.readFileSync(filePath, 'utf-8');
  const vars: Record<string, string> = {};

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = line.indexOf('=');
    if (eqIndex > 0) {
      const key = line.slice(0, eqIndex).trim();
      const value = line.slice(eqIndex + 1).trim();
      vars[key] = value;
    }
  }

  return vars;
}

/**
 * Load configuration from environment files
 * Priority: .env.e2e (API key) > .dev.vars (JWT credentials)
 */
export function loadConfig(): E2EConfig {
  if (cachedConfig) return cachedConfig;

  // Check for API key in .env.e2e first
  const envE2ePath = path.resolve(process.cwd(), '.env.e2e');
  const envE2eVars = loadEnvFile(envE2ePath);

  if (envE2eVars.ARKE_API_KEY) {
    console.log('Using API key from .env.e2e');
    cachedConfig = {
      baseUrl: process.env.E2E_BASE_URL || PROD_URL,
      apiKey: envE2eVars.ARKE_API_KEY,
    };
    return cachedConfig;
  }

  // Fall back to .dev.vars for JWT auth
  const arkeV1Path = path.resolve(process.cwd(), '..', 'arke_v1', '.dev.vars');
  const localPath = path.resolve(process.cwd(), '.dev.vars');

  let devVarsPath: string | null = null;
  if (fs.existsSync(localPath)) {
    devVarsPath = localPath;
  } else if (fs.existsSync(arkeV1Path)) {
    devVarsPath = arkeV1Path;
  }

  if (!devVarsPath) {
    throw new Error(
      'No auth config found. Create .env.e2e with ARKE_API_KEY, or .dev.vars with SUPABASE_JWT_SECRET and SUPABASE_URL'
    );
  }

  const vars = loadEnvFile(devVarsPath);

  const required = ['SUPABASE_JWT_SECRET', 'SUPABASE_URL'];
  for (const key of required) {
    if (!vars[key]) {
      throw new Error(`Missing ${key} in .dev.vars`);
    }
  }

  cachedConfig = {
    baseUrl: process.env.E2E_BASE_URL || PROD_URL,
    jwtSecret: vars.SUPABASE_JWT_SECRET,
    supabaseUrl: vars.SUPABASE_URL,
  };

  return cachedConfig;

}

/**
 * Check if config has an API key (vs JWT auth)
 */
export function hasApiKey(config?: E2EConfig): boolean {
  const c = config || loadConfig();
  return !!c.apiKey;
}

// =============================================================================
// Test User
// =============================================================================

export interface TestUser {
  supabaseId: string;
  email: string;
  name: string;
}

/**
 * Generate a test user with random UUID
 */
export function createTestUser(): TestUser {
  const id = randomUUID();
  return {
    supabaseId: id,
    email: `sdk-test-${id.slice(0, 8)}@arke-e2e.test`,
    name: `SDK Test User ${id.slice(0, 8)}`,
  };
}

// =============================================================================
// JWT Generation
// =============================================================================

/**
 * Create a signed JWT for a test user
 */
export async function createJWT(user: TestUser, config?: E2EConfig): Promise<string> {
  const { jwtSecret, supabaseUrl } = config || loadConfig();
  const secretBytes = new TextEncoder().encode(jwtSecret);

  const payload = {
    sub: user.supabaseId,
    email: user.email,
    user_metadata: { name: user.name },
    app_metadata: { provider: 'email', providers: ['email'] },
    role: 'authenticated',
    aud: 'authenticated',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    iss: `${supabaseUrl}/auth/v1`,
  };

  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime('1h')
    .sign(secretBytes);
}

// =============================================================================
// API Helpers
// =============================================================================

export interface APIResponse<T = unknown> {
  status: number;
  body: T;
}

export async function apiRequest<T = unknown>(
  method: string,
  path: string,
  options: {
    token?: string;
    body?: unknown;
    config?: E2EConfig;
  } = {}
): Promise<APIResponse<T>> {
  const { baseUrl } = options.config || loadConfig();
  const headers: Record<string, string> = {};

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  let body: T;
  try {
    body = JSON.parse(text) as T;
  } catch {
    body = text as unknown as T;
  }

  return { status: res.status, body };
}

/**
 * Register user (idempotent)
 */
export async function registerUser(token: string, config?: E2EConfig): Promise<{ id: string; cid: string }> {
  const res = await apiRequest<{ created: boolean; user: { id: string; cid: string } }>(
    'POST',
    '/auth/register',
    { token, config }
  );

  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`Registration failed: ${JSON.stringify(res.body)}`);
  }

  return res.body.user;
}
