"use server";

import { generateText } from "ai";
import { cookies } from "next/headers";

import { DEFAULT_MODEL, getModel } from "@/lib/models";
import type { ChatSession, UserProfile } from "@/lib/types";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getSessions(): Promise<ChatSession[]> {
  const cookieHeader = (await cookies()).toString();
  const res = await fetch(`${apiBase}/api/chat/sessions/`, {
    headers: { cookie: cookieHeader },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function createSession(): Promise<ChatSession | null> {
  const cookieHeader = (await cookies()).toString();
  const res = await fetch(`${apiBase}/api/chat/sessions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie: cookieHeader },
    body: JSON.stringify({}),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getProfile(): Promise<UserProfile | null> {
  const cookieHeader = (await cookies()).toString();
  const res = await fetch(`${apiBase}/api/profile/`, {
    headers: { cookie: cookieHeader },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function patchProfile(
  fields: Partial<{
    fitness_goal: string;
    target_weight_kg: number;
    activity_level: string;
  }>,
): Promise<{ ok: boolean }> {
  const cookieHeader = (await cookies()).toString();
  const res = await fetch(`${apiBase}/api/profile/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", cookie: cookieHeader },
    body: JSON.stringify(fields),
  });
  return { ok: res.ok };
}

export async function saveMessages(
  sessionId: string,
  userText: string,
  coachText: string,
): Promise<void> {
  const cookieHeader = (await cookies()).toString();

  const post = (role: "user" | "coach", content: string) =>
    fetch(`${apiBase}/api/chat/sessions/${sessionId}/messages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify({ role, content }),
    });

  await post("user", userText);
  await post("coach", coachText);
}

export async function generateSessionTitle(
  sessionId: string,
  firstUserMessage: string,
): Promise<void> {
  try {
    const { text } = await generateText({
      model: getModel(DEFAULT_MODEL),
      prompt: `Generate a concise 4-6 word title for a fitness coaching conversation that started with: '${firstUserMessage}'. Return only the title, no quotes.`,
    });

    const title = text.trim();
    if (!title) return;

    const cookieHeader = (await cookies()).toString();
    await fetch(`${apiBase}/api/chat/sessions/${sessionId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", cookie: cookieHeader },
      body: JSON.stringify({ title }),
    });
  } catch {
    // Title generation is non-critical; silently fail
  }
}
