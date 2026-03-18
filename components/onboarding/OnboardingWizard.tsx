"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";
import type { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BodyMetricsStep } from "./steps/BodyMetricsStep";
import { DietaryStep } from "./steps/DietaryStep";
import { GoalsStep } from "./steps/GoalsStep";
import { HealthStep } from "./steps/HealthStep";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";

const STORAGE_KEY = "onboarding_form_data";

const schema = z.object({
  full_name: z.string().min(1, "Full name is required").max(255),
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((v) => !Number.isNaN(Date.parse(v)) && new Date(v) <= new Date(), {
      message: "Date of birth cannot be in the future",
    }),
  gender: z.enum(["male", "female", "prefer_not_to_say"], {
    error: "Please select a gender",
  }),
  current_weight_kg: z
    .number({ error: "Required" })
    .min(20, "Min 20 kg")
    .max(500, "Max 500 kg"),
  height_cm: z
    .number({ error: "Required" })
    .min(50, "Min 50 cm")
    .max(300, "Max 300 cm"),
  target_weight_kg: z
    .number({ error: "Required" })
    .min(20, "Min 20 kg")
    .max(500, "Max 500 kg"),
  fitness_goal: z.enum(
    ["lose_weight", "build_muscle", "improve_endurance", "general_wellness"],
    { error: "Please select a goal" },
  ),
  activity_level: z.enum(
    ["sedentary", "lightly_active", "moderately_active", "very_active"],
    { error: "Please select an activity level" },
  ),
  dietary_preferences: z.array(
    z.enum(["vegetarian", "vegan", "gluten_free", "no_restrictions"]),
  ),
  dietary_other_text: z.string().max(500),
  health_notes: z.string(),
  disclaimer_accepted: z.literal(true, {
    error: "You must accept the health disclaimer",
  }),
});

export type OnboardingFormData = z.infer<typeof schema>;

const STEP_FIELDS: (keyof OnboardingFormData)[][] = [
  ["full_name", "date_of_birth", "gender"],
  ["current_weight_kg", "height_cm", "target_weight_kg"],
  ["fitness_goal", "activity_level"],
  ["dietary_preferences", "dietary_other_text"],
  ["health_notes", "disclaimer_accepted"],
];

const STEP_TITLES = ["Personal", "Body", "Goals", "Dietary", "Health"];

const STEP_ICONS = ["🧑", "📏", "🎯", "🥗", "🩷"];

interface Props {
  onSuccess: (profile: UserProfile) => void;
}

export function OnboardingWizard({ onSuccess }: Props) {
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      dietary_preferences: [],
      dietary_other_text: "",
      health_notes: "",
    },
  });

  // Restore from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        form.reset(JSON.parse(saved));
      } catch {}
    }
  }, [form.reset]);

  // Persist to sessionStorage on every change
  useEffect(() => {
    const sub = form.watch((values) => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    });
    return () => sub.unsubscribe();
  }, [form]);

  async function handleNext() {
    const fields = STEP_FIELDS[step] as (keyof OnboardingFormData)[];
    const valid = await form.trigger(fields);
    if (valid) setStep((s) => s + 1);
  }

  async function handleSubmit(data: OnboardingFormData) {
    setServerError(null);
    try {
      const { disclaimer_accepted: _, ...payload } = data;
      const response = await api.post<UserProfile>("/api/profile/", payload);
      sessionStorage.removeItem(STORAGE_KEY);
      onSuccess(response.data);
    } catch (err: unknown) {
      const detail = (
        err as { response?: { data?: { errors?: { detail?: string } } } }
      )?.response?.data?.errors?.detail;
      setServerError(detail ?? "Something went wrong. Please try again.");
    }
  }

  const isLast = step === STEP_TITLES.length - 1;
  const progress = ((step + 1) / STEP_TITLES.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Section */}
      <div className="space-y-3">
        {/* Step indicator with icons */}
        <div className="flex justify-between items-center">
          {STEP_TITLES.map((title, i) => (
            <div key={title} className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
                  i < step
                    ? "bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-md shadow-orange-500/25"
                    : i === step
                      ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500 text-yellow-600 dark:text-yellow-400"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{STEP_ICONS[i]}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-1 hidden sm:block transition-colors",
                  i === step
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {title.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          {/* Shimmer effect */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step title */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Step {step + 1} of {STEP_TITLES.length}
          </p>
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>{STEP_TITLES[step]}</span>
          </div>
        </div>
      </div>

      {/* Step content with animation */}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div key={step} className="animate-step-enter">
          {step === 0 && <PersonalInfoStep form={form} />}
          {step === 1 && <BodyMetricsStep form={form} />}
          {step === 2 && <GoalsStep form={form} />}
          {step === 3 && <DietaryStep form={form} />}
          {step === 4 && <HealthStep form={form} />}
        </div>

        {serverError && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{serverError}</p>
          </div>
        )}

        <div className="flex justify-between mt-6 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {isLast ? (
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/25"
            >
              {form.formState.isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Complete Setup
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/25"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
