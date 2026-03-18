import Image from "next/image";
import type { ReactNode } from "react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Theme switcher in top right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      {/* Fun activity doodles in background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Gradient background orbs - energy theme */}
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-yellow-500/15 blur-3xl" />
        <div className="absolute bottom-0 -right-40 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />

        {/* Activity doodles */}
        <div className="opacity-25">
          {/* Karate - top left */}
          <div className="absolute top-[6%] left-[3%]">
            <Image
              src="/doodles/karate.png"
              alt=""
              width={120}
              height={120}
              className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28"
              unoptimized
            />
          </div>

          {/* Swimming - bottom right */}
          <div className="absolute bottom-[8%] right-[3%]">
            <Image
              src="/doodles/swimming.png"
              alt=""
              width={120}
              height={120}
              className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28"
              unoptimized
            />
          </div>

          {/* Lifting - top right */}
          <div className="absolute top-[10%] right-[5%]">
            <Image
              src="/doodles/lifting.png"
              alt=""
              width={100}
              height={100}
              className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24"
              unoptimized
            />
          </div>

          {/* Tennis - bottom left */}
          <div className="absolute bottom-[12%] left-[5%]">
            <Image
              src="/doodles/tennis.png"
              alt=""
              width={110}
              height={110}
              className="w-16 h-16 md:w-22 md:h-22 lg:w-26 lg:h-26"
              unoptimized
            />
          </div>

          {/* Baseball - middle left */}
          <div className="absolute top-[45%] left-[2%]">
            <Image
              src="/doodles/baseball.png"
              alt=""
              width={100}
              height={100}
              className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24"
              unoptimized
            />
          </div>

          {/* Tennis 2 - middle right */}
          <div className="absolute top-[50%] right-[3%]">
            <Image
              src="/doodles/tennis-2.png"
              alt=""
              width={110}
              height={110}
              className="w-16 h-16 md:w-22 md:h-22 lg:w-26 lg:h-26"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full flex items-center justify-center px-4 py-8">
        {children}
      </div>
    </div>
  );
}
