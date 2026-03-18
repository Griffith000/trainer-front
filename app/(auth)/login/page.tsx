"use client";

import { Brain, Sparkles, Target, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth/context";
import type { User } from "@/lib/types";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleSuccess = (user: User) => {
    login(user);
    router.push(user.onboarding_completed ? "/chat" : "/onboarding");
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Benefits Section - Left Side */}
      <div className="hidden lg:flex flex-col space-y-8 px-8">
        <div>
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight mb-4">
            Welcome back to{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient_3s_linear_infinite]">
              AI Coach
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Your AI-powered coach is ready to help you continue your journey to
            better habits and lasting change.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Personalized AI Coaching</h3>
              <p className="text-sm text-muted-foreground">
                Your coach learns from every conversation and adapts to what
                works best for you.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Track Your Progress</h3>
              <p className="text-sm text-muted-foreground">
                See how far you've come with beautiful visualizations and
                insights.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Build Lasting Habits</h3>
              <p className="text-sm text-muted-foreground">
                Turn your goals into daily actions that stick, one day at a
                time.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground italic">
            "The best time to start was yesterday. The second best time is now."
          </p>
        </div>
      </div>

      {/* Login Form - Right Side */}
      <div className="w-full max-w-md mx-auto lg:mx-0">
        <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-4 text-center pb-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl">Welcome back!</CardTitle>
              <CardDescription className="mt-2">
                Sign in to continue your journey
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm onSuccess={handleSuccess} />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  New to AI Coach?
                </span>
              </div>
            </div>
            <p className="text-center text-sm">
              <Link
                href="/register"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Create your free account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
