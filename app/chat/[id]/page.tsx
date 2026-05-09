"use client";

import { useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DefaultChatTransport } from "ai";
import { DownloadIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { generateSessionTitle } from "@/app/chat/actions";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
  PlanList,
  ToolCall,
  ToolResult,
} from "@/components/ai-elements/tool-invocation";
import { useDataStream } from "@/components/data-stream-provider";
import { useAutoResume } from "@/hooks/use-auto-resume";
import { api } from "@/lib/api/client";
import type { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "Create a workout plan for me",
  "What should I eat today?",
  "How do I build muscle faster?",
  "Tips for staying motivated",
];

function toUIMessage(msg: ChatMessage) {
  const role = msg.role === "coach" ? "assistant" : "user";
  if (msg.parts && msg.parts.length > 0) {
    return {
      id: msg.id,
      role: role as "user" | "assistant",
      parts: msg.parts,
    };
  }
  return {
    id: msg.id,
    role: role as "user" | "assistant",
    parts: [{ type: "text" as const, text: msg.content }],
  };
}

function useSessionMessages(sessionId: string) {
  return useQuery<ChatMessage[]>({
    queryKey: ["chat-messages", sessionId],
    queryFn: async () => {
      const { data } = await api.get<ChatMessage[]>(
        `/api/chat/sessions/${sessionId}/messages/`,
      );
      return data;
    },
  });
}

function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SessionPage() {
  const { id: sessionId } = useParams<{ id: string }>();

  const { data: history, isLoading: historyLoading } =
    useSessionMessages(sessionId);

  const [seeded, setSeeded] = useState(false);
  const [titleGenerated, setTitleGenerated] = useState(false);
  const queryClient = useQueryClient();
  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  const { setDataStream } = useDataStream();

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, status, sendMessage, setMessages, stop, resumeStream } =
    useChat({
      id: sessionId,
      transport,
      resume: true,
      onData: (data) => {
        setDataStream((prev) => [...(prev || []), data]);
      },
      onFinish: () => {
        setDataStream(() => []);
      },
    });

  useAutoResume({
    autoResume: true,
    initialMessages: history?.map(toUIMessage) ?? [],
    resumeStream,
    setMessages,
  });

  const isStreaming = status === "submitted" || status === "streaming";

  // biome-ignore lint/correctness/useExhaustiveDependencies: sessionId is reactive (URL param changes on navigation)
  useEffect(() => {
    setSeeded(false);
    setTitleGenerated(false);
    setMessages([]);
  }, [sessionId, setMessages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally depends only on status and messages.length
  useEffect(() => {
    if (status === "ready" && messages.length === 2 && !titleGenerated) {
      const firstUserMsg = messages[0]?.parts
        .filter((p) => p.type === "text")
        .map((p) => (p as { type: "text"; text: string }).text)
        .join("");
      if (firstUserMsg) {
        setTitleGenerated(true);
        generateSessionTitle(sessionId, firstUserMsg).then(() => {
          queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
        });
      }
    }
  }, [status, messages.length]);

  useEffect(() => {
    if (history && !seeded) {
      setMessages(history.map(toUIMessage));
      setSeeded(true);
    }
  }, [history, seeded, setMessages]);

  const isInitialising = historyLoading || !seeded;

  function handleSubmit(message: PromptInputMessage) {
    if (!message.text.trim() || isStreaming || isInitialising) return;
    sendMessage(
      { text: message.text },
      { body: { session_id: sessionIdRef.current } },
    );
  }

  function handleSuggestion(suggestion: string) {
    if (isStreaming || isInitialising) return;
    sendMessage(
      { text: suggestion },
      { body: { session_id: sessionIdRef.current } },
    );
  }

  return (
    <div className="flex h-full flex-col">
      {isInitialising ? (
        <div className="flex flex-1 items-center justify-center">
          <Shimmer className="text-sm" duration={1.5}>
            Loading your conversation…
          </Shimmer>
        </div>
      ) : (
        <Conversation className="flex-1">
          <ConversationContent className="mx-auto w-full max-w-2xl py-6">
            {messages.length === 0 && !isStreaming ? (
              <>
                <ConversationEmptyState
                  title="Start a conversation!"
                  description="Ask your AI coach anything about fitness, nutrition, or your goals."
                />
                <Suggestions className="mt-4 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <Suggestion
                      key={s}
                      suggestion={s}
                      onClick={handleSuggestion}
                    />
                  ))}
                </Suggestions>
              </>
            ) : (
              messages.map((msg) => (
                <Message key={msg.id} from={msg.role}>
                  <MessageContent>
                    {msg.role === "assistant" ? (
                      <>
                        {(
                          msg.parts as Array<{
                            type: string;
                            state?: string;
                            output?: {
                              success?: boolean;
                              error?: string;
                              // getUserProfile
                              full_name?: string;
                              fitness_goal?: string;
                              current_weight_kg?: string;
                              target_weight_kg?: string;
                              activity_level?: string;
                              // saveWorkoutPlan / saveDietPlan
                              id?: string;
                              title?: string;
                              content?: string;
                              // getWorkoutPlans / getDietPlans
                              plans?: Array<{
                                id: string;
                                title: string;
                                content: string;
                                created_at: string;
                              }>;
                            };
                          }>
                        )
                          .filter((p) => p.type.startsWith("tool-"))
                          .map((p) => {
                            const isDone =
                              p.state === "output-available" ||
                              p.state === "output-error";
                            const key = `${p.type}-${p.state ?? "running"}`;
                            if (p.type === "tool-updateGoal") {
                              if (!isDone)
                                return (
                                  <ToolCall
                                    key={key}
                                    label="Updating your goal…"
                                  />
                                );
                              return (
                                <ToolResult
                                  key={key}
                                  success={p.output?.success ?? false}
                                  summary={
                                    p.output?.success
                                      ? `Goal updated → ${p.output.fitness_goal}`
                                      : (p.output?.error ?? "Update failed")
                                  }
                                />
                              );
                            }
                            if (p.type === "tool-getUserProfile") {
                              if (!isDone)
                                return (
                                  <ToolCall
                                    key={key}
                                    label="Personalizing for you…"
                                  />
                                );
                              return (
                                <ToolResult
                                  key={key}
                                  success={p.output?.success ?? false}
                                  summary={
                                    p.output?.success
                                      ? `Profile loaded — ${p.output.full_name} | Goal: ${p.output.fitness_goal} | ${p.output.current_weight_kg}kg → ${p.output.target_weight_kg}kg`
                                      : (p.output?.error ??
                                        "Profile fetch failed")
                                  }
                                />
                              );
                            }
                            if (p.type === "tool-saveWorkoutPlan") {
                              if (!isDone)
                                return (
                                  <ToolCall
                                    key={key}
                                    label="Saving workout plan…"
                                  />
                                );
                              return (
                                <ToolResult
                                  key={key}
                                  success={p.output?.success ?? false}
                                  summary={
                                    p.output?.success
                                      ? (p.output.title ?? "Workout plan saved")
                                      : (p.output?.error ?? "Save failed")
                                  }
                                  actions={
                                    p.output?.success && p.output.content ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          downloadMarkdown(
                                            p.output?.title ?? "workout-plan",
                                            p.output?.content ?? "",
                                          )
                                        }
                                        className="ml-1 rounded p-0.5 hover:bg-green-100 dark:hover:bg-green-800/30"
                                        title="Download"
                                      >
                                        <DownloadIcon className="h-3 w-3" />
                                      </button>
                                    ) : null
                                  }
                                />
                              );
                            }
                            if (p.type === "tool-saveDietPlan") {
                              if (!isDone)
                                return (
                                  <ToolCall
                                    key={key}
                                    label="Saving diet plan…"
                                  />
                                );
                              return (
                                <ToolResult
                                  key={key}
                                  success={p.output?.success ?? false}
                                  summary={
                                    p.output?.success
                                      ? (p.output.title ?? "Diet plan saved")
                                      : (p.output?.error ?? "Save failed")
                                  }
                                  actions={
                                    p.output?.success && p.output.content ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          downloadMarkdown(
                                            p.output?.title ?? "diet-plan",
                                            p.output?.content ?? "",
                                          )
                                        }
                                        className="ml-1 rounded p-0.5 hover:bg-green-100 dark:hover:bg-green-800/30"
                                        title="Download"
                                      >
                                        <DownloadIcon className="h-3 w-3" />
                                      </button>
                                    ) : null
                                  }
                                />
                              );
                            }
                            if (p.type === "tool-getWorkoutPlans") {
                              if (!isDone)
                                return (
                                  <ToolCall
                                    key={key}
                                    label="Loading your workout plans…"
                                  />
                                );
                              if (!p.output?.success)
                                return (
                                  <ToolResult
                                    key={key}
                                    success={false}
                                    summary={
                                      p.output?.error ?? "Failed to load plans"
                                    }
                                  />
                                );
                              return (
                                <PlanList
                                  key={key}
                                  plans={p.output.plans ?? []}
                                  onDownload={downloadMarkdown}
                                />
                              );
                            }
                            if (p.type === "tool-getDietPlans") {
                              if (!isDone)
                                return (
                                  <ToolCall
                                    key={key}
                                    label="Loading your diet plans…"
                                  />
                                );
                              if (!p.output?.success)
                                return (
                                  <ToolResult
                                    key={key}
                                    success={false}
                                    summary={
                                      p.output?.error ?? "Failed to load plans"
                                    }
                                  />
                                );
                              return (
                                <PlanList
                                  key={key}
                                  plans={p.output.plans ?? []}
                                  onDownload={downloadMarkdown}
                                />
                              );
                            }
                            return null;
                          })}
                        <MessageResponse>
                          {msg.parts
                            .filter((p) => p.type === "text")
                            .map((p) => p.text)
                            .join("")}
                        </MessageResponse>
                      </>
                    ) : (
                      msg.parts
                        .filter((p) => p.type === "text")
                        .map((p, i) => (
                          <span key={`${msg.id}-${i}`}>{p.text}</span>
                        ))
                    )}
                  </MessageContent>
                </Message>
              ))
            )}

            {status === "submitted" && (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer duration={1.2}>Thinking…</Shimmer>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}

      <div className="flex justify-center px-4 py-4">
        <PromptInput
          onSubmit={handleSubmit}
          className="w-full max-w-3xl border-t pt-4"
        >
          <PromptInputTextarea
            placeholder="Ask your coach anything…"
            disabled={isStreaming || isInitialising}
          />
          <PromptInputFooter>
            <div />
            <PromptInputSubmit
              status={status}
              onStop={stop}
              disabled={isInitialising}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
