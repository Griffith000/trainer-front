"use client";

import { Sparkles, Target, Trophy, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth/context";
import type { UserProfile } from "@/lib/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  async function handleSuccess(_profile: UserProfile) {
    if (user) {
      login({ ...user, onboarding_completed: true });
    }
    router.push("/chat");
  }

  return (
    <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Benefits Section - Left Side */}
      <div className="hidden lg:flex flex-col space-y-8 px-8">
        <div>
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight mb-4">
            Let&apos;s set up your{" "}
            <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient_3s_linear_infinite]">
              AI Coach
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Tell us a bit about yourself so we can personalize your coaching
            experience and help you achieve your goals faster.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4 items-start group">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 group-hover:from-yellow-500/30 group-hover:to-orange-500/30 transition-colors">
              <Target className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Personalized Goals</h3>
              <p className="text-sm text-muted-foreground">
                We&apos;ll tailor recommendations based on your fitness level,
                preferences, and what you want to achieve.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start group">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-primary/20 group-hover:from-orange-500/30 group-hover:to-primary/30 transition-colors">
              <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Smart Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Your AI coach learns from your progress and adapts suggestions
                to keep you motivated.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start group">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Celebrate Wins</h3>
              <p className="text-sm text-muted-foreground">
                Track your progress, hit milestones, and celebrate every
                achievement along the way.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground italic flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            This only takes about 2 minutes!
          </p>
        </div>
      </div>

      {/* Onboarding Form - Right Side */}
      <div className="w-full max-w-md mx-auto lg:mx-0">
        <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-4 text-center pb-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 via-orange-500 to-primary shadow-lg shadow-orange-500/25">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Set up your profile</CardTitle>
              <CardDescription className="mt-2">
                Help us personalize your AI coaching experience
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <OnboardingWizard onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
