import { tool } from "ai";
import { cookies } from "next/headers";
import { z } from "zod";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const getRoutinesTool = tool({
  description: "Retrieve the user's weekly routines schedule.",
  inputSchema: z.object({}),
  execute: async () => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(`${apiBase}/api/routines/`, {
      headers: { cookie: cookieHeader },
    });

    if (!res.ok) {
      return { success: false as const, error: `Failed to fetch: ${res.status}` };
    }

    const routines = await res.json();
    return { success: true as const, routines };
  },
});

export const addRoutineTool = tool({
  description: "Add a new routine to the user's weekly calendar. If a conflict occurs, present options to the user to either 'overwrite' or 'cancel'.",
  inputSchema: z.object({
    activity_name: z.string(),
    activity_description: z.string().optional(),
    start_time: z.string().describe("HH:MM format, e.g., '08:00'"),
    end_time: z.string().describe("HH:MM format, e.g., '09:00'"),
    day_name: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
    overwrite_conflict_id: z.string().optional().describe("If the user chose to overwrite an existing routine, provide its ID here."),
  }),
  execute: async ({ activity_name, activity_description, start_time, end_time, day_name, overwrite_conflict_id }) => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const csrfToken = cookieStore.get("csrftoken")?.value ?? "";

    const headers = {
      "Content-Type": "application/json",
      cookie: cookieHeader,
      "X-CSRFToken": csrfToken,
    };

    if (overwrite_conflict_id) {
      // User explicitly opted to overwrite
      await fetch(`${apiBase}/api/routines/${overwrite_conflict_id}/`, {
        method: "DELETE",
        headers,
      });
    }

    const res = await fetch(`${apiBase}/api/routines/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        activity_name,
        activity_description,
        start_time,
        end_time,
        day_name,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      if (res.status === 400 && errorData && errorData.non_field_errors && errorData.code === 'overlap_conflict') {
        // Fetch all routines to tell the AI what it conflicted with
        const routinesRes = await fetch(`${apiBase}/api/routines/`, { headers: { cookie: cookieHeader } });
        const allRoutines = await routinesRes.json().catch(() => []);
        return {
          success: false as const,
          conflict: true,
          message: "Conflict detected. Ask the user if they want to overwrite the conflicting routine, move this one, or cancel.",
          existing_routines: allRoutines.filter((r: any) => r.day_name === day_name),
        };
      }
      return { success: false as const, error: `Failed to save: ${res.status}` };
    }

    const routine = await res.json();
    return { success: true as const, routine };
  },
});

export const updateRoutineTool = tool({
  description: "Update an existing routine (e.g. changing its time, name, or status).",
  inputSchema: z.object({
    id: z.string(),
    activity_name: z.string().optional(),
    activity_description: z.string().optional(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    day_name: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]).optional(),
    status: z.enum(["done", "not_done"]).optional(),
  }),
  execute: async ({ id, ...updates }) => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const csrfToken = cookieStore.get("csrftoken")?.value ?? "";

    const res = await fetch(`${apiBase}/api/routines/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) return { success: false as const, error: `Failed to update: ${res.status}` };
    return { success: true as const, routine: await res.json() };
  },
});

export const deleteRoutineTool = tool({
  description: "Delete an existing routine.",
  inputSchema: z.object({
    id: z.string(),
  }),
  execute: async ({ id }) => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const csrfToken = cookieStore.get("csrftoken")?.value ?? "";

    const res = await fetch(`${apiBase}/api/routines/${id}/`, {
      method: "DELETE",
      headers: {
        cookie: cookieHeader,
        "X-CSRFToken": csrfToken,
      },
    });

    if (!res.ok) return { success: false as const, error: `Failed to delete: ${res.status}` };
    return { success: true as const };
  },
});