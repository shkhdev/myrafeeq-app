import { AppShell } from "@/components/AppShell";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProviders } from "@/providers/AppProviders";

export function App() {
  return (
    <AppProviders>
      <ErrorBoundary name="app-root">
        <AppShell />
      </ErrorBoundary>
    </AppProviders>
  );
}
