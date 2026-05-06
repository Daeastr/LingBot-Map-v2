import { ApiEndpoint, ApiErrorResponse, ApiResponse, DEMO_ACCESS_TOKEN } from '../contracts/api';

const buildUrl = (endpoint: ApiEndpoint): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';
  return `${baseUrl}${endpoint}`;
};

export const authenticateOperator = (email: string, password: string): { ok: boolean; token?: string; message?: string } => {
  const expectedEmail = import.meta.env.VITE_AUTH_EMAIL?.trim() || 'admin@lingbot.io';
  const expectedPassword = import.meta.env.VITE_AUTH_PASSWORD?.trim() || 'P@ssword1';

  if (email === expectedEmail && password === expectedPassword) {
    return { ok: true, token: DEMO_ACCESS_TOKEN };
  }

  return {
    ok: false,
    message: 'Authentication failed. Verify credentials and retry.',
  };
};

const networkFailure = (endpoint: ApiEndpoint, details: string): ApiErrorResponse => ({
  ok: false,
  endpoint,
  auth: { required: false, scheme: 'None' },
  timestamp: new Date().toISOString(),
  error: {
    code: 'NETWORK_ERROR',
    message: 'Unable to reach endpoint.',
    details,
  },
});

const errorCodeFromStatus = (status: number): ApiErrorResponse['error']['code'] => {
  if (status === 401 || status === 403) return 'UNAUTHORIZED';
  if (status === 404) return 'NOT_FOUND';
  if (status === 405) return 'METHOD_NOT_ALLOWED';
  return 'INTERNAL_ERROR';
};

const fallbackError = (endpoint: ApiEndpoint, status: number, details: string): ApiErrorResponse => ({
  ok: false,
  endpoint,
  auth: { required: status === 401 || status === 403, scheme: status === 401 || status === 403 ? 'Bearer' : 'None' },
  timestamp: new Date().toISOString(),
  error: {
    code: errorCodeFromStatus(status),
    message: `HTTP ${status} response received from endpoint.`,
    details,
  },
});

const isApiResponse = (value: unknown): value is ApiResponse<unknown> => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'ok' in value && 'endpoint' in value;
};

export const callEndpoint = async (endpoint: ApiEndpoint, token?: string): Promise<ApiResponse<unknown>> => {
  try {
    const response = await fetch(buildUrl(endpoint), {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    const raw = await response.text();
    const contentType = response.headers.get('content-type') ?? '';

    let payload: unknown = null;
    if (raw.length > 0) {
      if (contentType.includes('application/json')) {
        try {
          payload = JSON.parse(raw) as unknown;
        } catch {
          payload = null;
        }
      } else {
        try {
          payload = JSON.parse(raw) as unknown;
        } catch {
          payload = null;
        }
      }
    }

    if (isApiResponse(payload)) {
      return payload;
    }

    if (!response.ok) {
      const details = raw.slice(0, 300) || 'No response body returned.';
      return fallbackError(endpoint, response.status, details);
    }

    return {
      ok: true,
      endpoint,
      auth: { required: false, scheme: 'None' },
      timestamp: new Date().toISOString(),
      data: payload ?? { message: raw.slice(0, 300) || 'Endpoint returned an empty response body.' },
    };

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network request failed with unknown error';
    return networkFailure(endpoint, message);
  }

};
