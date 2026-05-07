import { resolveEndpointResponse } from './_lib/contracts';

interface RequestLike {
  method?: string;
  headers?: Record<string, string | undefined>;
}

interface ResponseLike {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

interface WebContextLike {
  req?: {
    method?: string;
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
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
    },
  });

const isNodeResponse = (value: unknown): value is ResponseLike =>
  typeof value === 'object' &&
  value !== null &&
  'status' in value &&
  'json' in value &&
  'setHeader' in value;

export default function handler(req: Request | RequestLike | WebContextLike, res?: ResponseLike): Response | void {
  if (isNodeResponse(res)) {
    const request = req as RequestLike;
    const { status, body } = resolveEndpointResponse('/api', request.method ?? 'GET', getAuthFromHeaders(request.headers));
    res.setHeader('Cache-Control', 'no-store');
    res.status(status).json(body);
    return;
  }

  if (req instanceof Request) {
    const auth = req.headers.get('authorization') ?? undefined;
    const { status, body } = resolveEndpointResponse('/api', req.method, auth);
    return buildResponse(status, body);
  }

  const request = req as WebContextLike;
  const method = request.req?.method ?? 'GET';
  const auth = request.req?.headers?.get('authorization') ?? undefined;
  const { status, body } = resolveEndpointResponse('/api', method, auth);
  return buildResponse(status, body);
}
