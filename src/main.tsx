import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://ba9032a110dd5a9216987359de563623@o4510946269331456.ingest.us.sentry.io/4510946270576640",
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,
  tracePropagationTargets: ["localhost", import.meta.env.VITE_API_URL],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enableLogs: true,
});

import "@telegram-apps/telegram-ui/dist/styles.css";
import "./globals.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
