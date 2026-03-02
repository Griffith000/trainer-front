"use client";

import type { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OnboardingFormData } from "../OnboardingWizard";

const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten-free" },
  { value: "no_restrictions", label: "No restrictions" },
] as const;

interface Props {
  form: UseFormReturn<OnboardingFormData>;
}

export function DietaryStep({ form }: Props) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;
  const selected = watch("dietary_preferences");

  function toggle(value: string) {
    const current = selected ?? [];
    setValue(
      "dietary_preferences",
      current.includes(value as never)
        ? current.filter((v) => v !== value)
        : [...current, value as never],
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Dietary preferences</Label>
        {DIETARY_OPTIONS.map(({ value, label }) => (
          <div key={value} className="flex items-center gap-2">
            <Checkbox
              id={value}
              checked={selected?.includes(value) ?? false}
              onCheckedChange={() => toggle(value)}
            />
            <Label htmlFor={value}>{label}</Label>
          </div>
        ))}
        {errors.dietary_preferences && (
          <p className="text-sm text-destructive">
            {errors.dietary_preferences.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dietary_other_text">
          Other dietary notes (optional)
        </Label>
        <Input id="dietary_other_text" {...register("dietary_other_text")} />
        {errors.dietary_other_text && (
          <p className="text-sm text-destructive">
            {errors.dietary_other_text.message}
          </p>
        )}
      </div>
    </div>
  );
}
