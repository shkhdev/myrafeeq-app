import { Toaster } from "sonner";
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
                {children}
                <Toaster
                  position="top-center"
                  toastOptions={{
                    style: {
                      background: "var(--sem-surface-elevated)",
                      color: "var(--sem-on-surface)",
                      border: "1px solid var(--sem-border)",
                    },
                  }}
                />
              </IntlProvider>
            </SyncBridge>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </TelegramProvider>
  );
}
