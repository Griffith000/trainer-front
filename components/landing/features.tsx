"use client";

import { Brain, LineChart, MessageCircle, Target, Zap } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Our AI understands your unique patterns and provides personalized recommendations that evolve with you.",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description:
      "Set meaningful goals and break them down into achievable daily actions. Watch your progress unfold.",
  },
  {
    icon: MessageCircle,
    title: "Daily Coaching",
    description:
      "Get friendly nudges, motivation, and accountability through natural conversations with your AI coach.",
  },
  {
    icon: LineChart,
    title: "Progress Analytics",
    description:
      "Visualize your journey with beautiful charts and insights that celebrate your wins and identify areas to improve.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-16 px-4 py-20 sm:px-6 sm:py-28 lg:px-8 relative overflow-hidden"
    >
      {/* Energy background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

        {/* Lightning bolts */}
        <LightningBolt className="absolute top-[15%] right-[10%] w-10 h-10 text-yellow-500/30" />
        <LightningBolt className="absolute bottom-[25%] left-[8%] w-12 h-12 text-orange-500/25" />
        <LightningBolt className="absolute top-[60%] right-[15%] w-8 h-8 text-primary/20" />

        {/* Energy sparks */}
        <div className="absolute top-[30%] left-[15%] h-2 w-2 rounded-full bg-yellow-400/60 shadow-[0_0_8px_3px_rgba(250,204,21,0.3)]" />
        <div className="absolute bottom-[40%] right-[20%] h-2.5 w-2.5 rounded-full bg-orange-400/60 shadow-[0_0_10px_4px_rgba(251,146,60,0.3)]" />
      </div>

      {/* Activity doodles */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-[10%] right-[5%]">
          <Image
            src="/doodles/swimming.png"
            alt=""
            width={80}
            height={80}
            className="w-16 h-16 sm:w-24 sm:h-24"
            unoptimized
          />
        </div>
        <div className="absolute bottom-[15%] left-[5%]">
          <Image
            src="/doodles/lifting.png"
            alt=""
            width={70}
            height={70}
            className="w-14 h-14 sm:w-20 sm:h-20"
            unoptimized
          />
        </div>
        <div className="absolute top-[50%] left-[8%]">
          <Image
            src="/doodles/baseball.png"
            alt=""
            width={75}
            height={75}
            className="w-16 h-16 sm:w-20 sm:h-20"
            unoptimized
          />
        </div>
        <div className="absolute bottom-[20%] right-[8%]">
          <Image
            src="/doodles/tennis-2.png"
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
              <span>Powerful Features</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-primary bg-clip-text text-transparent">
                level up
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed to help you build habits that stick and
              achieve your goals.
            </p>
          </div>
        </ScrollAnimate>

        {/* Feature cards */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2">
          {features.map((feature, index) => (
            <ScrollAnimate
              key={feature.title}
              animation={index % 2 === 0 ? "fade-in-left" : "fade-in-right"}
              delay={index + 1}
            >
              <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 h-full">
                {/* Gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

                {/* Corner bolt decoration */}
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Zap className="h-8 w-8 text-yellow-500/30" />
                </div>

                <CardHeader className="relative">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-600 dark:text-yellow-400 transition-all group-hover:from-yellow-500 group-hover:to-orange-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-yellow-500/25">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimate>
          ))}
        </div>
      </div>
    </section>
  );
}
