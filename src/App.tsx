import * as Sentry from "@sentry/react";
import { AppShell } from "@/components/AppShell";
import { AppProviders } from "@/providers/AppProviders";

export function App() {
  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <AppProviders>
        <AppShell />
      </AppProviders>
    </Sentry.ErrorBoundary>
  );
}
