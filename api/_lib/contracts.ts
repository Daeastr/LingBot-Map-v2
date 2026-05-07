export const DEMO_ACCESS_TOKEN = 'lingbot-demo-token';

export type PublicEndpoint =
  | '/api'
  | '/api/health'
  | '/api/status'
  | '/api/version'
  | '/api/info'
  | '/mcp'
  | '/mcp/health'
  | '/.well-known/mcp.json';

export type ProtectedEndpoint =
  | '/api/scan'
  | '/api/baseline'
  | '/api/policy'
  | '/api/audit'
  | '/api/quarantine'
  | '/api/ingest'
  | '/api/dispatch';

export type ApiEndpoint = PublicEndpoint | ProtectedEndpoint;

export type ApiErrorCode = 'UNAUTHORIZED' | 'NOT_FOUND' | 'METHOD_NOT_ALLOWED' | 'INTERNAL_ERROR';

export interface ApiAuthContract {
  required: boolean;
  scheme: 'None' | 'Bearer';
}

export interface ApiErrorModel {
  code: ApiErrorCode;
  message: string;
  details?: string;
}

export interface ApiSuccessResponse<T> {
  ok: true;
  endpoint: ApiEndpoint;
  auth: ApiAuthContract;
  timestamp: string;
  data: T;
}

export interface ApiErrorResponse {
  ok: false;
  endpoint: string;
  auth: ApiAuthContract;
  timestamp: string;
  error: ApiErrorModel;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ApiRootData {
  service: string;
  mode: 'edge';
  supportedEndpoints: ApiEndpoint[];
}

export interface HealthData {
  status: 'ok';
  uptimeHint: 'stable';
}

export interface StatusData {
  runtime: 'ready' | 'degraded';
  scheduler: 'nominal';
  watchdog: 'nominal' | 'warning';
}

export interface VersionData {
  name: string;
  version: string;
  build: string;
}

export interface InfoData {
  architecture: string;
  transport: string[];
  tileModel: string;
}

export interface WorkflowData {
  stage: string;
  state: 'ready' | 'completed';
  summary: string;
  metrics: Record<string, number | string>;
}

export interface McpDescriptorData {
  protocol: 'mcp';
  version: '1.0';
  server: string;
  capabilities: string[];
}

export const endpointAuth: Record<ApiEndpoint, ApiAuthContract> = {
  '/api': { required: false, scheme: 'None' },
  '/api/health': { required: false, scheme: 'None' },
  '/api/status': { required: false, scheme: 'None' },
  '/api/version': { required: false, scheme: 'None' },
  '/api/info': { required: false, scheme: 'None' },
  '/api/scan': { required: true, scheme: 'Bearer' },
  '/api/baseline': { required: true, scheme: 'Bearer' },
  '/api/policy': { required: true, scheme: 'Bearer' },
  '/api/audit': { required: true, scheme: 'Bearer' },
  '/api/quarantine': { required: true, scheme: 'Bearer' },
  '/api/ingest': { required: true, scheme: 'Bearer' },
  '/api/dispatch': { required: true, scheme: 'Bearer' },
  '/mcp': { required: false, scheme: 'None' },
  '/mcp/health': { required: false, scheme: 'None' },
  '/.well-known/mcp.json': { required: false, scheme: 'None' },
};

export const requiredEndpoints: ApiEndpoint[] = Object.keys(endpointAuth) as ApiEndpoint[];

const normalizeIncomingPath = (rawPath: string): string => {
  const normalized = rawPath.replace(/\/+$/, '') || '/';

  if (normalized === '/api/mcp') return '/mcp';
  if (normalized === '/api/mcp/health') return '/mcp/health';
  if (normalized === '/api/mcp/well-known') return '/.well-known/mcp.json';

  return normalized;
};

const asEndpoint = (value: string): ApiEndpoint | null => {
  const normalized = normalizeIncomingPath(value);
  return (requiredEndpoints as string[]).includes(normalized) ? (normalized as ApiEndpoint) : null;
};

const success = <T>(endpoint: ApiEndpoint, data: T): ApiSuccessResponse<T> => ({
  ok: true,
  endpoint,
  auth: endpointAuth[endpoint],
  timestamp: new Date().toISOString(),
  data,
});

const failure = (
  endpoint: string,
  auth: ApiAuthContract,
  code: ApiErrorCode,
  message: string,
  details?: string,
): ApiErrorResponse => ({
  ok: false,
  endpoint,
  auth,
  timestamp: new Date().toISOString(),
  error: {
    code,
    message,
    details,
  },
});

const authTokenValid = (authorizationHeader?: string): boolean => {
  if (!authorizationHeader?.startsWith('Bearer ')) return false;
  return authorizationHeader.slice('Bearer '.length).trim() === DEMO_ACCESS_TOKEN;
};

const endpointPayload = (endpoint: ApiEndpoint): ApiSuccessResponse<unknown> => {
  switch (endpoint) {
    case '/api':
      return success<ApiRootData>(endpoint, {
        service: 'LingBot-Map API Gateway',
        mode: 'edge',
        supportedEndpoints: requiredEndpoints,
      });
    case '/api/health':
      return success<HealthData>(endpoint, {
        status: 'ok',
        uptimeHint: 'stable',
      });
    case '/api/status':
      return success<StatusData>(endpoint, {
        runtime: 'ready',
        scheduler: 'nominal',
        watchdog: 'nominal',
      });
    case '/api/version':
      return success<VersionData>(endpoint, {
        name: 'lingbot-map-v2',
        version: '2.0.0',
        build: 'acdp-contract',
      });
    case '/api/info':
      return success<InfoData>(endpoint, {
        architecture: 'streaming-edge-tile-graph',
        transport: ['protobuf', 'flatbuffers'],
        tileModel: 'sparse-overlapping-2-5m3',
      });
    case '/api/scan':
      return success<WorkflowData>(endpoint, {
        stage: 'scan',
        state: 'completed',
        summary: 'CVE and sensor scan ingestion validated.',
        metrics: { findings: 3, critical: 0, medium: 2, low: 1 },
      });
    case '/api/ingest':
      return success<WorkflowData>(endpoint, {
        stage: 'ingest',
        state: 'completed',
        summary: 'Dataset intake accepted by temporal synchronizer.',
        metrics: { framesAccepted: 1248, rejectedLateFrames: 11 },
      });
    case '/api/baseline':
      return success<WorkflowData>(endpoint, {
        stage: 'baseline',
        state: 'completed',
        summary: 'Baseline drift benchmark established.',
        metrics: { translationRmse: 0.012, rotationDeg: 0.31 },
      });
    case '/api/policy':
      return success<WorkflowData>(endpoint, {
        stage: 'policy',
        state: 'completed',
        summary: 'Policy gates evaluated successfully.',
        metrics: { itar: 'pass', gdpr: 'pass', iso13849: 'pass' },
      });
    case '/api/audit':
      return success<WorkflowData>(endpoint, {
        stage: 'audit',
        state: 'completed',
        summary: 'Audit pipeline finished without blocking violations.',
        metrics: { evidenceArtifacts: 6, unresolved: 0 },
      });
    case '/api/quarantine':
      return success<WorkflowData>(endpoint, {
        stage: 'quarantine',
        state: 'completed',
        summary: 'Anomalous frames isolated.',
        metrics: { quarantinedFrames: 4, restored: 4 },
      });
    case '/api/dispatch':
      return success<WorkflowData>(endpoint, {
        stage: 'dispatch',
        state: 'completed',
        summary: 'Runtime dispatch target accepted by edge scheduler.',
        metrics: { target: 'edge-fleet-canary', rollout: 0.1 },
      });
    case '/mcp':
      return success<McpDescriptorData>(endpoint, {
        protocol: 'mcp',
        version: '1.0',
        server: 'lingbot-map-mcp',
        capabilities: ['health', 'scan-summary', 'policy-status'],
      });
    case '/mcp/health':
      return success<HealthData>(endpoint, {
        status: 'ok',
        uptimeHint: 'stable',
      });
    case '/.well-known/mcp.json':
      return success<McpDescriptorData>(endpoint, {
        protocol: 'mcp',
        version: '1.0',
        server: 'lingbot-map-mcp',
        capabilities: ['health', 'scan-summary', 'policy-status'],
      });
  }
};

export const resolveEndpointResponse = (
  path: string,
  method: string,
  authorizationHeader?: string,
): { status: number; body: ApiResponse<unknown> } => {
  if (method !== 'GET') {
    return {
      status: 405,
      body: failure(path, { required: false, scheme: 'None' }, 'METHOD_NOT_ALLOWED', 'Only GET is supported.'),
    };
  }

  const endpoint = asEndpoint(path);
  if (!endpoint) {
    return {
      status: 404,
      body: failure(path, { required: false, scheme: 'None' }, 'NOT_FOUND', 'Endpoint not implemented.'),
    };
  }

  const auth = endpointAuth[endpoint];
  if (auth.required && !authTokenValid(authorizationHeader)) {
    return {
      status: 401,
      body: failure(endpoint, auth, 'UNAUTHORIZED', 'Bearer token required for this endpoint.'),
    };
  }

  return {
    status: 200,
    body: endpointPayload(endpoint),
  };
};
