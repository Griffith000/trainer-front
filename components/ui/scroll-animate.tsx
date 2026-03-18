"use client";

import type { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

type AnimationType = "fade-in" | "fade-in-left" | "fade-in-right" | "scale-in";

interface ScrollAnimateProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
  threshold?: number;
}

const animationClasses: Record<AnimationType, string> = {
  "fade-in": "scroll-fade-in",
  "fade-in-left": "scroll-fade-in-left",
  "fade-in-right": "scroll-fade-in-right",
  "scale-in": "scroll-scale-in",
};

export function ScrollAnimate({
  children,
  animation = "fade-in",
  delay = 0,
  className,
  threshold = 0.1,
}: ScrollAnimateProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  const staggerClass = delay > 0 ? `stagger-${Math.min(delay, 6)}` : "";

  return (
    <div
      ref={ref}
      className={cn(
        animationClasses[animation],
        isVisible && "visible",
        staggerClass,
        className,
      )}
    >
      {children}
    </div>
  );
}
