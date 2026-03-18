"use client";

import { Check, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/lib/theme/use-theme";
import {
  type ThemeColors,
  type ThemeMode,
  type ThemeName,
  themeNames,
  themes,
} from "@/lib/themes";
import { cn } from "@/lib/utils";

interface ThemePreviewCardProps {
  colors: ThemeColors;
  isActive?: boolean;
  size?: "sm" | "default";
}

/**
 * Mini website card preview showing theme colors
 */
function ThemePreviewCard({
  colors,
  isActive = false,
  size = "default",
}: ThemePreviewCardProps) {
  const dimensions = size === "sm" ? "w-10 h-8" : "w-14 h-11";
  const headerHeight = size === "sm" ? "h-1.5" : "h-2";
  const padding = size === "sm" ? "p-0.5" : "p-1";
  const lineHeight = size === "sm" ? "h-[2px]" : "h-[3px]";
  const buttonHeight = size === "sm" ? "h-1" : "h-1.5";

  return (
    <div
      className={cn(
        dimensions,
        "rounded-sm overflow-hidden border-2 transition-all flex flex-col",
      )}
      style={{
        backgroundColor: colors.background,
        borderColor: isActive ? colors.accent : colors.border,
        boxShadow: isActive ? `0 0 0 1px ${colors.accent}50` : undefined,
      }}
    >
      {/* Header bar */}
      <div
        className={headerHeight}
        style={{ backgroundColor: colors.primary }}
      />

      {/* Body content */}
      <div
        className={cn(padding, "flex-1 flex flex-col justify-center gap-0.5")}
      >
        {/* Text lines */}
        <div
          className={cn(lineHeight, "rounded-full w-[70%]")}
          style={{ backgroundColor: colors.foreground }}
        />
        <div
          className={cn(lineHeight, "rounded-full w-[50%] opacity-50")}
          style={{ backgroundColor: colors.mutedForeground }}
        />
        {/* Button */}
        <div
          className={cn(buttonHeight, "rounded-sm w-[45%] mt-0.5")}
          style={{ backgroundColor: colors.accent }}
        />
      </div>
    </div>
  );
}

interface ThemeSwitcherProps {
  size?: "sm" | "default";
  align?: "start" | "center" | "end";
}

/**
 * Theme switcher with sun/moon icon button that opens full theme selector
 */
export function ThemeSwitcher({
  size = "default",
  align = "end",
}: ThemeSwitcherProps) {
  const { theme, mode, setTheme, setMode } = useTheme();

  const buttonSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const previewSize = size === "sm" ? "sm" : "default";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={buttonSize}
          title="Theme settings"
        >
          {mode === "dark" ? (
            <Moon className={iconSize} />
          ) : (
            <Sun className={iconSize} />
          )}
          <span className="sr-only">Theme settings</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align={align} className="w-72 p-3">
        {/* Theme selection header */}
        <div className="text-sm font-medium mb-3">Choose Theme</div>

        <div className="space-y-2 p-3">
          <div className="text-sm font-medium">Mode</div>
          <div className="grid grid-cols-2 gap-2">
            <ModeButton
              mode="light"
              currentMode={mode}
              onClick={() => setMode("light")}
            />
            <ModeButton
              mode="dark"
              currentMode={mode}
              onClick={() => setMode("dark")}
            />
          </div>
        </div>

        <div className="border-t mb-3" />

        {/* Theme grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {themeNames.map((themeName) => {
            const themeData = themes[themeName];
            const colors = mode === "dark" ? themeData.dark : themeData.light;
            const isActive = theme === themeName;

            return (
              <button
                key={themeName}
                type="button"
                onClick={() => setTheme(themeName)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors",
                  "hover:bg-muted/50",
                  isActive && "bg-muted",
                )}
              >
                <div className="relative">
                  <ThemePreviewCard
                    colors={colors}
                    isActive={isActive}
                    size={previewSize}
                  />
                  {isActive && (
                    <div
                      className="absolute -top-1 -right-1 rounded-full p-0.5"
                      style={{ backgroundColor: colors.accent }}
                    >
                      <Check
                        className="h-2 w-2"
                        style={{ color: colors.background }}
                      />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium">
                  {themeData.displayName}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface ModeButtonProps {
  mode: ThemeMode;
  currentMode: ThemeMode;
  onClick: () => void;
}

function ModeButton({ mode, currentMode, onClick }: ModeButtonProps) {
  const isActive = mode === currentMode;
  const Icon = mode === "light" ? Sun : Moon;
  const label = mode === "light" ? "Light" : "Dark";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "bg-muted hover:bg-muted/80 text-muted-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
