import { resolveEndpointResponse } from '../src/contracts/api';

interface RequestLike {
  method?: string;
  headers?: Record<string, string | undefined>;
  query?: Record<string, string | string[] | undefined>;
}

interface ResponseLike {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

interface WebContextLike {
  req?: {
    method?: string;
    url?: string;
    headers?: {
      get: (name: string) => string | null;
    };
  };
}

const getAuthFromHeaders = (headers: RequestLike['headers']): string | undefined => {
  const value = headers?.authorization;
  return Array.isArray(value) ? value[0] : value;
};

const buildResponse = (status: number, body: unknown): Response =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });

const isNodeResponse = (value: unknown): value is ResponseLike =>
  typeof value === 'object' &&
  value !== null &&
  'status' in value &&
  'json' in value &&
  'setHeader' in value;

const buildPath = (query?: Record<string, string | string[] | undefined>): string => {
  const slug = query?.slug;
  if (!slug) return '/api';
  if (Array.isArray(slug)) return `/api/${slug.join('/')}`;
  return `/api/${slug}`;
};

const buildPathFromUrl = (url?: string): string => {
  if (!url) return '/api';
  const { pathname } = new URL(url, 'https://lingbot-map.local');
  if (pathname === '/api' || pathname.startsWith('/api/')) {
    return pathname;
  }
  if (pathname === '/mcp') return '/api/mcp';
  if (pathname === '/mcp/health') return '/api/mcp/health';
  if (pathname === '/.well-known/mcp.json') return '/api/mcp/well-known';
  return pathname;
};

export default function handler(req: Request | RequestLike | WebContextLike, res?: ResponseLike): Response | void {
  if (isNodeResponse(res)) {
    const request = req as RequestLike;
    const path = buildPath(request.query);
    const { status, body } = resolveEndpointResponse(path, request.method ?? 'GET', getAuthFromHeaders(request.headers));
    res.setHeader('Cache-Control', 'no-store');
    res.status(status).json(body);
    return;
  }

  if (req instanceof Request) {
    const incomingPath = new URL(req.url).pathname;
    const path = incomingPath.startsWith('/api/') ? incomingPath : buildPathFromUrl(req.url);
    const auth = req.headers.get('authorization') ?? undefined;
    const { status, body } = resolveEndpointResponse(path, req.method, auth);
    return buildResponse(status, body);
  }

  const request = req as WebContextLike;
  const path = buildPathFromUrl(request.req?.url);
  const method = request.req?.method ?? 'GET';
  const auth = request.req?.headers?.get('authorization') ?? undefined;
  const { status, body } = resolveEndpointResponse(path, method, auth);
  return buildResponse(status, body);
}
