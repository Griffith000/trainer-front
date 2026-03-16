"use client";

import { useChat } from "@ai-sdk/react";
import { useQuery } from "@tanstack/react-query";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";

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
import { api } from "@/lib/api/client";
import type { ChatMessage, ChatSession } from "@/lib/types";

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

function useSession() {
  return useQuery<ChatSession>({
    queryKey: ["chat-session"],
    queryFn: async () => {
      const { data: sessions } = await api.get<ChatSession[]>(
        "/api/chat/sessions/",
      );
      if (sessions.length > 0) return sessions[0];
      const { data: newSession } = await api.post<ChatSession>(
        "/api/chat/sessions/",
      );
      return newSession;
    },
  });
}

function useSessionMessages(sessionId: string | undefined) {
  return useQuery<ChatMessage[]>({
    queryKey: ["chat-messages", sessionId],
    queryFn: async () => {
      const { data } = await api.get<ChatMessage[]>(
        `/api/chat/sessions/${sessionId}/messages/`,
      );
      return data;
    },
    enabled: !!sessionId,
  });
}

export default function ChatPage() {
  const { data: session, isLoading: sessionLoading } = useSession();
  const { data: history, isLoading: historyLoading } = useSessionMessages(
    session?.id,
  );

  const [seeded, setSeeded] = useState(false);
  const sessionIdRef = useRef<string | undefined>(undefined);
  sessionIdRef.current = session?.id;

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, status, sendMessage, setMessages, stop } = useChat({
    transport,
  });

  const isStreaming = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (history && !seeded) {
      setMessages(history.map(toUIMessage));
      setSeeded(true);
    }
  }, [history, seeded, setMessages]);

  const isInitialising = sessionLoading || historyLoading || !seeded;

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
    <div className="flex h-screen flex-col">
      <header className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">AI Coach</h1>
      </header>

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
                      <MessageResponse>
                        {msg.parts
                          .filter((p) => p.type === "text")
                          .map((p) => p.text)
                          .join("")}
                      </MessageResponse>
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
