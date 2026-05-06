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

export const callEndpoint = async (endpoint: ApiEndpoint, token?: string): Promise<ApiResponse<unknown>> => {
  try {
    const response = await fetch(buildUrl(endpoint), {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    const payload = (await response.json()) as ApiResponse<unknown>;
    if (!response.ok) {
      return payload;
    }

    return payload;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown failure';
    return networkFailure(endpoint, message);
  }
};
