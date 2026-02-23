# MyRafeeq Design System

## Tech Stack

| Technology                 | Version | Purpose                                     |
|----------------------------|---------|---------------------------------------------|
| Next.js                    | 16.x    | App framework (App Router)                  |
| React                      | 19.x    | UI runtime + React Compiler                 |
| Tailwind CSS               | 4.x     | Utility-first styling                       |
| @telegram-apps/sdk-react   | 3.x     | Telegram Mini App SDK                       |
| @telegram-apps/telegram-ui | 2.x     | Telegram UI components                      |
| Zustand                    | 5.x     | Client state management                     |
| TanStack React Query       | 5.x     | Server state / data fetching                |
| TypeScript                 | 5.x     | Type safety (strict + verbatimModuleSyntax) |

## Token Architecture

### Three-Layer System

1. **Primitives** (`src/styles/tokens/primitives.css`) — Raw oklch color scales, spacing grid, radii, shadows
2. **Semantic** (`src/styles/tokens/semantic.css`) — Meaningful names (`--sem-surface`, `--sem-primary`) mapped to
   primitives
3. **Theme Overrides** — Telegram (`src/styles/themes/telegram.css`) and Islamic seasons (
   `src/styles/themes/islamic.css`)

### Semantic Token Table

| Tailwind Class          | CSS Variable                | Light                | Dark                 | Telegram Source                      |
|-------------------------|-----------------------------|----------------------|----------------------|--------------------------------------|
| `bg-surface`            | `--color-surface`           | `#ffffff`            | `#121212`            | `--tg-theme-bg-color`                |
| `bg-surface-secondary`  | `--color-surface-secondary` | `#f5f5f5`            | `#1e1e1e`            | `--tg-theme-secondary-bg-color`      |
| `text-on-surface`       | `--color-on-surface`        | `#1a1a1a`            | `#e5e5e5`            | `--tg-theme-text-color`              |
| `text-on-surface-muted` | `--color-on-surface-muted`  | `#6b7280`            | `#9ca3af`            | `--tg-theme-hint-color`              |
| `bg-primary`            | `--color-primary`           | oklch(0.48 0.12 155) | oklch(0.68 0.14 155) | `--tg-theme-button-color`            |
| `text-on-primary`       | `--color-on-primary`        | `#ffffff`            | `#ffffff`            | `--tg-theme-button-text-color`       |
| `text-accent`           | `--color-accent`            | oklch(0.72 0.12 85)  | oklch(0.82 0.10 85)  | `--tg-theme-accent-text-color`       |
| `text-destructive`      | `--color-destructive`       | `#ef4444`            | `#f87171`            | `--tg-theme-destructive-text-color`  |
| `border-border`         | `--color-border`            | `#e5e7eb`            | `#374151`            | `--tg-theme-section-separator-color` |
| `border-border-focus`   | `--color-border-focus`      | oklch(0.48 0.12 155) | oklch(0.68 0.14 155) | `--tg-theme-accent-text-color`       |

### Spacing

4px grid: `--spacing: 0.25rem`. Use Tailwind spacing utilities (`p-4` = 16px, `gap-2` = 8px).

## Theme Cascade

Priority order (highest wins):

1. **Telegram** — `.tg-app` class present → `--tg-theme-*` vars override semantic tokens
2. **Islamic Season** — `data-season` attribute on `<html>` overrides specific tokens
3. **User Preference** — Zustand persisted store (`light` / `dark` / `system`)
4. **System** — `prefers-color-scheme` media query

## Component Guidelines

### Colors

- **Always use semantic Tailwind classes**: `bg-surface`, `text-on-surface`, `bg-primary`, etc.
- **Never use raw colors** like `bg-white`, `text-gray-500`, or hardcoded hex values.
- The semantic tokens automatically adapt to light/dark/Telegram themes.

### Typography

- Use `font-sans` (Inter) for all UI text.
- Fluid size tokens available as CSS vars: `--text-display` through `--text-caption`.

### Touch Targets

- Minimum **44px** touch target for all interactive elements.
- Use `min-h-11 min-w-11` (44px) on buttons and tap targets.

### Focus States

- All interactive elements must have visible `focus-visible` rings.
- Use `focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2`.

### Borders & Radii

- Default card radius: `rounded-lg` (0.75rem).
- Use `border-border` for all border colors.

### Shadows

- Cards: `shadow-[var(--shadow-card)]`
- Elevated surfaces: `shadow-[var(--shadow-elevated)]`

### Motion

- Transitions: `transition-colors duration-[var(--duration-normal)] ease-[var(--ease-fluid)]`
- Keep animations under 400ms. Respect `prefers-reduced-motion`.

## Platform Behavior (Telegram)

### MainButton

- Use Telegram's `MainButton` for primary actions (submit, confirm, proceed).
- Do not render a custom primary CTA button when `MainButton` is available.

### Safe Areas

- Telegram provides `--tg-viewport-stable-height`. Use for full-height layouts.
- Account for bottom safe area in fixed-position elements.

### Haptic Feedback

- Use `hapticFeedback.impactOccurred("medium")` for button taps.
- Use `hapticFeedback.notificationOccurred("success")` for confirmations.
- Use `hapticFeedback.selectionChanged()` for toggle/selection changes.

### Back Button

- Use Telegram's `BackButton` for navigation instead of custom back buttons.

## DO / DON'T

### DO

- Use semantic color tokens (`bg-surface`, `text-primary`, etc.)
- Use `"use client"` directive on components that use hooks or browser APIs
- Use `import type { ... }` for type-only imports (verbatimModuleSyntax)
- Use `@/` path alias for imports (`@/stores/theme-store`)
- Test in both light and dark mode
- Test inside Telegram and standalone browser
- Use `focus-visible` (not `focus`) for keyboard focus indicators
- Compose providers via `AppProviders` — don't add providers ad-hoc in layout

### DON'T

- Don't use raw Tailwind colors (`bg-green-500`, `text-gray-400`)
- Don't use `@media (prefers-color-scheme: dark)` — use `.dark` class variant
- Don't import Telegram SDK at module level — always dynamic `await import()`
- Don't skip `suppressHydrationWarning` on `<html>` — theme classes are added client-side
- Don't create circular CSS variable references in `@theme inline`
- Don't use `px` units for spacing — use the `rem`-based spacing scale
- Don't put layout-level providers inside page components
