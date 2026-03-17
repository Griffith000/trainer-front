import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import type { NextRequest } from "next/server";

import { getProfile, saveMessages } from "@/app/chat/actions";
import { getUserProfileTool } from "@/lib/ai/tools/user";
import { updateGoalTool } from "@/lib/ai/tools/update-goal";
import { DEFAULT_MODEL, getModel } from "@/lib/models";
import type { UserProfile } from "@/lib/types";

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
    stopWhen: stepCountIs(3),
    tools: { updateGoal: updateGoalTool, getUserProfile: getUserProfileTool },

    onFinish: async ({ text }) => {
      if (!session_id || !lastUserText || !text) return;
      await saveMessages(session_id, lastUserText, text);
    },
  });

  return result.toUIMessageStreamResponse();
}
