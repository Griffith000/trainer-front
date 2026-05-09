"use client";

import type { UIMessage } from "ai";
import { useEffect } from "react";
import { useDataStream } from "@/components/data-stream-provider";

export interface UseAutoResumeParams {
  autoResume: boolean;
  initialMessages: UIMessage[];
  resumeStream: () => void;
  setMessages: (
    messages: UIMessage[] | ((prev: UIMessage[]) => UIMessage[]),
  ) => void;
}

export function useAutoResume({
  autoResume,
  initialMessages,
  resumeStream,
  setMessages,
}: UseAutoResumeParams) {
  const { dataStream } = useDataStream();

  useEffect(() => {
    if (!autoResume) return;

    const mostRecentMessage = initialMessages.at(-1);

    if (mostRecentMessage?.role === "user") {
      resumeStream();
    }
    // intentionally run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoResume, resumeStream, initialMessages.at]);

  useEffect(() => {
    if (!dataStream) return;
    if (dataStream.length === 0) return;

    const dataPart = dataStream[0];

    if (dataPart.type === "data-appendMessage") {
      const message = JSON.parse(dataPart.data);
      setMessages([...initialMessages, message]);
    }
  }, [dataStream, initialMessages, setMessages]);
}
