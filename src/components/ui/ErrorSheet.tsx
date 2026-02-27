import { Button } from "./Button";

interface ErrorSheetProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function ErrorSheet({ title, description, actionLabel, onAction }: ErrorSheetProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full rounded-t-2xl bg-surface px-6 pb-[calc(var(--safe-bottom,0px)+1.5rem)] pt-6">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-on-surface/20" />
        <h2 className="mb-2 text-lg font-semibold text-on-surface">{title}</h2>
        <p className="mb-6 text-sm text-on-surface-muted">{description}</p>
        <Button size="lg" className="w-full" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
