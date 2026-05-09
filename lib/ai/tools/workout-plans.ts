import { tool } from "ai";
import { z } from "zod";

import { getAuthHeaders } from "./helpers";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const saveWorkoutPlanTool = tool({
  description:
    "Save a workout plan to the user's plan library. Call this ONLY when the user explicitly asks you to save a workout plan.",
  inputSchema: z.object({
    title: z
      .string()
      .describe("Short descriptive title, e.g. '3-Day Strength Program'"),
    content: z.string().describe("The full workout plan in markdown"),
    session_id: z.string().optional().describe("Current chat session ID"),
  }),
  strict: true,
  execute: async ({ title, content, session_id }) => {
    const { cookie, csrfToken } = await getAuthHeaders();

    const body: Record<string, unknown> = { title, content };
    if (session_id) body.session_id = session_id;

    const res = await fetch(`${apiBase}/api/chat/workout-plans/`, {
      method: "POST",
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
        error: `Failed to save: ${res.status}`,
      };
    }

    const plan = await res.json();
    return {
      success: true as const,
      id: plan.id as string,
      title: plan.title as string,
      content,
    };
  },
});

export const getWorkoutPlansTool = tool({
  description:
    "Retrieve the user's saved workout plans. Call when the user asks to see, review, or continue a previous plan.",
  inputSchema: z.object({}),
  strict: true,
  execute: async () => {
    const { cookie } = await getAuthHeaders();

    const res = await fetch(`${apiBase}/api/chat/workout-plans/`, {
      headers: { cookie },
    });

    if (!res.ok) {
      return {
        success: false as const,
        error: `Failed to fetch: ${res.status}`,
      };
    }

    const plans = await res.json();
    return {
      success: true as const,
      plans: plans as Array<{
        id: string;
        title: string;
        created_at: string;
        content: string;
      }>,
    };
  },
});
