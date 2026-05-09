import { tool } from "ai";
import { cookies } from "next/headers";
import { z } from "zod";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const saveDietPlanTool = tool({
  description:
    "Save a diet or nutrition plan to the user's plan library. Call this ONLY when the user explicitly asks you to save a diet plan.",
  inputSchema: z.object({
    title: z
      .string()
      .describe("Short descriptive title, e.g. '7-Day Meal Plan'"),
    content: z.string().describe("The full diet plan in markdown"),
    session_id: z.string().optional().describe("Current chat session ID"),
  }),
  execute: async ({ title, content, session_id }) => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const csrfToken = cookieStore.get("csrftoken")?.value ?? "";

    const body: Record<string, unknown> = { title, content };
    if (session_id) body.session_id = session_id;

    const res = await fetch(`${apiBase}/api/chat/diet-plans/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
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

export const getDietPlansTool = tool({
  description:
    "Retrieve the user's saved diet plans. Call when the user asks to see, review, or continue a previous diet plan.",
  inputSchema: z.object({}),
  execute: async () => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(`${apiBase}/api/chat/diet-plans/`, {
      headers: { cookie: cookieHeader },
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
