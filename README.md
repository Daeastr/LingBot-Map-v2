# LingBot-Map v2

LingBot-Map v2 is an edge-native workflow console that executes a synchronized ACDP pipeline: initial platform checks, authentication, CVE/scan ingestion, baseline/policy evaluation, and detection dispatch.

## Installation

### Prerequisites
- Node.js 20+
- npm 10+

### Setup
```bash
npm install
cp .env.example .env
```

## Environment variables
| Variable | Required | Runtime impact if missing |
|---|---|---|
| `VITE_API_BASE_URL` | Optional | Uses same-origin API paths (recommended for local dev and Vercel rewrites). |
| `VITE_BASE_PATH` | Optional | Defaults to `/`; set for sub-path deployments such as GitHub Pages. |
| `VITE_AUTH_EMAIL` | Optional | Defaults to `admin@lingbot.io` for local/operator auth gate. |
| `VITE_AUTH_PASSWORD` | Optional | Defaults to `P@ssword1` for local/operator auth gate. |

## Run commands
```bash
npm run dev
npm run build
npm run preview
npm run type-check
```

## Happy path workflow
1. Initial load probes core API and MCP endpoints.
2. Operator authentication gate issues bearer token for protected routes.
3. CVE ingestion + scan stage executes (`/api/scan`, `/api/ingest`).
4. Baseline + policy stage executes (`/api/baseline`, `/api/policy`).
5. Detection pipeline executes (`/api/audit`, `/api/quarantine`, `/api/dispatch`).
6. Results view presents endpoint status and stage outputs.

## API endpoints
### Core
- `GET /api`
- `GET /api/health`
- `GET /api/status`
- `GET /api/version`
- `GET /api/info`

### MDSOS / ACDP workflow
- `GET /api/scan`
- `GET /api/baseline`
- `GET /api/policy`
- `GET /api/audit`
- `GET /api/quarantine`
- `GET /api/ingest`
- `GET /api/dispatch`

### MCP exposure
- `GET /mcp`
- `GET /mcp/health`
- `GET /.well-known/mcp.json`

## MCP exposure details
MCP endpoints are implemented through backend route handling and Vercel rewrites. A static fallback descriptor is also shipped at `public/.well-known/mcp.json` for static hosting compatibility.

## Architecture overview
- `src/contracts/api.ts` defines strict endpoint, auth, success, and error contracts.
- `src/lib/apiClient.ts` provides typed frontend endpoint calls and auth flow.
- `dev-api-plugin.ts` provides local development endpoint implementation in the Vite server.
- `api/index.ts` and `api/[...slug].ts` provide serverless route implementations for deployment.
- `src/App.tsx` implements synchronized ACDP workflow UI, loading states, and endpoint error states.

## Deployment configuration
### Vercel
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Rewrites configured in `vercel.json` for `/mcp` and `/.well-known/mcp.json`.

### GitHub Pages
- Static compatibility: supported (`dist` output)
- Base path: set `VITE_BASE_PATH` when deploying under a subpath
- Backend note: static hosting does not execute serverless routes; UI fallback states handle unavailable runtime APIs.

## Troubleshooting
- If protected endpoints return `UNAUTHORIZED`, authenticate first with operator credentials.
- If API calls fail in static hosting, deploy on Vercel or provide external `VITE_API_BASE_URL`.
- If local port conflicts occur, run `npm run dev -- --port <port>`.
- If type issues appear, run `npm run type-check` and verify strict TypeScript contract changes.
