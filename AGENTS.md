## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

## 🚀 Initialization & PRD Directive

When initializing, reading this file, or when `/init` is invoked, you **MUST** immediately read and parse **`prd.md`** located in the workspace root before answering any queries, planning, or writing code. Treat `prd.md` as the single source of truth for the project's product vision, user roles, and feature specifications.

## Commands

* Dev: `npm run dev` (Turbopack) — build: `npm run build`
* Lint: `npm run lint` (`biome check`, read-only; `npm run lint -- --write` to fix)
* Format: `npm run format` (`biome format --write`)
* Typecheck: `npx tsc --noEmit` (no script defined; `strict` mode on)
* No test runner or test files exist in this repo.
* Verify with: lint → typecheck → build. Lint may already fail on pre-existing files — check whether diagnostics touch your changes before assuming you broke it.

## Tooling quirks

* Biome, not ESLint/Prettier. Do not add ESLint config or Prettier files.
* Tailwind v4 CSS-first: theme tokens live in `src/app/globals.css`; there is no `tailwind.config`. Loaded via `@tailwindcss/turbopack` rule in `next.config.ts`.
* `next.config.ts` enables React Compiler, `cacheComponents`, `partialPrefetching`, and `experimental.agentFeedback` — follow current Next 16 conventions (see the docs block above), not older patterns.

## UI components

* shadcn with style `base-nova` (`components.json`): primitives come from `@base-ui/react`, **not** Radix. Check `@base-ui/react/<name>` for prop APIs.
* Add components with `npx shadcn add <name>`. Path alias `@/*` → `src/*`; icons are `lucide-react`; class merge via the `cn` npm package (re-exported from `src/lib/utils.ts`).

## Auth (better-auth)

* Server config: `src/lib/auth.ts`; client: `src/lib/auth-client.ts`; HTTP handler: `src/app/api/auth/[...all]/route.ts` (catch-all for `toNextJsHandler`).
* `auth-client.ts` has a single `createAuthClient({ baseURL, plugins: [inferAdditionalFields] })` and re-exports `authClient`, `signIn`, `signUp`, `useSession`, `signOut` from it. Use those exports; do not create a second client.
* Required env (in gitignored `.env`; each clone needs its own): `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URL`. Mongo is whatever `MONGODB_URL` points at (Atlas in the current `.env`), **not** a hardcoded localhost URL.
* Google social provider is configured but `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are unset in `.env` — Google sign-in fails until they're added.
* Custom user field `role: "seeker" | "admin" | "recruiter"` is set at sign-up and read client-side as `session.user.role`.
* **No server-side route protection yet** — no middleware; dashboard pages rely on client `useSession()` only. Don't assume `/dashboard/*` enforces auth.

## Data backends (two separate services)

* Jobs CRUD calls an external API at `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:5000`) via `src/lib/api/jobs.ts` and `src/lib/actions/jobs.ts`. The jobs UI breaks unless that backend is running — it is not part of this repo.
* better-auth persists to MongoDB via `MONGODB_URL`. Auth API routes fail without a reachable Mongo.

## Layout / routes

* Single-package Next.js App Router app under `src/app/`. Real routes: `/` (`src/app/page.tsx`), `(auth)/sign-in` and `(auth)/sign-up`, role dashboards `dashboard/{seeker,recruiter,admin}` (recruiter has `add-jobs`, `manage-jobs` with `[id]`), plus the auth API catch-all. UI primitives under `src/components/ui/`.
* Role-based nav lives in `src/components/app-sidebar.tsx`. Its links mix casing (`/Dashboard/seeker` vs `/dashboard/recruiter`); actual route folders are all lowercase. Keep new links lowercase — case mismatches work on Windows but break on case-sensitive deploys.
