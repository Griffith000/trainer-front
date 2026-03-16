"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { OnboardingFormData } from "../OnboardingWizard";

interface Props {
  form: UseFormReturn<OnboardingFormData>;
}

export function PersonalInfoStep({ form }: Props) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;
  const gender = watch("gender");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" {...register("full_name")} />
        {errors.full_name && (
          <p className="text-sm text-destructive">{errors.full_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date_of_birth">Date of birth</Label>
        <Input id="date_of_birth" type="date" {...register("date_of_birth")} />
        {errors.date_of_birth && (
          <p className="text-sm text-destructive">
            {errors.date_of_birth.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Gender</Label>
        <RadioGroup
          value={gender}
          onValueChange={(v) =>
            setValue("gender", v as OnboardingFormData["gender"])
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="prefer_not_to_say" id="prefer_not_to_say" />
            <Label htmlFor="prefer_not_to_say">Prefer not to say</Label>
          </div>
        </RadioGroup>
        {errors.gender && (
          <p className="text-sm text-destructive">{errors.gender.message}</p>
        )}
      </div>
    </div>
  );
}
