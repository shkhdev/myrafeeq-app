# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Type-check + production build (outputs to dist/)
npm run preview      # Preview production build locally
npm run lint         # Biome check (lint + format validation)
npm run lint:fix     # Biome auto-fix
npm run format       # Biome format --write
npm run type-check   # TypeScript strict check (tsc --noEmit)
```

No test runner is configured yet (vitest and playwright are in devDependencies but lack config files).

## Architecture

**MyRafeeq** is a Telegram Mini App (Islamic companion) built with Vite, React 19, and the Telegram Mini Apps SDK. It runs as a single-page client-side app inside Telegram's webview.

### Entry Points

- `index.html` — HTML shell (viewport meta, error handler, mounts `#root`)
- `src/main.tsx` — React root: imports global CSS, renders `<App />`
- `src/App.tsx` — Wraps `<AppShell />` in `<AppProviders />`

### Provider Stack

`App` → `AppProviders`:
1. **TelegramProvider** — Initializes `@telegram-apps/sdk-react`: mocks the Telegram env in dev, calls `sdk.init()` in production, expands viewport, disables swipes, reads user language. Renders nothing until SDK init completes.
2. **ThemeProvider** — Applies `.dark` class to `<html>`. Inside Telegram (`.tg-app`), defers to SDK's dark mode. Outside Telegram, uses zustand user preference with system fallback.
3. **QueryProvider** — TanStack React Query client (1min stale time, 1 retry).
4. **AuthProvider** — Validates Telegram `initData` with the backend, stores token in `auth-store`. If onboarded, fetches preferences from `GET /api/user/preferences` and hydrates all zustand stores. Blocks rendering until auth completes.
5. **SyncBridge** — Subscribes to preferences-store and theme-store changes, debounce-syncs them to `PUT /api/user/preferences` (500ms).
6. **IntlProvider** — Client-side i18n via `use-intl`. Loads message JSON dynamically based on zustand locale store. Caches loaded bundles in a `Map`.

### Telegram SDK Access Pattern

The SDK is dynamically imported everywhere (never statically imported). `src/hooks/useTelegramSDK.ts` provides a singleton `getSDK()` promise. All SDK interactions (cloud storage, main button, back button, haptics) go through hooks in `src/hooks/` that call `getSDK()` and guard with `.isAvailable()` checks.

### State Management (Zustand)

All stores are **ephemeral** (in-memory only, no `localStorage`). State is hydrated from the backend on app start and synced back on changes.

- `auth-store` — token, telegramId, onboardingCompleted (set after auth validation)
- `locale-store` — holds `SupportedLocale` (set from Telegram user's `language_code`)
- `theme-store` — holds `ThemePreference` (light/dark/system, hydrated from backend)
- `preferences-store` — all user preferences (city, prayer calc, notifications, etc.). Has a `hydrate()` action for bulk-setting from backend response. Changes auto-sync to backend via `usePreferencesSync`.
- `onboarding-store` — transient onboarding flow state (step, card index, user selections)
- `app-store` — UI navigation state (current screen)

### Design Token System (CSS Custom Properties)

Three-layer token architecture — use semantic tokens in components, not primitives:

1. **Primitives** (`src/styles/tokens/primitives.css`) — Raw color scales (Islamic green hue 155, gold hue 85, deep blue hue 255), radii, shadows, motion, spacing grid.
2. **Semantic** (`src/styles/tokens/semantic.css`) — Maps `--sem-*` vars (surface, primary, accent, etc.) to primitives for light/dark. Bridges to Tailwind via `@theme inline`.
3. **Theme overrides:**
   - `telegram.css` — `.tg-app` class maps `--tg-theme-*` CSS vars from Telegram → `--sem-*` tokens
   - `islamic.css` — `data-season` attribute (`ramadan`, `eid`, `hajj`) overrides for seasonal themes

Use Tailwind classes like `bg-surface`, `text-primary`, `text-on-surface-muted` — they resolve through the semantic layer.

### Internationalization

- 4 locales: `en`, `ar`, `uz`, `ru` (defined in `src/i18n/locale.ts`)
- Arabic (`ar`) is RTL
- Messages in `src/messages/{locale}.json`
- Locale is auto-detected from Telegram user's `language_code` on init
- `use-intl` provides `IntlProvider` and `useTranslations` hook — purely client-side

### Key Conventions

- **React Compiler** is enabled via `babel-plugin-react-compiler` in `vite.config.ts`
- **Biome** for linting/formatting (not ESLint/Prettier): double quotes, trailing commas, semicolons, 2-space indent, 100-char line width
- **`@/*` path alias** maps to `./src/*` (configured in both `tsconfig.json` and `vite.config.ts`)
- **TypeScript strict mode** with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`
- All imports of types must use `import type` (enforced by both TS and Biome)
- **Environment variables** use `VITE_` prefix (e.g. `VITE_API_URL`) accessed via `import.meta.env`
