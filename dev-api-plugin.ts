import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { resolveEndpointResponse } from './src/contracts/api';

const handledPaths = new Set([
  '/api',
  '/api/health',
  '/api/status',
  '/api/version',
  '/api/info',
  '/api/scan',
  '/api/baseline',
  '/api/policy',
  '/api/audit',
  '/api/quarantine',
  '/api/ingest',
  '/api/dispatch',
  '/mcp',
  '/mcp/health',
  '/.well-known/mcp.json',
]);

const readPathname = (req: IncomingMessage): string => {
  const url = req.url ?? '/';
  return new URL(url, 'http://localhost').pathname;
};

const writeJson = (res: ServerResponse, status: number, payload: unknown): void => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
};

export const devApiPlugin = (): Plugin => ({
  name: 'lingbot-dev-api-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const pathname = readPathname(req);
      if (!handledPaths.has(pathname)) {
        next();
        return;
      }

      const { status, body } = resolveEndpointResponse(pathname, req.method ?? 'GET', req.headers.authorization);
      writeJson(res, status, body);
    });
  },
});
