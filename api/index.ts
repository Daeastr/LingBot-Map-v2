import { resolveEndpointResponse } from '../src/contracts/api';

interface RequestLike {
  method?: string;
  headers?: Record<string, string | undefined>;
}

interface ResponseLike {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

export default function handler(req: RequestLike, res: ResponseLike): void {
  const { status, body } = resolveEndpointResponse('/api', req.method ?? 'GET', req.headers?.authorization);
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(body);
}
