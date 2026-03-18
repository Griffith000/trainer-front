"use client";

import { ArrowRight, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      {/* Electric background effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient orbs with energy colors */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-yellow-500/20 blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute top-1/4 left-1/3 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

        {/* Lightning bolts */}
        <LightningBolt className="absolute top-[10%] left-[15%] w-12 h-12 text-yellow-500/60" />
        <LightningBolt className="absolute top-[25%] right-[12%] w-16 h-16 text-primary/50" />
        <LightningBolt className="absolute bottom-[30%] left-[10%] w-10 h-10 text-orange-500/40" />
        <LightningBolt className="absolute bottom-[20%] right-[20%] w-14 h-14 text-yellow-400/50" />
        <LightningBolt className="absolute top-[60%] right-[8%] w-8 h-8 text-primary/40" />

        {/* Energy sparks */}
        <div className="absolute top-[20%] left-[25%] h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_10px_4px_rgba(250,204,21,0.4)]" />
        <div className="absolute top-[40%] right-[15%] h-3 w-3 rounded-full bg-orange-400 shadow-[0_0_12px_5px_rgba(251,146,60,0.4)]" />
        <div className="absolute bottom-[35%] left-[20%] h-2.5 w-2.5 rounded-full bg-yellow-300 shadow-[0_0_10px_4px_rgba(253,224,71,0.4)]" />
        <div className="absolute top-[70%] right-[25%] h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_4px_rgba(var(--primary),0.4)]" />
        <div className="absolute top-[15%] right-[30%] h-1.5 w-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_3px_rgba(234,179,8,0.5)]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40" />
      </div>

      <div className="mx-auto max-w-4xl text-center relative z-10">
        {/* Badge with bolt */}
        <ScrollAnimate animation="fade-in" delay={1}>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-sm font-medium text-yellow-600 dark:text-yellow-400">
            <Zap className="h-4 w-4" />
            <span>AI-Powered Personal Coaching</span>
            <Sparkles className="h-4 w-4" />
          </div>
        </ScrollAnimate>

        {/* Main headline with energy styling */}
        <ScrollAnimate animation="fade-in" delay={2}>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Your habits,</span>
            <span className="block bg-gradient-to-r from-yellow-500 via-orange-500 to-primary bg-clip-text text-transparent drop-shadow-sm">
              supercharged
            </span>
          </h1>
        </ScrollAnimate>

        {/* Electric underline */}
        <ScrollAnimate animation="scale-in" delay={3}>
          <div className="mx-auto mb-8 h-1 w-32 rounded-full bg-gradient-to-r from-yellow-500 via-orange-500 to-primary" />
        </ScrollAnimate>

        {/* Subheadline */}
        <ScrollAnimate animation="fade-in" delay={3}>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Meet your AI coach that understands your goals, adapts to your
            lifestyle, and gives you the daily nudges you need to build lasting
            habits.
          </p>
        </ScrollAnimate>

        {/* CTA Buttons with energy styling */}
        <ScrollAnimate animation="fade-in" delay={4}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group w-full sm:w-auto text-base px-8 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/25"
              asChild
            >
              <Link href="/register">
                <Zap className="mr-2 h-4 w-4" />
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base px-8 border-yellow-500/50 hover:bg-yellow-500/10 hover:text-foreground"
              asChild
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </ScrollAnimate>

        {/* Social proof hint */}
        <ScrollAnimate animation="fade-in" delay={5}>
          <p className="mt-10 text-sm text-muted-foreground">
            No credit card required. Start free and upgrade anytime.
          </p>
        </ScrollAnimate>
      </div>

      {/* Physical activity doodles */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Karate doodle - top left */}
        <div className="absolute top-[12%] left-[5%] opacity-50">
          <Image
            src="/doodles/karate.png"
            alt=""
            width={100}
            height={100}
            className="w-20 h-20 sm:w-28 sm:h-28"
            unoptimized
          />
        </div>

        {/* Lifting doodle - top right */}
        <div className="absolute top-[15%] right-[8%] opacity-50">
          <Image
            src="/doodles/lifting.png"
            alt=""
            width={100}
            height={100}
            className="w-20 h-20 sm:w-28 sm:h-28"
            unoptimized
          />
        </div>

        {/* Tennis doodle - middle left */}
        <div className="absolute top-[50%] left-[3%] opacity-50">
          <Image
            src="/doodles/tennis.png"
            alt=""
            width={100}
            height={100}
            className="w-24 h-24 sm:w-32 sm:h-32"
            unoptimized
          />
        </div>

        {/* Swimming doodle - bottom right */}
        <div className="absolute bottom-[10%] right-[10%] opacity-50">
          <Image
            src="/doodles/swimming.png"
            alt=""
            width={100}
            height={100}
            className="w-20 h-20 sm:w-28 sm:h-28"
            unoptimized
          />
        </div>

        {/* Baseball doodle - middle right */}
        <div className="absolute top-[45%] right-[5%] opacity-50">
          <Image
            src="/doodles/baseball.png"
            alt=""
            width={100}
            height={100}
            className="w-20 h-20 sm:w-28 sm:h-28"
            unoptimized
          />
        </div>

        {/* Tennis-2 doodle - bottom left */}
        <div className="absolute bottom-[15%] left-[12%] opacity-50">
          <Image
            src="/doodles/tennis-2.png"
            alt=""
            width={100}
            height={100}
            className="w-22 h-22 sm:w-28 sm:h-28"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
