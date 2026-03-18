"use client";

import { Heart, Rocket, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth/context";
import type { User } from "@/lib/types";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleSuccess = (user: User) => {
    login(user);
    router.push("/onboarding");
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Benefits Section - Left Side */}
      <div className="hidden lg:flex flex-col space-y-8 px-8">
        <div>
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight mb-4">
            Start your journey with{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient_3s_linear_infinite]">
              AI Coach
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Join thousands of people building better habits and achieving their
            goals with AI-powered coaching.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Your Personal AI Coach</h3>
              <p className="text-sm text-muted-foreground">
                Get a coach that understands you, remembers your preferences,
                and adapts to your lifestyle.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Science-Backed Methods</h3>
              <p className="text-sm text-muted-foreground">
                Build habits that last using proven techniques and personalized
                strategies.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Join a Community</h3>
              <p className="text-sm text-muted-foreground">
                Be part of a growing community of goal-getters transforming
                their lives.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            ✨ <strong>Free to start</strong> • No credit card required
          </p>
        </div>
      </div>

      {/* Register Form - Right Side */}
      <div className="w-full max-w-md mx-auto lg:mx-0">
        <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-4 text-center pb-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Rocket className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl">Start your journey</CardTitle>
              <CardDescription className="mt-2">
                Create your account and begin building better habits
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <RegisterForm onSuccess={handleSuccess} />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Already have an account?
                </span>
              </div>
            </div>
            <p className="text-center text-sm">
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign in to your account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
