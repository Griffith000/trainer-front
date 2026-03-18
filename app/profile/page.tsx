"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Check,
  Heart,
  Scale,
  Sparkles,
  User,
  Utensils,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { getProfile } from "@/app/chat/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Theme switcher in top right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      {/* Subtle background accents */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-start justify-center px-4 py-8">
        <div className="w-full max-w-lg animate-page-enter">
          {/* Back link */}
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to chat
          </Link>

          <Card className="shadow-lg border-border/50">
            <CardHeader className="space-y-3 text-center pb-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
                <CardDescription>
                  Update your information for better coaching
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User className="h-4 w-4" />
                    Personal Info
                  </div>

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

                  {/* Date of birth & Gender row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        {...register("date_of_birth")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Gender</Label>
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
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
                  </div>
                </div>

                {/* Body Metrics Section */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Scale className="h-4 w-4" />
                    Body Metrics
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="current_weight_kg" className="text-xs">
                        Current (kg)
                      </Label>
                      <Input
                        id="current_weight_kg"
                        type="number"
                        step="0.1"
                        placeholder="70"
                        {...register("current_weight_kg")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="height_cm" className="text-xs">
                        Height (cm)
                      </Label>
                      <Input
                        id="height_cm"
                        type="number"
                        placeholder="175"
                        {...register("height_cm")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="target_weight_kg" className="text-xs">
                        Target (kg)
                      </Label>
                      <Input
                        id="target_weight_kg"
                        type="number"
                        step="0.1"
                        placeholder="65"
                        {...register("target_weight_kg")}
                      />
                    </div>
                  </div>
                </div>

                {/* Fitness Section */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    Fitness Goals
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Goal</Label>
                      <Controller
                        name="fitness_goal"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select goal" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lose_weight">
                                Lose Weight
                              </SelectItem>
                              <SelectItem value="build_muscle">
                                Build Muscle
                              </SelectItem>
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
                    <div className="space-y-1.5">
                      <Label className="text-xs">Activity Level</Label>
                      <Controller
                        name="activity_level"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sedentary">
                                Sedentary
                              </SelectItem>
                              <SelectItem value="lightly_active">
                                Lightly Active
                              </SelectItem>
                              <SelectItem value="moderately_active">
                                Moderately Active
                              </SelectItem>
                              <SelectItem value="very_active">
                                Very Active
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Dietary Preferences Section */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Utensils className="h-4 w-4" />
                    Dietary Preferences
                  </div>
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
                              checked={
                                field.value?.includes(opt.value) ?? false
                              }
                              onCheckedChange={(checked) => {
                                const current = field.value ?? [];
                                if (checked) {
                                  field.onChange([...current, opt.value]);
                                } else {
                                  field.onChange(
                                    current.filter(
                                      (v: string) => v !== opt.value,
                                    ),
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

                {/* Health Notes Section */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    Health Notes
                  </div>
                  <Textarea
                    id="health_notes"
                    rows={3}
                    placeholder="Any health conditions, injuries, or notes for your coach..."
                    {...register("health_notes")}
                  />
                </div>

                {/* Feedback */}
                {saved && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400">
                    <Check className="h-4 w-4" />
                    Profile saved successfully!
                  </div>
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Save Profile
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
