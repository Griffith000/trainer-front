"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { PlanCard } from "@/components/plans/PlanCard";
import { Loader2Icon, FrownIcon } from "lucide-react";

export default function WorkoutPlansPage() {
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ["workout-plans"],
    queryFn: async () => {
      const { data } = await api.get("/api/chat/workout-plans/");
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center text-destructive border border-destructive/20 rounded-xl bg-destructive/5 p-8 max-w-sm mx-auto mt-10">
        <FrownIcon className="h-8 w-8 mb-2" />
        <p className="font-medium text-center">Failed to load workout plans.</p>
        <p className="text-xs mt-2 text-center opacity-80">Make sure the backend is running and you are logged in.</p>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center text-muted-foreground text-center bg-muted/30 rounded-xl border border-dashed p-10 max-w-lg mx-auto mt-10">
        <p className="text-lg font-medium text-foreground">No workout plans yet</p>
        <p className="text-sm mt-2">Ask the AI Coach to generate a workout plan for you, and it will appear here!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan: any) => (
        <PlanCard key={plan.id} plan={plan} type="workout" />
      ))}
    </div>
  );
}
