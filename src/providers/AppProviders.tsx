"use client";

import { QueryProvider } from "./QueryProvider";
import { TelegramProvider } from "./TelegramProvider";
import { ThemeProvider } from "./ThemeProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TelegramProvider>
      <ThemeProvider>
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </TelegramProvider>
  );
}
