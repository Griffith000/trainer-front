"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { getProfile } from "@/app/chat/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api/client";

const schema = z.object({
  full_name: z.string().min(1, "Required"),
  date_of_birth: z.string().optional(),
  gender: z.enum(["male", "female", "prefer_not_to_say", "other"]).optional(),
  current_weight_kg: z.string().optional(),
  height_cm: z.string().optional(),
  target_weight_kg: z.string().optional(),
  fitness_goal: z
    .enum([
      "lose_weight",
      "build_muscle",
      "improve_endurance",
      "general_wellness",
    ])
    .optional(),
  activity_level: z
    .enum(["sedentary", "lightly_active", "moderately_active", "very_active"])
    .optional(),
  dietary_preferences: z.array(z.string()).optional(),
  health_notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten Free" },
  { value: "dairy_free", label: "Dairy Free" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
];

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { dietary_preferences: [] },
  });

  useEffect(() => {
    getProfile().then((profile) => {
      if (profile) {
        reset({
          full_name: profile.full_name,
          date_of_birth: profile.date_of_birth,
          gender:
            profile.gender === "male" ||
            profile.gender === "female" ||
            profile.gender === "prefer_not_to_say"
              ? profile.gender
              : undefined,
          current_weight_kg: profile.current_weight_kg,
          height_cm: profile.height_cm,
          target_weight_kg: profile.target_weight_kg,
          fitness_goal: profile.fitness_goal,
          activity_level: profile.activity_level,
          dietary_preferences: profile.dietary_preferences ?? [],
          health_notes: profile.health_notes,
        });
      }
    });
  }, [reset]);

  async function onSubmit(data: FormData) {
    try {
      await api.patch("/api/profile/", data);
      setSaved(true);
      setError(null);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save profile. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/chat"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; Back to chat
          </Link>
          <h1 className="text-xl font-semibold">My Profile</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full name */}
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" {...register("full_name")} />
            {errors.full_name && (
              <p className="text-sm text-destructive">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Date of birth */}
          <div className="space-y-1.5">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              {...register("date_of_birth")}
            />
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <Label>Gender</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Weight / Height row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="current_weight_kg">Current Weight (kg)</Label>
              <Input
                id="current_weight_kg"
                type="number"
                step="0.1"
                {...register("current_weight_kg")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="height_cm">Height (cm)</Label>
              <Input id="height_cm" type="number" {...register("height_cm")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="target_weight_kg">Target Weight (kg)</Label>
              <Input
                id="target_weight_kg"
                type="number"
                step="0.1"
                {...register("target_weight_kg")}
              />
            </div>
          </div>

          {/* Fitness goal */}
          <div className="space-y-1.5">
            <Label>Fitness Goal</Label>
            <Controller
              name="fitness_goal"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="build_muscle">Build Muscle</SelectItem>
                    <SelectItem value="improve_endurance">
                      Improve Endurance
                    </SelectItem>
                    <SelectItem value="general_wellness">
                      General Wellness
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Activity level */}
          <div className="space-y-1.5">
            <Label>Activity Level</Label>
            <Controller
              name="activity_level"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="lightly_active">
                      Lightly Active
                    </SelectItem>
                    <SelectItem value="moderately_active">
                      Moderately Active
                    </SelectItem>
                    <SelectItem value="very_active">Very Active</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Dietary preferences */}
          <div className="space-y-2">
            <Label>Dietary Preferences</Label>
            <Controller
              name="dietary_preferences"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {DIETARY_OPTIONS.map((opt) => (
                    <div
                      key={opt.value}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <Checkbox
                        id={`diet-${opt.value}`}
                        aria-label={opt.label}
                        checked={field.value?.includes(opt.value) ?? false}
                        onCheckedChange={(checked) => {
                          const current = field.value ?? [];
                          if (checked) {
                            field.onChange([...current, opt.value]);
                          } else {
                            field.onChange(
                              current.filter((v: string) => v !== opt.value),
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor={`diet-${opt.value}`}
                        className="cursor-pointer text-sm"
                      >
                        {opt.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Health notes */}
          <div className="space-y-1.5">
            <Label htmlFor="health_notes">Health Notes</Label>
            <Textarea
              id="health_notes"
              rows={4}
              placeholder="Any health conditions, injuries, or notes for your coach..."
              {...register("health_notes")}
            />
          </div>

          {/* Feedback */}
          {saved && (
            <p className="text-sm font-medium text-green-600">Profile saved!</p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
