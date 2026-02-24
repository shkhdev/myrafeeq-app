import { lazy, Suspense } from "react";

const Lottie = lazy(() => import("lottie-react"));

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
  return (
    <Suspense fallback={<div className={className} />}>
      <Lottie animationData={data} loop={loop} className={className} />
    </Suspense>
  );
}
