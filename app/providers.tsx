"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth/context";
import { ThemeProvider } from "@/lib/theme/provider";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <DataStreamProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </DataStreamProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
