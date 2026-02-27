import { toast } from "sonner";
import { useTranslations } from "use-intl";
import { APP_VERSION } from "@/env";
import { useHaptic } from "@/hooks/useHaptic";
import { openFeedbackForm } from "@/lib/sentry";

import { SettingsSection } from "./SettingsSection";

export function AboutSection() {
  const t = useTranslations("settings");
  const haptic = useHaptic();

  const handleFeedback = async () => {
    haptic.impact("light");
    const opened = await openFeedbackForm();
    if (!opened) {
      toast.error(t("feedbackUnavailable"));
    }
  };

  return (
    <SettingsSection title={t("about")}>
      <div className="flex items-center justify-between px-4 py-3.5">
        <div>
          <p className="text-[15px] font-semibold text-on-surface">MyRafeeq</p>
          <p className="mt-0.5 text-xs text-on-surface-muted">{t("appDescription")}</p>
        </div>
        <span className="text-xs tabular-nums text-on-surface-muted">
          {t("version", { version: APP_VERSION })}
        </span>
      </div>

      {/* Feedback button */}
      <button
        type="button"
        onClick={handleFeedback}
        className="flex w-full items-center gap-3 border-t border-on-surface/5 px-4 py-3.5 transition-colors hover:bg-on-surface/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-on-surface/30"
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5 shrink-0 text-on-surface-muted"
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
        <span className="flex-1 text-start text-[15px] font-medium text-on-surface">
          {t("feedback")}
        </span>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 shrink-0 text-on-surface-muted/60 rtl:rotate-180"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </SettingsSection>
  );
}
