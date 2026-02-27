import * as Sentry from "@sentry/react";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { useTranslations } from "use-intl";
import { Button } from "./ui/Button";

interface Props {
  children: ReactNode;
  name?: string;
  fallback?: (props: { error: Error; reset: () => void }) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function DefaultFallback({ onReset }: { onReset: () => void }) {
  const t = useTranslations("errors");

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
      <p className="text-title font-semibold text-on-surface">{t("somethingWentWrong")}</p>
      <Button size="md" onClick={onReset}>
        {t("tryAgain")}
      </Button>
    </div>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, {
      tags: { boundary: this.props.name ?? "unknown" },
      extra: { componentStack: errorInfo.componentStack },
    });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const reset = () => this.setState({ hasError: false, error: null });
      if (this.props.fallback) {
        return this.props.fallback({ error: this.state.error, reset });
      }
      return <DefaultFallback onReset={reset} />;
    }

    return this.props.children;
  }
}
