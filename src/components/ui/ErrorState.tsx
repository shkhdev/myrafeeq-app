import { Button } from "./Button";

interface ErrorStateProps {
  message: string;
  retryLabel: string;
  onRetry: () => void;
}

export function ErrorState({ message, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-sm text-on-surface-muted">{message}</p>
      <Button size="md" onClick={onRetry}>
        {retryLabel}
      </Button>
    </div>
  );
}
