"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api/client";
import { Trash2Icon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlanCard({ plan, type }: { plan: any; type: "workout" | "diet" }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(plan.title || "");
  const [content, setContent] = useState(plan.content || "");
  const [isFocused, setIsFocused] = useState(false);
  
  const endpoint = `/api/chat/${type}-plans/${plan.id}/`;

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.patch(endpoint, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${type}-plans`] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${type}-plans`] });
    }
  });

  const handleBlur = () => {
    setIsFocused(false);
    if (title !== plan.title || content !== plan.content) {
      updateMutation.mutate({ title, content });
    }
  };

  const handleFocus = () => setIsFocused(true);

  // Auto-resize textarea logic
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div 
      className={cn(
        "group relative rounded-xl border bg-card text-card-foreground shadow-sm transition-all flex flex-col p-5",
        isFocused ? "ring-2 ring-primary border-transparent shadow-md" : "hover:border-foreground/20 hover:shadow"
      )}
    >
      <button 
        onClick={() => deleteMutation.mutate()}
        disabled={deleteMutation.isPending}
        className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive p-1.5 rounded-md hover:bg-muted"
        title="Delete Plan"
      >
        {deleteMutation.isPending ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <Trash2Icon className="h-4 w-4" />}
      </button>
      
      <input
        className="text-xl font-bold bg-transparent border-none outline-none ring-0 w-[90%] mb-4 placeholder:text-muted-foreground/30 focus:outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="Untitled Plan"
      />
      
      <textarea
        ref={textareaRef}
        className="flex-1 w-full bg-transparent border-none outline-none ring-0 resize-none min-h-[120px] text-sm text-foreground/80 placeholder:text-muted-foreground/30 leading-relaxed overflow-hidden focus:outline-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="Start typing your plan here..."
      />
      
      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-muted-foreground">
         <span>{new Date(plan.created_at).toLocaleDateString()}</span>
         {updateMutation.isPending && <span className="flex items-center gap-1"><Loader2Icon className="h-3 w-3 animate-spin"/> Saving</span>}
         {updateMutation.isSuccess && !updateMutation.isPending && !isFocused && <span className="text-green-500/80">Saved</span>}
      </div>
    </div>
  );
}
