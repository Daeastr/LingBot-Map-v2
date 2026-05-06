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

const buildPath = (query?: Record<string, string | string[] | undefined>): string => {
  const slug = query?.slug;
  if (!slug) return '/api';
  if (Array.isArray(slug)) return `/api/${slug.join('/')}`;
  return `/api/${slug}`;
};

export default function handler(req: RequestLike, res: ResponseLike): void {
  const path = buildPath(req.query);
  const { status, body } = resolveEndpointResponse(path, req.method ?? 'GET', req.headers?.authorization);
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(body);
}
