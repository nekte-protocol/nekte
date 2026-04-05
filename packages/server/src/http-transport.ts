/**
 * HTTP Transport — Infrastructure Adapter (Hexagonal Architecture)
 *
 * Decouples HTTP server concerns from the NekteServer domain.
 * Handles routing, body parsing, CORS, auth, and SSE delegation.
 */

import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { NekteRequest, DelegateParams } from '@nekte/core';
import { WELL_KNOWN_PATH, createLogger, type Logger, type LogLevel } from '@nekte/core';
import type { NekteServer } from './server.js';
import type { AuthHandler } from './auth.js';
import { noAuth } from './auth.js';
import { SseStream } from './sse-stream.js';

export interface HttpTransportConfig {
  port: number;
  hostname?: string;
  logLevel?: LogLevel;
  authHandler?: AuthHandler;
}

export interface HttpTransport {
  readonly server: Server;
  readonly port: number;
  close(): Promise<void>;
}

/**
 * Create an HTTP transport adapter for a NekteServer.
 * This is the infrastructure layer — the NekteServer domain stays clean.
 */
export function createHttpTransport(
  nekteServer: NekteServer,
  config: HttpTransportConfig,
): Promise<HttpTransport> {
  const hostname = config.hostname ?? '0.0.0.0';
  const auth = config.authHandler ?? nekteServer.config.authHandler ?? noAuth();
  const log = createLogger(`nekte:http:${nekteServer.config.agent}`, config.logLevel ?? nekteServer.config.logLevel);

  return new Promise((resolve) => {
    const httpServer = createServer(async (req, res) => {
      // Agent Card discovery (public, no auth)
      if (req.url === WELL_KNOWN_PATH && req.method === 'GET') {
        const card = nekteServer.agentCard(`http://${hostname}:${config.port}`);
        sendJson(res, 200, card);
        return;
      }

      // NEKTE JSON-RPC endpoint
      if (req.method === 'POST') {
        const authResult = await auth(req);
        if (!authResult.ok) {
          sendJson(res, authResult.status, { error: authResult.message });
          return;
        }

        try {
          const body = await readBody(req);
          const request = JSON.parse(body) as NekteRequest;

          // SSE streaming for delegate
          if (request.method === 'nekte.delegate' && nekteServer.delegateHandler) {
            const params = request.params as DelegateParams;
            const stream = new SseStream(res);
            try {
              await nekteServer.delegateHandler(params.task, stream, params.context);
              if (!stream.isClosed) stream.close();
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err);
              if (!stream.isClosed) stream.error(-32007, msg, params.task.id);
            }
            return;
          }

          const response = await nekteServer.handleRequest(request);
          sendJson(res, 200, response);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Internal error';
          sendJson(res, 500, { jsonrpc: '2.0', id: 0, error: { code: -32000, message } });
        }
        return;
      }

      res.writeHead(404).end();
    });

    httpServer.listen(config.port, hostname, () => {
      log.info(`Listening on http://${hostname}:${config.port}`);
      log.info(`Agent Card: http://${hostname}:${config.port}${WELL_KNOWN_PATH}`);
      resolve({
        server: httpServer,
        port: config.port,
        close: () => new Promise<void>((r) => httpServer.close(() => r())),
      });
    });
  });
}

function sendJson(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: string) => (body += chunk));
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}
