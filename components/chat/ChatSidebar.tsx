"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PanelLeftIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/lib/api/client";
import type { ChatSession, UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function formatSessionDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: "long" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function ChatSidebar({ onToggle }: { onToggle?: () => void } = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data } = await api.get<UserProfile>("/api/profile/");
      return data;
    },
  });

  const { data: sessions = [] } = useQuery<ChatSession[]>({
    queryKey: ["chat-sessions"],
    queryFn: async () => {
      const { data } = await api.get<ChatSession[]>("/api/chat/sessions/");
      return data;
    },
    refetchOnWindowFocus: true,
  });

  const sorted = [...sessions].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

  async function handleNewChat() {
    const { data: session } = await api.post<ChatSession>(
      "/api/chat/sessions/",
    );
    await queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    router.push(`/chat/${session.id}`);
  }

  return (
    <aside className="flex w-60 flex-shrink-0 flex-col border-r bg-muted/30">
      <div className="flex items-center justify-between px-3 py-3">
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            title="Collapse sidebar"
          >
            <PanelLeftIcon className="h-4 w-4" />
          </Button>
        )}
        <span className="text-sm font-semibold">AI Coach</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNewChat}
          title="New chat"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1">
        {sorted.map((session) => {
          const isActive = pathname === `/chat/${session.id}`;
          return (
            <Link
              key={session.id}
              href={`/chat/${session.id}`}
              className={cn(
                "flex w-full flex-col rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                isActive && "bg-muted font-medium",
              )}
            >
              <span className="truncate text-foreground">
                {session.title || "New Chat"}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatSessionDate(session.updated_at)}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="border-t px-3 py-3 flex flex-col gap-2">
        {profile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-md px-1 py-1.5 hover:bg-muted transition-colors"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate">{profile.full_name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{profile.full_name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <LogoutButton />
      </div>
    </aside>
  );
}
