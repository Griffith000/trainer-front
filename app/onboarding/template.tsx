"use client";

import type { ReactNode } from "react";

export default function OnboardingTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="w-full animate-page-enter">{children}</div>;
}
