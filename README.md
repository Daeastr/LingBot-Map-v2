# LingBot-Map v2

LingBot-Map v2 is an ACDP workflow console that validates and executes a secure edge pipeline from scan intake through policy and dispatch decisions.

## Purpose

The app provides a staged operator experience for:
- Endpoint health and runtime verification on initial load.
- Optional authentication handoff for protected workflow routes.
- CVE ingestion and scan execution.
- Baseline and policy evaluation.
- Audit, quarantine, and dispatch pipeline completion.
- Summary and endpoint-level status reporting.

## Installation

### Prerequisites
- Node.js 20+
- npm 10+

### Setup
```bash
npm install
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | No | Optional absolute base URL for API calls. Defaults to same-origin routes. |
| `VITE_BASE_PATH` | No | Optional UI base path for subpath deployments. |
| `VITE_AUTH_EMAIL` | No | Operator email used by the client auth gate (default `admin@lingbot.io`). |
| `VITE_AUTH_PASSWORD` | No | Operator password used by the client auth gate (default `P@ssword1`). |

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run type-check
```

## Happy Path Workflow

1. Initial load probes core API and MCP routes.
2. App determines whether workflow routes require authentication.
3. In production fallback mode, workflow routes are public and execute without token exchange.
4. CVE ingestion and scan stage runs (`/api/scan`, `/api/ingest`).
5. Baseline and policy stage runs (`/api/baseline`, `/api/policy`).
6. Detection stage runs (`/api/audit`, `/api/quarantine`, `/api/dispatch`).
7. Results summary displays endpoint readiness and errors.

## API Endpoints

### Core Endpoints

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api` | No |
| GET | `/api/health` | No |
| GET | `/api/status` | No |
| GET | `/api/version` | No |
| GET | `/api/info` | No |

### ACDP Workflow Endpoints

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/scan` | No |
| GET | `/api/ingest` | No |
| GET | `/api/baseline` | No |
| GET | `/api/policy` | No |
| GET | `/api/audit` | No |
| GET | `/api/quarantine` | No |
| GET | `/api/dispatch` | No |

## MCP Exposure

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/mcp` | MCP descriptor via rewrite to API route |
| GET | `/mcp/health` | MCP health surface |
| GET | `/.well-known/mcp.json` | MCP well-known descriptor |

The deployment uses `vercel.json` rewrites to static JSON artifacts in `public/static-api` for API and MCP route stability.

## Architecture Overview

- `src/contracts/api.ts`: strict contracts for endpoint identity, auth policy, and typed success/error envelopes.
- `src/lib/apiClient.ts`: typed frontend API caller with robust JSON/text fallback parsing.
- `src/App.tsx`: end-to-end ACDP workflow UI (initial load, auth handling, staged execution, results).
- `dev-api-plugin.ts`: local Vite middleware for API contract simulation during development.
- `api/index.ts` and `api/[...slug].ts`: serverless handlers for development/runtime parity.
- `vercel.json`: route rewrites for MCP exposure.

## Troubleshooting

- If `/api` is unavailable, the UI will remain in an error state for initial load. Validate deployment logs and serverless function runtime.
- If a deployment returns function invocation errors, verify that `vercel.json` rewrites to `public/static-api` are present and active.
- If routes return non-JSON error pages, the client now captures and surfaces response details in endpoint status.
- If running in purely static hosting, serverless API routes are not executed. Use Vercel or set `VITE_API_BASE_URL` to an external API runtime.
- If MCP endpoints are missing, verify `vercel.json` rewrite deployment and that API functions are healthy.

## Deployment Notes

- Recommended hosting: Vercel (Vite build + serverless API handlers).
- Build output: `dist`.
- Keep frontend and API runtime on the same origin when possible to avoid CORS and auth forwarding drift.
