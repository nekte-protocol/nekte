/**
 * NEKTE Auth Middleware
 *
 * Validates incoming requests based on the auth method
 * advertised in the Agent Card. Pluggable and simple.
 */

import type { IncomingMessage } from 'node:http';

export type AuthResult =
  | { ok: true; identity?: string }
  | { ok: false; status: number; message: string };

export type AuthHandler = (req: IncomingMessage) => AuthResult | Promise<AuthResult>;

/**
 * No authentication — all requests are allowed.
 */
export function noAuth(): AuthHandler {
  return () => ({ ok: true });
}

/**
 * Bearer token authentication.
 * Validates the Authorization header against one or more valid tokens.
 */
export function bearerAuth(tokens: string | string[]): AuthHandler {
  const validTokens = new Set(Array.isArray(tokens) ? tokens : [tokens]);

  return (req) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return { ok: false, status: 401, message: 'Missing or invalid Authorization header' };
    }

    const token = header.slice(7);
    if (!validTokens.has(token)) {
      return { ok: false, status: 403, message: 'Invalid token' };
    }

    return { ok: true, identity: token.slice(0, 8) + '...' };
  };
}

/**
 * API key authentication.
 * Validates the X-API-Key header against one or more valid keys.
 */
export function apiKeyAuth(keys: string | string[]): AuthHandler {
  const validKeys = new Set(Array.isArray(keys) ? keys : [keys]);

  return (req) => {
    const key = req.headers['x-api-key'] as string | undefined;
    if (!key) {
      return { ok: false, status: 401, message: 'Missing X-API-Key header' };
    }

    if (!validKeys.has(key)) {
      return { ok: false, status: 403, message: 'Invalid API key' };
    }

    return { ok: true, identity: key.slice(0, 8) + '...' };
  };
}
