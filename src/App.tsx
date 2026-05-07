import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ApiEndpoint, ApiResponse, requiredEndpoints } from './contracts/api';
import { authenticateOperator, callEndpoint } from './lib/apiClient';

type WorkflowStage =
  | 'initial-load'
  | 'authentication'
  | 'ingestion-scan'
  | 'baseline-policy'
  | 'detection-pipeline'
  | 'results';

type EndpointMap = Partial<Record<ApiEndpoint, ApiResponse<unknown>>>;

const endpointGroups: Record<Exclude<WorkflowStage, 'initial-load' | 'authentication' | 'results'>, ApiEndpoint[]> = {
  'ingestion-scan': ['/api/scan', '/api/ingest'],
  'baseline-policy': ['/api/baseline', '/api/policy'],
  'detection-pipeline': ['/api/audit', '/api/quarantine', '/api/dispatch'],
};

const coreProbeEndpoints: ApiEndpoint[] = [
  '/api',
  '/api/health',
  '/api/status',
  '/api/version',
  '/api/info',
  '/mcp',
  '/mcp/health',
  '/.well-known/mcp.json',
];

const authProbeEndpoint: ApiEndpoint = '/api/scan';

const stageOrder: WorkflowStage[] = [
  'initial-load',
  'authentication',
  'ingestion-scan',
  'baseline-policy',
  'detection-pipeline',
  'results',
];

const stageLabel: Record<WorkflowStage, string> = {
  'initial-load': 'Initial Load',
  authentication: 'Authentication',
  'ingestion-scan': 'CVE Ingestion / Scan',
  'baseline-policy': 'Baseline / Policy Evaluation',
  'detection-pipeline': 'Detection Pipeline Execution',
  results: 'Results & Summary',
};

const summarizeEndpointState = (response?: ApiResponse<unknown>): string => {
  if (!response) return 'Not executed';
  if (response.ok) return 'Success';
  return `Error: ${response.error.code}`;
};

const isAuthError = (response?: ApiResponse<unknown>): boolean => {
  if (!response || response.ok) return false;
  return response.error.code === 'UNAUTHORIZED';
};

const isOperational = (response?: ApiResponse<unknown>): boolean => {
  if (!response) return false;
  if (response.ok) return true;
  return response.error.code === 'UNAUTHORIZED';
};

const statusMessage = (response?: ApiResponse<unknown>): string => {
  if (!response) return 'Not called';
  if (response.ok) return 'Operational';
  return response.error.message;
};

export default function App() {
  const [stage, setStage] = useState<WorkflowStage>('initial-load');
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState<boolean>(true);
  const [backendPresent, setBackendPresent] = useState<boolean | null>(null);
  const [email, setEmail] = useState('admin@lingbot.io');
  const [password, setPassword] = useState('P@ssword1');
  const [datasetRef, setDatasetRef] = useState('dataset://war-pro-v4.1');
  const [policyRef, setPolicyRef] = useState('policy://itar-ga-7');
  const [scanRef, setScanRef] = useState('scan://cve-bundle-2026.05');
  const [endpointResults, setEndpointResults] = useState<EndpointMap>({});

  const missingEndpoints = useMemo(
    () => requiredEndpoints.filter((endpoint) => !isOperational(endpointResults[endpoint])),
    [endpointResults],
  );

  const runInitialLoad = async (): Promise<void> => {
    setIsLoading(true);
    setGlobalError(null);

    const coreResults = await Promise.all(coreProbeEndpoints.map(async (endpoint) => [endpoint, await callEndpoint(endpoint)] as const));
    const authProbeResult = await callEndpoint(authProbeEndpoint);

    setEndpointResults((current) => {
      const next = { ...current };
      for (const [endpoint, response] of coreResults) {
        next[endpoint] = response;
      }
      next[authProbeEndpoint] = authProbeResult;
      return next;
    });

    const hasRuntime = coreResults.some(([, response]) => response.ok);
    setBackendPresent(hasRuntime);

    const authNeeded = isAuthError(authProbeResult);
    setAuthRequired(authNeeded);

    const failedCore = coreResults.filter(([, response]) => !response.ok);
    if (!hasRuntime) {
      setGlobalError('Backend is not reachable at /api. Verify serverless deployment and base URL configuration.');
      setStage('initial-load');
      setIsLoading(false);
      return;
    }

    if (failedCore.length > 0) {
      setGlobalError('Some core endpoints are failing. You can continue, but stage execution may be degraded.');
    }

    setStage(authNeeded ? 'authentication' : 'ingestion-scan');
    setIsLoading(false);
  };

  useEffect(() => {
    void runInitialLoad();
  }, []);

  const executeStage = async (target: Exclude<WorkflowStage, 'initial-load' | 'authentication' | 'results'>): Promise<void> => {
    setIsLoading(true);
    setGlobalError(null);

    const endpoints = endpointGroups[target];
    const stageToken = authRequired ? token ?? undefined : undefined;
    const results = await Promise.all(endpoints.map(async (endpoint) => [endpoint, await callEndpoint(endpoint, stageToken)] as const));

    setEndpointResults((current) => {
      const next = { ...current };
      for (const [endpoint, response] of results) {
        next[endpoint] = response;
      }
      return next;
    });

    const failed = results.find(([, response]) => !response.ok);
    if (failed) {
      setGlobalError(`Stage failed at ${failed[0]}. Review endpoint status and retry.`);
      setIsLoading(false);
      return;
    }

    if (target === 'ingestion-scan') {
      setStage('baseline-policy');
    } else if (target === 'baseline-policy') {
      setStage('detection-pipeline');
    } else {
      setStage('results');
    }

    setIsLoading(false);
  };

  const handleAuth = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setGlobalError(null);

    const auth = authenticateOperator(email, password);
    if (!auth.ok || !auth.token) {
      setGlobalError(auth.message ?? 'Authentication failed.');
      return;
    }

    setToken(auth.token);
    setStage('ingestion-scan');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold">LingBot-Map v2 ACDP Workflow Console</h1>
          <p className="text-sm text-slate-300">
            Implements initial load, authentication, scan/ingest, baseline/policy evaluation, detection pipeline, and result summary.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-xs font-medium space-y-1">
            <span>CVE / Scan Intake</span>
            <input
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
              value={scanRef}
              onChange={(event) => setScanRef(event.target.value)}
            />
          </label>
          <label className="text-xs font-medium space-y-1">
            <span>Dataset Intake</span>
            <input
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
              value={datasetRef}
              onChange={(event) => setDatasetRef(event.target.value)}
            />
          </label>
          <label className="text-xs font-medium space-y-1">
            <span>Policy Intake</span>
            <input
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
              value={policyRef}
              onChange={(event) => setPolicyRef(event.target.value)}
            />
          </label>
        </div>

        <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-sm font-semibold mb-3">Workflow Stages</h2>
          <ol className="space-y-2">
            {stageOrder.map((value) => (
              <li key={value} className="text-sm flex items-center justify-between rounded bg-slate-950 px-3 py-2 border border-slate-800">
                <span>{stageLabel[value]}</span>
                <span className="text-xs text-slate-400">
                  {value === stage ? 'Current' : stageOrder.indexOf(value) < stageOrder.indexOf(stage) ? 'Completed' : 'Pending'}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {backendPresent === false && (
          <section className="rounded-lg border border-rose-700 bg-rose-950/40 p-4 space-y-3">
            <h2 className="text-sm font-semibold">Backend Unavailable</h2>
            <p className="text-xs text-rose-200">
              The `/api` route is missing or unreachable from this deployment. Fix backend routing before running the ACDP pipeline.
            </p>
            <button
              className="rounded bg-rose-700 px-4 py-2 text-sm font-medium hover:bg-rose-600 disabled:opacity-50"
              onClick={() => void runInitialLoad()}
              disabled={isLoading}
            >
              Retry Initial Load
            </button>
          </section>
        )}

        {stage === 'authentication' && authRequired && (
          <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="text-sm font-semibold mb-3">Authentication</h2>
            <form className="grid gap-3 md:grid-cols-3" onSubmit={handleAuth}>
              <input
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="operator email"
                type="email"
                required
              />
              <input
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="password"
                type="password"
                required
              />
              <button
                className="rounded bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500 disabled:opacity-50"
                type="submit"
                disabled={isLoading}
              >
                Authenticate
              </button>
            </form>
          </section>
        )}

        {stage === 'ingestion-scan' && (
          <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 space-y-3">
            <h2 className="text-sm font-semibold">CVE Ingestion / Scan</h2>
            <p className="text-xs text-slate-300">Using {scanRef} and {datasetRef}. Auth: {authRequired ? 'required' : 'not required'}.</p>
            <button
              className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50"
              onClick={() => void executeStage('ingestion-scan')}
              disabled={isLoading}
            >
              Execute Ingestion + Scan
            </button>
          </section>
        )}

        {stage === 'baseline-policy' && (
          <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 space-y-3">
            <h2 className="text-sm font-semibold">Baseline / Policy Evaluation</h2>
            <p className="text-xs text-slate-300">Evaluating against {policyRef}</p>
            <button
              className="rounded bg-amber-600 px-4 py-2 text-sm font-medium hover:bg-amber-500 disabled:opacity-50"
              onClick={() => void executeStage('baseline-policy')}
              disabled={isLoading}
            >
              Execute Baseline + Policy
            </button>
          </section>
        )}

        {stage === 'detection-pipeline' && (
          <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 space-y-3">
            <h2 className="text-sm font-semibold">Detection Pipeline</h2>
            <p className="text-xs text-slate-300">Runs audit, quarantine, and dispatch workflow.</p>
            <button
              className="rounded bg-rose-600 px-4 py-2 text-sm font-medium hover:bg-rose-500 disabled:opacity-50"
              onClick={() => void executeStage('detection-pipeline')}
              disabled={isLoading}
            >
              Execute Detection Pipeline
            </button>
          </section>
        )}

        {stage === 'results' && (
          <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 space-y-3">
            <h2 className="text-sm font-semibold">Results</h2>
            <p className="text-xs text-slate-300">All happy-path stages executed. Review endpoint outputs below.</p>
          </section>
        )}

        {isLoading && <p className="text-sm text-slate-300">Loading...</p>}
        {globalError && <p className="text-sm text-rose-400">{globalError}</p>}

        <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-sm font-semibold mb-3">Endpoint Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-left border-b border-slate-700">
                  <th className="pb-2 pr-3">Endpoint</th>
                  <th className="pb-2 pr-3">State</th>
                  <th className="pb-2">Message</th>
                </tr>
              </thead>
              <tbody>
                {requiredEndpoints.map((endpoint) => {
                  const response = endpointResults[endpoint];
                  const message = statusMessage(response);
                  return (
                    <tr key={endpoint} className="border-b border-slate-800">
                      <td className="py-2 pr-3 font-mono">{endpoint}</td>
                      <td className="py-2 pr-3">{summarizeEndpointState(response)}</td>
                      <td className="py-2">{message}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {missingEndpoints.length > 0 && (
            <p className="mt-3 text-xs text-amber-300">
              Missing or failing endpoints: {missingEndpoints.join(', ')}
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
