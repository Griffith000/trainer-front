"use client";

import { useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DefaultChatTransport } from "ai";
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
import { ToolCall, ToolResult } from "@/components/ai-elements/tool-invocation";
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

export default function SessionPage() {
  const { id: sessionId } = useParams<{ id: string }>();

  const { data: history, isLoading: historyLoading } =
    useSessionMessages(sessionId);

  const [seeded, setSeeded] = useState(false);
  const [titleGenerated, setTitleGenerated] = useState(false);
  const queryClient = useQueryClient();
  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, status, sendMessage, setMessages, stop } = useChat({
    transport,
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
      const firstUserMsg = messages[0]?.content;
      if (typeof firstUserMsg === "string" && firstUserMsg) {
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
                  title="Start a conversation"
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
                              fitness_goal?: string;
                              full_name?: string;
                              error?: string;
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
                                      ? `Profile loaded — ${p.output.full_name}`
                                      : (p.output?.error ??
                                        "Profile fetch failed")
                                  }
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

      <div className="border-t px-4 py-4">
        <PromptInput onSubmit={handleSubmit} className="mx-auto max-w-2xl">
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
