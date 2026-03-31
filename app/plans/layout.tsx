import type { ReactNode } from "react";
import { ChatShell } from "@/components/chat/ChatShell";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import Link from "next/link";
import { BookOpen, Utensils } from "lucide-react";

export default function PlansLayout({ children }: { children: ReactNode }) {
  return (
    <ChatShell>
      <div className="flex flex-1 flex-col h-full bg-background">
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold ml-10 md:ml-0">My Plans</h1>
            <nav className="flex items-center gap-2 text-sm font-medium">
              <Link href="/plans/workout" className="flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-muted text-muted-foreground hover:text-foreground">
                <BookOpen className="h-4 w-4" />
                Workout
              </Link>
              <Link href="/plans/diet" className="flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-muted text-muted-foreground hover:text-foreground">
                <Utensils className="h-4 w-4" />
                Diet
              </Link>
            </nav>
          </div>
          <ThemeSwitcher />
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </ChatShell>
  );
}
