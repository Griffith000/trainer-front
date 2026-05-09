import { tool } from "ai";
import { z } from "zod";

import { getAuthHeaders } from "./helpers";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const inputSchema = z.object({
  fitness_goal: z
    .enum([
      "lose_weight",
      "build_muscle",
      "improve_endurance",
      "general_wellness",
    ])
    .optional()
    .describe("New primary fitness goal"),
  target_weight_kg: z
    .number()
    .min(20)
    .max(500)
    .optional()
    .describe("New target weight in kg"),
  activity_level: z
    .enum(["sedentary", "lightly_active", "moderately_active", "very_active"])
    .optional()
    .describe("Updated weekly activity level"),
});

export const updateGoalTool = tool({
  description:
    "Update the user's fitness goal, target weight, or activity level when they explicitly state a change. Only call when the user clearly expresses a new goal or target.",
  inputSchema,
  strict: true,
  execute: async (input) => {
    const { cookie, csrfToken } = await getAuthHeaders();
    const body: Record<string, unknown> = {};
    if (input.fitness_goal !== undefined)
      body.fitness_goal = input.fitness_goal;
    if (input.target_weight_kg !== undefined)
      body.target_weight_kg = input.target_weight_kg;
    if (input.activity_level !== undefined)
      body.activity_level = input.activity_level;

    const res = await fetch(`${apiBase}/api/profile/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie,
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return {
        success: false as const,
        error: `Failed to update profile: ${res.status}`,
      };
    }

    const updated = await res.json();
    return {
      success: true as const,
      fitness_goal: updated.fitness_goal as string,
      target_weight_kg: updated.target_weight_kg as string,
      activity_level: updated.activity_level as string,
    };
  },
});
