"use client";

import {
  CheckCircleIcon,
  DownloadIcon,
  EyeIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import { useState, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ToolCallProps = HTMLAttributes<HTMLSpanElement> & {
  label: string;
};

export const ToolCall = ({ label, className, ...props }: ToolCallProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-0.5 text-xs text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
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
  actions?: React.ReactNode;
};

export const ToolResult = ({
  success,
  summary,
  actions,
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
      <CheckCircleIcon className="h-3 w-3 shrink-0" />
    ) : (
      <XCircleIcon className="h-3 w-3 shrink-0" />
    )}
    {summary}
    {actions}
  </span>
);

export type Plan = {
  title: string;
  content: string;
  created_at: string;
};

export type PlanListProps = {
  plans: Plan[];
  onDownload: (title: string, content: string) => void;
};

export const PlanList = ({ plans, onDownload }: PlanListProps) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (plans.length === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
        <CheckCircleIcon className="h-3 w-3 shrink-0" />
        No saved plans yet
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-green-200 bg-green-50 p-2 text-xs text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
      <div className="flex items-center gap-1.5 font-medium">
        <CheckCircleIcon className="h-3 w-3 shrink-0" />
        {plans.length} saved plan{plans.length !== 1 ? "s" : ""}
      </div>
      {plans.map((plan, index) => (
        <div key={index} className="flex flex-col gap-1 pl-4">
          <div className="flex items-center gap-2">
            <span className="flex-1 truncate">{plan.title}</span>
            <button
              type="button"
              onClick={() => setExpanded(expanded === index ? null : index)}
              className="flex items-center gap-0.5 rounded px-1.5 py-0.5 hover:bg-green-100 dark:hover:bg-green-800/30"
              title="Preview"
            >
              <EyeIcon className="h-3 w-3" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => onDownload(plan.title, plan.content)}
              className="flex items-center gap-0.5 rounded px-1.5 py-0.5 hover:bg-green-100 dark:hover:bg-green-800/30"
              title="Download"
            >
              <DownloadIcon className="h-3 w-3" />
              Download
            </button>
          </div>
          {expanded === index && (
            <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded border border-green-200 bg-white p-2 text-xs text-slate-700 dark:border-green-800 dark:bg-slate-900 dark:text-slate-300">
              {plan.content}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
};
