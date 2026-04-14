"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { api } from "@/lib/api/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Trash2Icon, PencilIcon, CheckIcon } from "lucide-react";

interface Plan {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface PlanDialogProps {
  plan: Plan;
  type: "workout" | "diet";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanDialog({ plan, type, open, onOpenChange }: PlanDialogProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(plan.title || "");
  const [content, setContent] = useState(plan.content || "");

  const endpoint = `/api/chat/${type}-plans/${plan.id}/`;

  const updateMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      await api.patch(endpoint, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${type}-plans`] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${type}-plans`] });
      onOpenChange(false);
    },
  });

  const handleSave = () => {
    if (title !== plan.title || content !== plan.content) {
      updateMutation.mutate({ title, content });
    }
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="flex-row items-start justify-between px-6 pt-6 pb-4 border-b gap-4">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                className="text-xl font-semibold w-full bg-transparent border-none outline-none ring-0 placeholder:text-muted-foreground/40"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Plan"
                autoFocus
              />
            ) : (
              <DialogTitle className="text-xl font-semibold truncate">
                {title || "Untitled Plan"}
              </DialogTitle>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(plan.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isEditing ? (
              <Button
                size="sm"
                variant="default"
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
                Save
              </Button>
            ) : (
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2Icon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isEditing ? (
            <textarea
              className="w-full min-h-[300px] bg-transparent border-none outline-none ring-0 resize-none text-sm leading-relaxed placeholder:text-muted-foreground/40 font-mono"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your plan in markdown..."
            />
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground italic">No content yet.</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
