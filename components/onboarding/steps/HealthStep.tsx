"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { OnboardingFormData } from "../OnboardingWizard";

interface Props {
  form: UseFormReturn<OnboardingFormData>;
}

export function HealthStep({ form }: Props) {
  const [disclaimerTouched, setDisclaimerTouched] = useState(false);
  const {
    register,
    formState: { errors, isSubmitted },
    watch,
    setValue,
  } = form;
  const disclaimerAccepted = watch("disclaimer_accepted");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="health_notes">
          Health conditions or injuries (optional)
        </Label>
        <Textarea
          id="health_notes"
          placeholder="e.g. mild lower back pain, asthma..."
          {...register("health_notes")}
        />
        {errors.health_notes && (
          <p className="text-sm text-destructive">
            {errors.health_notes.message}
          </p>
        )}
      </div>

      <div className="rounded-lg border p-4 bg-muted/50 space-y-3">
        <p className="text-sm font-medium">Health Disclaimer</p>
        <p className="text-sm text-muted-foreground">
          The information and recommendations provided by Ai Coach are for
          general wellness purposes only and do not constitute medical advice.
          Please consult a qualified medical professional before starting any
          new exercise or diet programme, especially if you have existing health
          conditions or injuries.
        </p>
        <div className="flex items-center gap-2">
          <Checkbox
            id="disclaimer_accepted"
            checked={disclaimerAccepted ?? false}
            onCheckedChange={(checked) => {
              setDisclaimerTouched(true);
              setValue("disclaimer_accepted", checked as true);
            }}
          />
          <Label htmlFor="disclaimer_accepted">
            I understand and accept this disclaimer
          </Label>
        </div>
        {errors.disclaimer_accepted && (isSubmitted || disclaimerTouched) && (
          <p className="text-sm text-destructive">
            {errors.disclaimer_accepted.message}
          </p>
        )}
      </div>
    </div>
  );
}
