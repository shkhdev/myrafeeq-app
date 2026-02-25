import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { useTranslations } from "use-intl";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

function ErrorFallback({ onReset }: { onReset: () => void }) {
  const t = useTranslations("errors");

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
      <p className="text-title font-semibold text-on-surface">{t("somethingWentWrong")}</p>
      <button
        type="button"
        onClick={onReset}
        className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
      >
        {t("tryAgain")}
      </button>
    </div>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // biome-ignore lint/suspicious/noConsole: error boundary logging is intentional
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
