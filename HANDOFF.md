PROJECT IDENTITY
- Name: LingBot-Map v2
- Type: Vite + React + TypeScript workflow console with serverless endpoint contract
- Primary UI entry: `src/App.tsx`
- Primary endpoint contract: `src/contracts/api.ts`

ENTRY & BUILD CONTRACT
- Entry HTML: `index.html`
- Frontend bootstrap: `src/main.tsx`
- Application root: `src/App.tsx`
- Dev command: `npm run dev`
- Build command: `npm run build`
- Preview command: `npm run preview`
- Type validation command: `npm run type-check`

VERIFIED COMMANDS
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run type-check`

ENVIRONMENT VARIABLES
- `VITE_API_BASE_URL` | Optional | Missing behavior: defaults to same-origin API calls
- `VITE_BASE_PATH` | Optional | Missing behavior: defaults to `/`
- `VITE_AUTH_EMAIL` | Optional | Missing behavior: defaults to `admin@lingbot.io`
- `VITE_AUTH_PASSWORD` | Optional | Missing behavior: defaults to `P@ssword1`

DEPENDENCY MODEL
- Package manager: npm
- Runtime dependencies: defined in `package.json` `dependencies`
- Build/dev dependencies: defined in `package.json` `devDependencies`
- Lockfile authority: `package-lock.json`

ARCHITECTURAL STATUS
- Typed endpoint contract implemented: `src/contracts/api.ts`
- Frontend endpoint client implemented: `src/lib/apiClient.ts`
- Local backend runtime implemented in Vite middleware: `dev-api-plugin.ts`
- Serverless backend runtime implemented: `api/index.ts`, `api/[...slug].ts`
- UI happy-path workflow implemented: initial load, auth, scan/ingest, baseline/policy, detection, results
- Endpoint error/loading/fallback states implemented in `src/App.tsx`

DEPLOYMENT CONFIGURATION
- Vercel framework preset: Vite
- Vercel build command: `npm run build`
- Vercel output directory: `dist`
- Vercel rewrite config: `vercel.json`
- GitHub Pages static compatibility: supported via `dist`
- GitHub Pages base path: set `VITE_BASE_PATH` for non-root deployments

LIMITATIONS
- GitHub Pages cannot execute serverless endpoint handlers; runtime API must be provided by external backend or Vercel deployment.
- Authentication is operator credential gate with bearer-token contract for protected endpoints; no external identity provider integration is included.

COPILOT EXECUTION INSTRUCTIONS
- Use `src/contracts/api.ts` as the sole endpoint/auth/type authority.
- Keep endpoint list synchronized across UI, Vite middleware, and serverless handlers.
- Preserve strict TypeScript; run `npm run type-check` after modifications.
- Re-run `npm run build` after changing API contract, workflow UI, or deployment config.
- Update `.env.example`, README endpoint tables, and this contract when adding/changing env vars or endpoints.

FINAL STATUS
- Reconstructed codebase is synchronized across UI, backend endpoints, and deployment configuration.
- Required core, workflow, and MCP endpoints are implemented with typed success/error models and auth metadata.
- Deterministic handoff contract generated and aligned with current repository state.
