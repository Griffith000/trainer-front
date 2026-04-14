"use client";

import { PanelLeftIcon, BookOpenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function ChatShell({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggle = () => setIsOpen((v) => !v);

  return (
    <div className="flex h-screen">
      {/* Mobile: Sheet overlay */}
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="w-60 p-0">
            <ChatSidebar />
          </SheetContent>
        </Sheet>
      ) : (
        /* Desktop: slide in/out */
        <div
          className={cn(
            "flex-shrink-0 overflow-hidden transition-all duration-300",
            isOpen ? "w-60" : "w-0",
          )}
        >
          <ChatSidebar onToggle={toggle} />
        </div>
      )}

      <main className="relative flex flex-1 flex-col overflow-hidden">
        {/* Toggle button — shown when sidebar is closed or on mobile */}
        {(!isOpen || isMobile) && (
          <div className="absolute left-2 top-2 z-10 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              title={isOpen ? "Close sidebar" : "Open sidebar"}
            >
              <PanelLeftIcon className="h-4 w-4" />
            </Button>
            <Link href="/plans/workout">
              <Button variant="ghost" size="icon" title="My Plans">
                <BookOpenIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
