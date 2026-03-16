import { convertToModelMessages, streamText, type UIMessage } from "ai";
import type { NextRequest } from "next/server";

import { DEFAULT_MODEL, getModel } from "@/lib/models";
import type { UserProfile } from "@/lib/types";

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
    "You are a personal fitness and nutrition coach AI assistant.",
    "Be supportive, evidence-based, and tailor every response to the user's profile.",
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

  if (profile.dietary_other_text) {
    lines.push(`Additional dietary notes: ${profile.dietary_other_text}.`);
  }
  if (profile.health_notes) {
    lines.push(`Health conditions or injuries: ${profile.health_notes}.`);
  }

  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  const {
    messages,
    session_id,
  }: { messages: UIMessage[]; session_id: string } = await req.json();

  // Forward the user's JWT cookies to Django (they stay server-side — never reach the browser)
  const cookieHeader = req.headers.get("cookie") ?? "";
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const profileRes = await fetch(`${apiBase}/api/profile/`, {
    headers: { cookie: cookieHeader },
  });

  if (!profileRes.ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  const profile: UserProfile = await profileRes.json();

  const system = buildSystemPrompt(profile);

  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === "user");
  const lastUserText = lastUserMessage?.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");

  const result = streamText({
    model: getModel(DEFAULT_MODEL),
    system,
    messages: await convertToModelMessages(messages),

    // onFinish fires once the full response is assembled — safe place to persist
    onFinish: async ({ text }) => {
      if (!session_id || !lastUserText) return;

      const saveMessage = (role: "user" | "coach", content: string) =>
        fetch(`${apiBase}/api/chat/sessions/${session_id}/messages/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            cookie: cookieHeader,
          },
          body: JSON.stringify({ role, content }),
        });

      await saveMessage("user", lastUserText);
      await saveMessage("coach", text);
    },
  });

  return result.toUIMessageStreamResponse();
}
