"use client";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottieAnimationProps {
  data: object | null;
  loop?: boolean | undefined;
  className?: string | undefined;
}

export function LottieAnimation({
  data,
  loop = true,
  className = "h-48 w-48",
}: LottieAnimationProps) {
  if (!data) return <div className={className} />;
  return <Lottie animationData={data} loop={loop} className={className} />;
}
