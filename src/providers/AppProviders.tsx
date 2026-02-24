import { ErrorBoundary } from "@/components/ErrorBoundary";
import { usePreferencesSync } from "@/hooks/usePreferencesSync";
import { AuthProvider } from "./AuthProvider";
import { IntlProvider } from "./IntlProvider";
import { QueryProvider } from "./QueryProvider";
import { TelegramProvider } from "./TelegramProvider";
import { ThemeProvider } from "./ThemeProvider";

function SyncBridge({ children }: { children: React.ReactNode }) {
  usePreferencesSync();
  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TelegramProvider>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <SyncBridge>
              <IntlProvider>
                <ErrorBoundary>{children}</ErrorBoundary>
              </IntlProvider>
            </SyncBridge>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </TelegramProvider>
  );
}
