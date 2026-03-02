"use client";

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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your email and choose a password to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RegisterForm onSuccess={handleSuccess} />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
