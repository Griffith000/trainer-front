import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  smoothStream,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { nanoid } from "nanoid";
import type { NextRequest } from "next/server";
import { after } from "next/server";
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from "resumable-stream";
import { getProfile, saveMessages } from "@/app/chat/actions";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { getDietPlansTool, saveDietPlanTool } from "@/lib/ai/tools/diet-plans";
import {
  addRoutineTool,
  deleteRoutineTool,
  getRoutinesTool,
  updateRoutineTool,
} from "@/lib/ai/tools/routines";
import { updateGoalTool } from "@/lib/ai/tools/update-goal";
import { getUserProfileTool } from "@/lib/ai/tools/user";
import {
  getWorkoutPlansTool,
  saveWorkoutPlanTool,
} from "@/lib/ai/tools/workout-plans";
import { DEFAULT_MODEL, getModel } from "@/lib/models";
import {
  getIoredisPublisher,
  getIoredisSubscriber,
  setLatestStreamId,
} from "@/lib/redis/client";

export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
        publisher: getIoredisPublisher(),
        subscriber: getIoredisSubscriber(),
      });
    } catch (error: any) {
      if (error.message.includes("REDIS_URL")) {
        console.log(
          " > Resumable streams are disabled due to missing REDIS_URL",
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
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

  const streamId = nanoid();
  await setLatestStreamId(session_id, streamId);

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const result = streamText({
        model: getModel(DEFAULT_MODEL),
        system: buildSystemPrompt(profile),
        messages: await convertToModelMessages(messages),
        maxOutputTokens: 2048,
        temperature: 0.4,
        stopWhen: stepCountIs(5),
        abortSignal: req.signal,
        experimental_transform: smoothStream({
          delayInMs: 20,
          chunking: "word",
        }),
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
      });

      writer.merge(result.toUIMessageStream());
    },
    onFinish: async ({ responseMessage }) => {
      if (!session_id || !lastUserText || !responseMessage) return;
      const responseText = responseMessage.parts
        ?.filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("");
      if (!responseText) return;
      await saveMessages(session_id, lastUserText, responseText);
    },
  });

  return createUIMessageStreamResponse({
    stream,
    async consumeSseStream({ stream: sseStream }) {
      const streamContext = getStreamContext();
      if (streamContext) {
        await streamContext.createNewResumableStream(streamId, () => sseStream);
      }
    },
  });
}
