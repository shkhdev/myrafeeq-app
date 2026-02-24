import { AppShell } from "@/components/AppShell";
import { AppProviders } from "@/providers/AppProviders";

export function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
