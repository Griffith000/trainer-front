"use client";

import { CheckCircleIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ToolCallProps = HTMLAttributes<HTMLSpanElement> & {
  label: string;
};

export const ToolCall = ({ label, className, ...props }: ToolCallProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400",
      className,
    )}
    {...props}
  >
    <Loader2Icon className="h-3 w-3 animate-spin" />
    {label}
  </span>
);

export type ToolResultProps = HTMLAttributes<HTMLSpanElement> & {
  success: boolean;
  summary: string;
};

export const ToolResult = ({
  success,
  summary,
  className,
  ...props
}: ToolResultProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs",
      success
        ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
        : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
      className,
    )}
    {...props}
  >
    {success ? (
      <CheckCircleIcon className="h-3 w-3" />
    ) : (
      <XCircleIcon className="h-3 w-3" />
    )}
    {summary}
  </span>
);
