import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import type { NextRequest } from "next/server";

import { getProfile, saveMessages } from "@/app/chat/actions";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { getDietPlansTool, saveDietPlanTool } from "@/lib/ai/tools/diet-plans";
import { updateGoalTool } from "@/lib/ai/tools/update-goal";
import { getUserProfileTool } from "@/lib/ai/tools/user";
import {
  getWorkoutPlansTool,
  saveWorkoutPlanTool,
} from "@/lib/ai/tools/workout-plans";
import { DEFAULT_MODEL, getModel } from "@/lib/models";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const {
    messages,
    session_id,
  }: { messages: UIMessage[]; session_id: string } = await req.json();

  const profile = await getProfile();
  if (!profile) return new Response("Unauthorized", { status: 401 });

  const lastUserText = [...messages]
    .reverse()
    .find((m) => m.role === "user")
    ?.parts.filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");

  const result = streamText({
    model: getModel(DEFAULT_MODEL),
    system: buildSystemPrompt(profile),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 2048,
    temperature: 0.4,
    stopWhen: stepCountIs(5),
    abortSignal: req.signal,
    tools: {
      updateGoal: updateGoalTool,
      getUserProfile: getUserProfileTool,
      saveWorkoutPlan: saveWorkoutPlanTool,
      getWorkoutPlans: getWorkoutPlansTool,
      saveDietPlan: saveDietPlanTool,
      getDietPlans: getDietPlansTool,
    },

    onFinish: async ({ text }) => {
      if (!session_id || !lastUserText || !text) return;
      await saveMessages(session_id, lastUserText, text);
    },
  });

  return result.toUIMessageStreamResponse();
}
