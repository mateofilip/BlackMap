# AGENTS.md — BlackMap

## Stack
- Astro 5.12 + `@astrojs/react` + React 19 + TailwindCSS 4 + Leaflet 1.9 / react-leaflet 5. Single-page IP geolocation app.
- Single entry: `src/pages/index.astro:1` renders `src/components/Home.tsx:18` via `<Home client:only="react" />` — required because Leaflet and `localStorage` are browser-only (SSR will break without `client:only`).

## Commands
- Package manager is **pnpm** (`pnpm-lock.yaml` present) even though README says `npm`. Use `pnpm install`.
- `pnpm dev` / `pnpm astro dev` — dev server at `http://localhost:4321` (see `.vscode/launch.json:4`).
- `pnpm build` — `astro build` → `dist/`; `pnpm preview` — preview build.
- No test, lint, or typecheck scripts. `tsconfig.json:2` extends `astro/tsconfigs/strict` with `jsx: react-jsx`.
- Formatter: Prettier with `prettier-plugin-astro` + `prettier-plugin-tailwindcss` (`.prettierrc:2`). No ESLint config.

## Architecture
- `src/pages/index.astro:10` — thin wrapper, imports `src/styles/global.css:1` and `src/layouts/Layout.astro:1`.
- `src/components/Home.tsx:71` — all app logic: fetches `https://api.ipquery.io/${ip}?format=json`, validates IPv4/IPv6 via regex (`Home.tsx:63`), manages search history in `localStorage` (`Home.tsx:33`), shows toasts via `sonner`.
- `src/components/IPMap.tsx:31` — Leaflet map; `MapUpdater` (`IPMap.tsx:13`) calls `map.setView` on lat/lon change; custom marker uses `public/navigation-pin.png` via `divIcon`; tiles are CARTO `dark_all` (`IPMap.tsx:34`) with `PUBLIC_CARTO_API_KEY` as `?key=` — zoom/attribution controls hidden via CSS (`global.css:27`).
- `src/components/StackInfo.tsx:1` — static info modal, no logic dependencies.
- `src/styles/global.css:1` — `@import "tailwindcss"` (Tailwind v4 Vite plugin, no `tailwind.config.*` file). Fonts loaded from `public/texgyreheros-*.otf` via `@font-face`. Leaflet overrides and animations defined here.
- `astro.config.mjs:8` — Vite `tailwindcss()` plugin + `react()` integration only.

## Conventions & Quirks
- Tailwind v4 via `@tailwindcss/vite` — do not add `tailwind.config.js`; configure via CSS/vite only. **Only canonical Tailwind classes** — no arbitrary values (`[123px]`), no custom CSS except `src/styles/global.css:1` leaflet/animation overrides.
- `.env` is gitignored. `PUBLIC_API_KEY` is legacy/unused (`Home.tsx:75` uses ipquery.io without key). `PUBLIC_CARTO_API_KEY` is **required** for CARTO tiles — read in `src/components/IPMap.tsx:32` as `?key=` param; never commit `.env`.
- `pnpm-workspace.yaml:1` only allows builds for `@tailwindcss/oxide`, `esbuild`, `sharp` — nothing else monorepo-related.
- `dist/` and `.astro/` are generated — never edit; `.astro/types.d.ts` is auto-generated.
- Search history stores max 4 entries in `localStorage` key `searchHistory` (`Home.tsx:48`).

## Gotchas
- Any component touching `window`, `document`, `localStorage`, or Leaflet must be `client:only` — SSR will fail otherwise.
- `react-leaflet` + `leaflet/dist/leaflet.css` must be imported in a client component (`Home.tsx:2`), not in an `.astro` file.
- No CI workflows (`.github/` does not exist).

## Workflow
- Do **not** run `pnpm build` / `pnpm preview` unless user explicitly says to commit or push.
- Do **not** commit, amend, push, or create PRs unless user explicitly says so — even if a task appears complete.
