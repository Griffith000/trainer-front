import { tool } from "ai";
import { z } from "zod";

import { getAuthHeaders } from "./helpers";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const getUserProfileTool = tool({
  description:
    "Fetch the user's current profile data (name, goal, weight, activity level, health notes) before generating a personalized plan or recommendation. Call this when the user asks for a workout plan, meal plan, or any personalized program.",
  inputSchema: z.object({}),
  strict: true,
  execute: async () => {
    const { cookie } = await getAuthHeaders();

    const res = await fetch(`${apiBase}/api/profile/`, {
      method: "GET",
      headers: { cookie },
    });

    if (!res.ok) {
      return {
        success: false as const,
        error: `Failed to fetch profile: ${res.status}`,
      };
    }

    const profile = await res.json();
    return {
      success: true as const,
      full_name: profile.full_name as string,
      fitness_goal: profile.fitness_goal as string,
      current_weight_kg: profile.current_weight_kg as number,
      target_weight_kg: profile.target_weight_kg as number,
      activity_level: profile.activity_level as string,
      health_notes: (profile.health_notes ?? "") as string,
    };
  },
});
