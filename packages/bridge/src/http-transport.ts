/**
 * Bridge HTTP Transport — Infrastructure Adapter
 *
 * Decouples HTTP server concerns from the NekteBridge domain.
 */

import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { NekteRequest } from '@nekte/core';
import { WELL_KNOWN_PATH, createLogger, type LogLevel } from '@nekte/core';
import type { NekteBridge } from './bridge.js';

export interface BridgeHttpTransportConfig {
  port: number;
  hostname?: string;
  logLevel?: LogLevel;
}

export interface BridgeHttpTransport {
  readonly server: Server;
  readonly port: number;
  close(): Promise<void>;
}

export function createBridgeHttpTransport(
  bridge: NekteBridge,
  config: BridgeHttpTransportConfig,
): Promise<BridgeHttpTransport> {
  const hostname = config.hostname ?? '0.0.0.0';
  const log = createLogger('nekte-bridge:http', config.logLevel);

  return new Promise((resolve) => {
    const httpServer = createServer(async (req, res) => {
      // CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        res.writeHead(204).end();
        return;
      }

      // Agent Card
      if (req.url === WELL_KNOWN_PATH && req.method === 'GET') {
        sendJson(res, 200, bridge.agentCard(config.port));
        return;
      }

      // Health
      if (req.url === '/health' && req.method === 'GET') {
        sendJson(res, 200, bridge.health());
        return;
      }

      // NEKTE JSON-RPC
      if (req.method === 'POST') {
        try {
          const body = await readBody(req);
          const request = JSON.parse(body) as NekteRequest;
          const response = await bridge.handleRequest(request);
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
      log.info(`Bridge listening on http://${hostname}:${config.port}`);
      log.info(`Agent Card: http://${hostname}:${config.port}${WELL_KNOWN_PATH}`);
      log.info(`Health: http://${hostname}:${config.port}/health`);
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
