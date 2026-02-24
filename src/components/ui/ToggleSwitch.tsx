"use client";

interface ToggleSwitchProps {
  checked: boolean;
}

export function ToggleSwitch({ checked }: ToggleSwitchProps) {
  return (
    <div
      className={`relative h-[31px] w-[51px] rounded-full transition-colors duration-200 ${
        checked ? "bg-primary" : "bg-on-surface/15"
      }`}
      aria-hidden="true"
    >
      <div
        className={`absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </div>
  );
}
