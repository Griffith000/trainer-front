"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OnboardingFormData } from "../OnboardingWizard";

interface Props {
  form: UseFormReturn<OnboardingFormData>;
}

export function BodyMetricsStep({ form }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="current_weight_kg">Current weight (kg)</Label>
        <Input
          id="current_weight_kg"
          type="number"
          step="0.1"
          min={20}
          max={500}
          {...register("current_weight_kg", { valueAsNumber: true })}
        />
        {errors.current_weight_kg && (
          <p className="text-sm text-destructive">
            {errors.current_weight_kg.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="height_cm">Height (cm)</Label>
        <Input
          id="height_cm"
          type="number"
          step="0.1"
          min={50}
          max={300}
          {...register("height_cm", { valueAsNumber: true })}
        />
        {errors.height_cm && (
          <p className="text-sm text-destructive">{errors.height_cm.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_weight_kg">Target weight (kg)</Label>
        <Input
          id="target_weight_kg"
          type="number"
          step="0.1"
          min={20}
          max={500}
          {...register("target_weight_kg", { valueAsNumber: true })}
        />
        {errors.target_weight_kg && (
          <p className="text-sm text-destructive">
            {errors.target_weight_kg.message}
          </p>
        )}
      </div>
    </div>
  );
}
