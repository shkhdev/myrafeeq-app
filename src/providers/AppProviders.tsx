"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "./AuthProvider";
import { IntlProvider } from "./IntlProvider";
import { QueryProvider } from "./QueryProvider";
import { TelegramProvider } from "./TelegramProvider";
import { ThemeProvider } from "./ThemeProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TelegramProvider>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <IntlProvider>
              <ErrorBoundary>{children}</ErrorBoundary>
            </IntlProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </TelegramProvider>
  );
}
