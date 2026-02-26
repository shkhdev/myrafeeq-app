import type { ReactNode } from "react";

interface ScreenLayoutProps {
  children: ReactNode;
  className?: string;
  fixedHeight?: boolean;
}

export function ScreenLayout({ children, className, fixedHeight }: ScreenLayoutProps) {
  return (
    <div
      className={`flex flex-col bg-surface ${className ?? ""}`}
      style={{
        [fixedHeight ? "height" : "minHeight"]: "var(--tg-viewport-stable-height, 100dvh)",
      }}
    >
      {children}
    </div>
  );
}
