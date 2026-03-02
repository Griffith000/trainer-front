"use client";

import type { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { OnboardingFormData } from "../OnboardingWizard";

interface Props {
  form: UseFormReturn<OnboardingFormData>;
}

export function GoalsStep({ form }: Props) {
  const {
    formState: { errors },
    watch,
    setValue,
  } = form;
  const fitnessGoal = watch("fitness_goal");
  const activityLevel = watch("activity_level");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Primary fitness goal</Label>
        <RadioGroup
          value={fitnessGoal}
          onValueChange={(v) =>
            setValue("fitness_goal", v as OnboardingFormData["fitness_goal"])
          }
        >
          {[
            { value: "lose_weight", label: "Lose weight" },
            { value: "build_muscle", label: "Build muscle" },
            { value: "improve_endurance", label: "Improve endurance" },
            { value: "general_wellness", label: "General wellness" },
          ].map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value} id={value} />
              <Label htmlFor={value}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
        {errors.fitness_goal && (
          <p className="text-sm text-destructive">
            {errors.fitness_goal.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Weekly activity level</Label>
        <RadioGroup
          value={activityLevel}
          onValueChange={(v) =>
            setValue(
              "activity_level",
              v as OnboardingFormData["activity_level"],
            )
          }
        >
          {[
            { value: "sedentary", label: "Sedentary" },
            { value: "lightly_active", label: "Lightly active" },
            { value: "moderately_active", label: "Moderately active" },
            { value: "very_active", label: "Very active" },
          ].map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value} id={value} />
              <Label htmlFor={value}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
        {errors.activity_level && (
          <p className="text-sm text-destructive">
            {errors.activity_level.message}
          </p>
        )}
      </div>
    </div>
  );
}
