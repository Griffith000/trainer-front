import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import type { NextRequest } from "next/server";

import type { UserProfile } from "@/lib/types";
import { getModel, DEFAULT_MODEL } from "@/lib/models";
import { getProfile, saveMessages } from "@/app/chat/actions";
import { getDietPlansTool, saveDietPlanTool } from "@/lib/ai/tools/diet-plans";
import { updateGoalTool } from "@/lib/ai/tools/update-goal";
import { getUserProfileTool } from "@/lib/ai/tools/user";
import {
  saveWorkoutPlanTool,
  getWorkoutPlansTool,
} from "@/lib/ai/tools/workout-plans";
import {
  getRoutinesTool,
  addRoutineTool,
  updateRoutineTool,
  deleteRoutineTool,
} from "@/lib/ai/tools/routines";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function buildSystemPrompt(profile: UserProfile): string {
  const age = calculateAge(profile.date_of_birth);
  const lines = [
    "You are a personal fitness and nutrition coach.",
    "Be direct, evidence-based, and tailor every response to the user's profile.",
    "Keep responses concise (≤3 sentences for simple questions). Only include plans or tips when explicitly asked.",
    "When the user clearly states a new fitness goal, target weight, or activity level, call the updateGoal tool to save it. If the tool returns success:false, tell the user the update failed and show the error — never claim the goal was updated when the tool failed.",
    "When the user asks for a personalized plan (workout, meal, program), call the getUserProfile tool first to get fresh data, then craft the plan using the returned profile.",
    "When you generate a workout plan, call saveWorkoutPlan immediately after presenting it to save it.",
    "When you generate a diet or nutrition plan, call saveDietPlan immediately after presenting it.",
    "When the user asks to see their saved plans, use getWorkoutPlans or getDietPlans.",
    "When the user wants to view or manage their daily/weekly routine or schedule, use getRoutinesTool, addRoutineTool, updateRoutineTool, or deleteRoutineTool.",
    "If addRoutineTool returns a conflict, ask the user if they want to overwrite the conflicting routine, move the new one, or cancel.",
    "",
    `The user's name is ${profile.full_name}.`,
    `They are approximately ${age} years old.`,
    `Gender: ${profile.gender}.`,
    `Current weight: ${profile.current_weight_kg} kg.`,
    `Height: ${profile.height_cm} cm.`,
    `Target weight: ${profile.target_weight_kg} kg.`,
    `Primary fitness goal: ${profile.fitness_goal}.`,
    `Weekly activity level: ${profile.activity_level}.`,
    `Dietary preferences: ${profile.dietary_preferences.join(", ") || "none specified"}.`,
  ];
  if (profile.dietary_other_text)
    lines.push(`Additional dietary notes: ${profile.dietary_other_text}.`);
  if (profile.health_notes)
    lines.push(`Health conditions or injuries: ${profile.health_notes}.`);
  return lines.join("\n");
}

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
    maxOutputTokens: 512,
    temperature: 0.4,
    stopWhen: stepCountIs(5),
    tools: {
      updateGoal: updateGoalTool,
      getUserProfile: getUserProfileTool,
      saveWorkoutPlan: saveWorkoutPlanTool,
      getWorkoutPlans: getWorkoutPlansTool,
      saveDietPlan: saveDietPlanTool,
      getDietPlans: getDietPlansTool,
      getRoutines: getRoutinesTool,
      addRoutine: addRoutineTool,
      updateRoutine: updateRoutineTool,
      deleteRoutine: deleteRoutineTool,
    },

    onFinish: async ({ text }) => {
      if (!session_id || !lastUserText || !text) return;
      await saveMessages(session_id, lastUserText, text);
    },
  });

  return result.toUIMessageStreamResponse();
}
