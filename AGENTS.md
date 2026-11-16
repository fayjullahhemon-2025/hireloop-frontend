## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

## 🚀 Initialization & PRD Directive

When initializing, reading this file, or when `/init` is invoked, you **MUST** immediately read and parse **`prd.md`** located in the workspace root before answering any queries, planning, or writing code. Treat `prd.md` as the single source of truth for the project's product vision, user roles, and feature specifications.

## Commands

* Dev: `npm run dev` (Turbopack) — build: `npm run build`
* Lint: `npm run lint` (`biome check`, read-only; add `--write` to fix)
* Format: `npm run format` (`biome format --write`)
* Typecheck: `npx tsc --noEmit` (no script defined; `strict` mode on)

## Tooling quirks

* Biome, not ESLint/Prettier. Do not add ESLint config or Prettier files.
* Tailwind v4 CSS-first: theme tokens live in `src/app/globals.css`; there is no `tailwind.config`. Loaded via `@tailwindcss/turbopack` rule in `next.config.ts`.
* `next.config.ts` enables React Compiler, `cacheComponents`, and `partialPrefetching` — follow current Next 16 conventions (see the docs block above), not older patterns.

### Tailwind Breakpoints Reference

| Prefix | Minimum Width (rem) | Minimum Width (px) | Target Media Query |
| :--- | :--- | :--- | :--- |
| `sm` | `40rem` | `640px` | `@media (width >= 40rem)` |
| `md` | `48rem` | `768px` | `@media (width >= 48rem)` |
| `lg` | `64rem` | `1024px` | `@media (width >= 64rem)` |
| `xl` | `80rem` | `1280px` | `@media (width >= 80rem)` |
| `2xl` | `96rem` | `1536px` | `@media (width >= 96rem)` |

## UI components

* shadcn with style `base-nova` (`components.json`): primitives come from `@base-ui/react`, **not** Radix. Check `@base-ui/react/<name>` for prop APIs.
* Add components with `npx shadcn add <name>`. Path alias `@/*` → `src/*`; icons are `lucide-react`; class merge via the `cn` npm package (re-exported from `src/lib/utils.ts`).

## Auth (better-auth)

* Server config: `src/lib/auth.ts`; client: `src/lib/auth-client.ts`; HTTP handler: `src/app/api/auth/[...all]/route.ts` (catch-all for `toNextJsHandler`).
* Mongo client is hardcoded to `mongodb://localhost:27017/database` — auth API routes require a local MongoDB running or they crash.
* `.env` only defines `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`. `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are read in `src/lib/auth.ts` but unset — the Google provider fails until they're added to `.env`.
* `src/lib/auth-client.ts` exports `signIn`/`signUp`/`useSession` from a second, default (no-`baseURL`) `createAuthClient()`; the `baseURL`-configured client is not destructured. Wire new hooks to the configured client if cross-origin auth matters.

## Layout

Single-package Next.js app. Only real entrypoints: `src/app/page.tsx`, `src/app/layout.tsx`, and the auth API route. UI primitives under `src/components/ui/`.