"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";
import type { UserProfile } from "@/lib/types";
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
    required_error: "Please select a gender",
  }),
  current_weight_kg: z
    .number({ required_error: "Required" })
    .min(20, "Min 20 kg")
    .max(500, "Max 500 kg"),
  height_cm: z
    .number({ required_error: "Required" })
    .min(50, "Min 50 cm")
    .max(300, "Max 300 cm"),
  target_weight_kg: z
    .number({ required_error: "Required" })
    .min(20, "Min 20 kg")
    .max(500, "Max 500 kg"),
  fitness_goal: z.enum(
    ["lose_weight", "build_muscle", "improve_endurance", "general_wellness"],
    { required_error: "Please select a goal" },
  ),
  activity_level: z.enum(
    ["sedentary", "lightly_active", "moderately_active", "very_active"],
    { required_error: "Please select an activity level" },
  ),
  dietary_preferences: z
    .array(z.enum(["vegetarian", "vegan", "gluten_free", "no_restrictions"]))
    .default([]),
  dietary_other_text: z.string().max(500).default(""),
  health_notes: z.string().default(""),
  disclaimer_accepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the health disclaimer" }),
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

const STEP_TITLES = [
  "Personal info",
  "Body metrics",
  "Your goals",
  "Dietary preferences",
  "Health & disclaimer",
];

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

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          Step {step + 1} of {STEP_TITLES.length}
        </p>
        <p className="font-medium">{STEP_TITLES[step]}</p>
        <div className="flex gap-1">
          {STEP_TITLES.map((title, i) => (
            <div
              key={title}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {step === 0 && <PersonalInfoStep form={form} />}
        {step === 1 && <BodyMetricsStep form={form} />}
        {step === 2 && <GoalsStep form={form} />}
        {step === 3 && <DietaryStep form={form} />}
        {step === 4 && <HealthStep form={form} />}

        {serverError && (
          <p className="text-sm text-destructive mt-4">{serverError}</p>
        )}

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            Back
          </Button>
          {isLast ? (
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Saving..."
                : "Complete onboarding"}
            </Button>
          ) : (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
