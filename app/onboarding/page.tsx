"use client";

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Set up your profile</CardTitle>
          <CardDescription>
            Help us personalise your AI coaching experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingWizard onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
