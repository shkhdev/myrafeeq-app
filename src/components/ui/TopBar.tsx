import type { ReactNode } from "react";

interface TopBarProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

export function TopBar({ left, center, right }: TopBarProps) {
  return (
    <div
      className="flex items-center justify-between px-3"
      style={{ paddingTop: "calc(var(--safe-top, 0px) + 0.5rem)" }}
    >
      {left ?? <div className="w-11" />}
      {center}
      {right ?? <div className="w-11" />}
    </div>
  );
}
