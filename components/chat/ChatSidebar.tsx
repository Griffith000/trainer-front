"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LogOutIcon,
  PanelLeftIcon,
  PlusIcon,
  Trash2Icon,
  BookOpenIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/context";
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
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

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

  async function handleDeleteSession(e: React.MouseEvent, sessionId: string) {
    e.preventDefault();
    await api.delete(`/api/chat/sessions/${sessionId}/`);
    await queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    if (pathname === `/chat/${sessionId}`) {
      router.push("/chat");
    }
  }

  async function handleNewChat() {
    const { data: session } = await api.post<ChatSession>(
      "/api/chat/sessions/",
    );
    await queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    router.push(`/chat/${session.id}`);
  }

  return (
    <>
      <aside className="flex h-full w-60 flex-shrink-0 flex-col border-r bg-muted/30">
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
          <Link
            href="/"
            className="text-sm font-semibold bg-gradient-to-r from-yellow-500 via-orange-500 to-primary bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            AI Coach
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            title="New chat"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="px-3 py-2">
          <Link
            href="/plans/workout"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
              pathname.startsWith("/plans") && "bg-muted text-primary",
            )}
          >
            <BookOpenIcon className="h-4 w-4" />
            My Plans
          </Link>
        </div>
        <div className="flex-1 border-t overflow-y-auto px-2 py-2 mt-1">
          <div className="text-xs font-medium text-muted-foreground px-2 pb-2 pt-1">
            Chats
          </div>
          {sorted.map((session) => {
            const isActive = pathname === `/chat/${session.id}`;
            return (
              <div key={session.id} className="group relative">
                <Link
                  href={`/chat/${session.id}`}
                  className={cn(
                    "flex w-full flex-col rounded-md px-3 py-2 pr-8 text-left text-sm transition-colors hover:bg-muted",
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
                <button
                  type="button"
                  onClick={(e) => handleDeleteSession(e, session.id)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  title="Delete chat"
                >
                  <Trash2Icon className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
        <div className="border-t px-3 py-2 flex items-center gap-2">
          <Link
            href="/profile"
            className="flex flex-1 items-center gap-2 rounded-md px-1 py-1.5 hover:bg-muted transition-colors min-w-0"
          >
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="text-xs">
                {profile ? getInitials(profile.full_name) : "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm truncate">
              {profile?.full_name ?? "Profile"}
            </span>
          </Link>
          <ThemeSwitcher size="sm" align="start" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Sign out"
            className="shrink-0"
          >
            <LogOutIcon className="h-4 w-4" />
          </Button>
        </div>
      </aside>
    </>
  );
}
