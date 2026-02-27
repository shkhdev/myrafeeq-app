import { initSentry, installGlobalHandlers } from "./lib/sentry";

initSentry();
installGlobalHandlers();

import "@telegram-apps/telegram-ui/dist/styles.css";
import "./globals.css";

import { createRoot } from "react-dom/client";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);
