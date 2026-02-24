"use client";

import { useTranslations } from "next-intl";

interface BackArrowProps {
  onClick: () => void;
}

export function BackArrow({ onClick }: BackArrowProps) {
  const t = useTranslations("common");

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-muted transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30 rtl:-scale-x-100"
      aria-label={t("goBack")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
    </button>
  );
}
