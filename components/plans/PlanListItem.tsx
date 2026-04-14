"use client";

import { useState } from "react";
import { PlanDialog } from "./PlanDialog";
import { CalendarIcon, ChevronRightIcon } from "lucide-react";

interface Plan {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export function PlanListItem({ plan, type }: { plan: Plan; type: "workout" | "diet" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group w-full flex items-center justify-between px-4 py-3 rounded-lg border bg-card hover:bg-muted/50 hover:border-foreground/20 transition-all text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-medium truncate">
            {plan.title || "Untitled Plan"}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-muted-foreground">
          <span className="flex items-center gap-1 text-xs">
            <CalendarIcon className="h-3 w-3" />
            {new Date(plan.created_at).toLocaleDateString()}
          </span>
          <ChevronRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>

      <PlanDialog
        plan={plan}
        type={type}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
