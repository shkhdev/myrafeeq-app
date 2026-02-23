# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js on localhost:3000)
npm run build        # Production build
npm run lint         # Biome check (lint + format validation)
npm run lint:fix     # Biome auto-fix
npm run format       # Biome format --write
npm run type-check   # TypeScript strict check (tsc --noEmit)
```

No test runner is configured yet (vitest and playwright are in devDependencies but lack config files).

## Architecture

**MyRafeeq** is a Telegram Mini App (Islamic companion) built with Next.js 16, React 19, and the Telegram Mini Apps SDK. It runs as a single-page client-side app inside Telegram's webview.

### Provider Stack

`RootLayout` → `AppProviders` (all client-side):
1. **TelegramProvider** — Initializes `@telegram-apps/sdk-react`: mocks the Telegram env in dev, calls `sdk.init()` in production, expands viewport, disables swipes, reads user language. Renders nothing until SDK init completes.
2. **ThemeProvider** — Applies `.dark` class to `<html>`. Inside Telegram (`.tg-app`), defers to SDK's dark mode. Outside Telegram, uses zustand-persisted user preference with system fallback.
3. **QueryProvider** — TanStack React Query client (1min stale time, 1 retry).
4. **IntlProvider** — Client-side i18n via `next-intl`. Loads message JSON dynamically based on zustand locale store. Caches loaded bundles in a `Map`.

### Telegram SDK Access Pattern

The SDK is dynamically imported everywhere (never statically imported) to avoid SSR issues. `src/hooks/useTelegramSDK.ts` provides a singleton `getSDK()` promise. All SDK interactions (cloud storage, main button, back button, haptics) go through hooks in `src/hooks/` that call `getSDK()` and guard with `.isAvailable()` checks.

### State Management (Zustand)

- `locale-store` — persisted (`localStorage`), holds `SupportedLocale`
- `theme-store` — persisted, holds `ThemePreference` (light/dark/system)
- `onboarding-store` — ephemeral, tracks onboarding step + user selections (city, notifications, prayer prefs)

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
- Locale is auto-detected from Telegram user's `language_code` on init, persisted in zustand
- `next-intl` is configured with a server request config (`src/i18n/request.ts`) that defaults to `en`, but actual runtime locale is driven client-side by the IntlProvider

### Key Conventions

- **React Compiler** is enabled (`reactCompiler: true` in next.config.ts)
- **Biome** for linting/formatting (not ESLint/Prettier): double quotes, trailing commas, semicolons, 2-space indent, 100-char line width
- **`@/*` path alias** maps to `./src/*`
- **TypeScript strict mode** with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`
- All imports of types must use `import type` (enforced by both TS and Biome)
- Use `"use client"` directive on all interactive components — this is a client-heavy Telegram Mini App
