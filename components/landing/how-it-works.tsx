"use client";

import { CheckCircle2, Flag, MessageSquare, Rocket, Zap } from "lucide-react";
import Image from "next/image";
import { ScrollAnimate } from "@/components/ui/scroll-animate";

function LightningBolt({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13 0L0 13h9l-1 11L21 11h-9l1-11z" />
    </svg>
  );
}

const steps = [
  {
    number: "01",
    icon: CheckCircle2,
    title: "Tell us your goals",
    description:
      "Share what you want to achieve. Whether it's fitness, productivity, mindfulness, or anything else - we're here to help.",
  },
  {
    number: "02",
    icon: Rocket,
    title: "Get your personalized plan",
    description:
      "Our AI analyzes your goals and lifestyle to create a custom action plan with daily habits tailored just for you.",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Chat daily with your coach",
    description:
      "Have natural conversations with your AI coach. Get motivation, track progress, and adjust your plan as needed.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 bg-muted/30 px-4 py-20 sm:px-6 sm:py-28 lg:px-8 relative overflow-hidden"
    >
      {/* Energy background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-20 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

        {/* Lightning bolts */}
        <LightningBolt className="absolute top-[10%] left-[10%] w-10 h-10 text-yellow-500/30" />
        <LightningBolt className="absolute top-[20%] right-[15%] w-14 h-14 text-orange-500/25" />
        <LightningBolt className="absolute bottom-[15%] left-[20%] w-8 h-8 text-primary/20" />
        <LightningBolt className="absolute bottom-[25%] right-[10%] w-12 h-12 text-yellow-400/30" />

        {/* Energy sparks */}
        <div className="absolute top-[25%] right-[25%] h-2 w-2 rounded-full bg-yellow-400/60 shadow-[0_0_8px_3px_rgba(250,204,21,0.3)]" />
        <div className="absolute bottom-[35%] left-[15%] h-2.5 w-2.5 rounded-full bg-orange-400/60 shadow-[0_0_10px_4px_rgba(251,146,60,0.3)]" />
        <div className="absolute top-[60%] right-[30%] h-2 w-2 rounded-full bg-yellow-300/60 shadow-[0_0_8px_3px_rgba(253,224,71,0.3)]" />
      </div>

      {/* Activity doodles */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-25">
        <div className="absolute top-[15%] left-[5%]">
          <Image
            src="/doodles/karate.png"
            alt=""
            width={70}
            height={70}
            className="w-14 h-14 sm:w-20 sm:h-20"
            unoptimized
          />
        </div>
        <div className="absolute bottom-[10%] right-[5%]">
          <Image
            src="/doodles/tennis.png"
            alt=""
            width={80}
            height={80}
            className="w-16 h-16 sm:w-24 sm:h-24"
            unoptimized
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section header with energy styling */}
        <ScrollAnimate animation="fade-in">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-600 dark:text-yellow-400">
              <Zap className="h-3.5 w-3.5" />
              <span>Quick Start</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your journey in{" "}
              <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-primary bg-clip-text text-transparent">
                3 simple steps
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From sign-up to your first habit win, we make it effortless.
            </p>
          </div>
        </ScrollAnimate>

        {/* Steps layout */}
        <div className="mx-auto mt-20 max-w-6xl relative">
          {/* Curved energy path line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1">
            <svg
              className="w-full h-24"
              preserveAspectRatio="none"
              viewBox="0 0 100 20"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="energyGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="rgb(234, 179, 8)" />
                  <stop offset="50%" stopColor="rgb(249, 115, 22)" />
                  <stop offset="100%" stopColor="rgb(234, 179, 8)" />
                </linearGradient>
              </defs>
              <path
                d="M 0,10 Q 25,5 50,10 T 100,10"
                fill="none"
                stroke="url(#energyGradient)"
                strokeWidth="0.5"
                strokeDasharray="2,2"
                opacity="0.5"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <ScrollAnimate
                key={step.number}
                animation="fade-in"
                delay={index + 1}
              >
                <div className="relative flex flex-col items-center text-center">
                  {/* Milestone marker with energy gradient */}
                  <div className="relative mb-6">
                    {/* Icon container */}
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-yellow-500 via-orange-500 to-primary text-white shadow-xl shadow-orange-500/25">
                      <step.icon className="h-9 w-9" />
                    </div>

                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold shadow-lg shadow-yellow-500/30">
                      {step.number}
                    </div>

                    {/* Energy glow */}
                    <div className="absolute inset-0 rounded-full bg-yellow-500/20 blur-xl -z-10" />
                  </div>

                  {/* Content card */}
                  <div className="flex-1 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 hover:-translate-y-1">
                    <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>

                  {/* Arrow connector for mobile/tablet */}
                  {index < steps.length - 1 && (
                    <div className="my-4 md:hidden">
                      <Zap className="h-6 w-6 text-yellow-500" />
                    </div>
                  )}
                </div>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
