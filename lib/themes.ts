// Theme definitions for AI Coach
// All colors use OKLCH color space for better perceptual uniformity

export type ThemeName = "pulse" | "zen" | "power" | "solar" | "midnight";
export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

export interface Theme {
  name: ThemeName;
  displayName: string;
  description: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export const themes: Record<ThemeName, Theme> = {
  // Pulse - Energetic, vibrant (Electric coral/orange, deep navy)
  pulse: {
    name: "pulse",
    displayName: "Pulse",
    description: "Energetic and vibrant",
    light: {
      background: "oklch(0.98 0.005 60)",
      foreground: "oklch(0.2 0.05 260)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.2 0.05 260)",
      popover: "oklch(1 0 0)",
      popoverForeground: "oklch(0.2 0.05 260)",
      primary: "oklch(0.65 0.2 30)", // Electric coral
      primaryForeground: "oklch(0.98 0.005 60)",
      secondary: "oklch(0.95 0.02 60)",
      secondaryForeground: "oklch(0.25 0.05 260)",
      muted: "oklch(0.95 0.01 60)",
      mutedForeground: "oklch(0.5 0.03 260)",
      accent: "oklch(0.75 0.15 50)", // Warm orange accent
      accentForeground: "oklch(0.2 0.05 260)",
      destructive: "oklch(0.55 0.25 25)",
      border: "oklch(0.9 0.02 60)",
      input: "oklch(0.9 0.02 60)",
      ring: "oklch(0.65 0.2 30)",
      chart1: "oklch(0.65 0.2 30)",
      chart2: "oklch(0.7 0.15 180)",
      chart3: "oklch(0.6 0.18 280)",
      chart4: "oklch(0.75 0.15 50)",
      chart5: "oklch(0.55 0.2 330)",
      sidebar: "oklch(0.97 0.01 60)",
      sidebarForeground: "oklch(0.2 0.05 260)",
      sidebarPrimary: "oklch(0.65 0.2 30)",
      sidebarPrimaryForeground: "oklch(0.98 0.005 60)",
      sidebarAccent: "oklch(0.93 0.02 60)",
      sidebarAccentForeground: "oklch(0.25 0.05 260)",
      sidebarBorder: "oklch(0.9 0.02 60)",
      sidebarRing: "oklch(0.65 0.2 30)",
    },
    dark: {
      background: "oklch(0.15 0.03 260)",
      foreground: "oklch(0.95 0.01 60)",
      card: "oklch(0.2 0.035 260)",
      cardForeground: "oklch(0.95 0.01 60)",
      popover: "oklch(0.2 0.035 260)",
      popoverForeground: "oklch(0.95 0.01 60)",
      primary: "oklch(0.7 0.2 30)", // Brighter coral for dark mode
      primaryForeground: "oklch(0.15 0.03 260)",
      secondary: "oklch(0.25 0.04 260)",
      secondaryForeground: "oklch(0.95 0.01 60)",
      muted: "oklch(0.25 0.03 260)",
      mutedForeground: "oklch(0.65 0.03 260)",
      accent: "oklch(0.75 0.18 50)",
      accentForeground: "oklch(0.98 0.005 60)",
      destructive: "oklch(0.65 0.22 25)",
      border: "oklch(1 0 0 / 12%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.7 0.2 30)",
      chart1: "oklch(0.7 0.2 30)",
      chart2: "oklch(0.65 0.18 180)",
      chart3: "oklch(0.55 0.2 280)",
      chart4: "oklch(0.7 0.18 50)",
      chart5: "oklch(0.6 0.22 330)",
      sidebar: "oklch(0.18 0.035 260)",
      sidebarForeground: "oklch(0.95 0.01 60)",
      sidebarPrimary: "oklch(0.7 0.2 30)",
      sidebarPrimaryForeground: "oklch(0.95 0.01 60)",
      sidebarAccent: "oklch(0.25 0.04 260)",
      sidebarAccentForeground: "oklch(0.95 0.01 60)",
      sidebarBorder: "oklch(1 0 0 / 10%)",
      sidebarRing: "oklch(0.7 0.2 30)",
    },
  },

  // Zen - Calm, focused (Sage green, warm stone)
  zen: {
    name: "zen",
    displayName: "Zen",
    description: "Calm and focused",
    light: {
      background: "oklch(0.98 0.008 100)",
      foreground: "oklch(0.25 0.03 100)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.25 0.03 100)",
      popover: "oklch(1 0 0)",
      popoverForeground: "oklch(0.25 0.03 100)",
      primary: "oklch(0.55 0.12 145)", // Sage green
      primaryForeground: "oklch(0.98 0.005 100)",
      secondary: "oklch(0.94 0.015 90)",
      secondaryForeground: "oklch(0.3 0.03 100)",
      muted: "oklch(0.94 0.01 90)",
      mutedForeground: "oklch(0.5 0.025 100)",
      accent: "oklch(0.7 0.08 80)", // Warm stone
      accentForeground: "oklch(0.25 0.03 100)",
      destructive: "oklch(0.55 0.22 25)",
      border: "oklch(0.9 0.015 100)",
      input: "oklch(0.9 0.015 100)",
      ring: "oklch(0.55 0.12 145)",
      chart1: "oklch(0.55 0.12 145)",
      chart2: "oklch(0.65 0.1 180)",
      chart3: "oklch(0.7 0.08 80)",
      chart4: "oklch(0.6 0.15 200)",
      chart5: "oklch(0.5 0.1 120)",
      sidebar: "oklch(0.96 0.01 100)",
      sidebarForeground: "oklch(0.25 0.03 100)",
      sidebarPrimary: "oklch(0.55 0.12 145)",
      sidebarPrimaryForeground: "oklch(0.98 0.005 100)",
      sidebarAccent: "oklch(0.92 0.015 90)",
      sidebarAccentForeground: "oklch(0.3 0.03 100)",
      sidebarBorder: "oklch(0.9 0.015 100)",
      sidebarRing: "oklch(0.55 0.12 145)",
    },
    dark: {
      background: "oklch(0.18 0.02 100)",
      foreground: "oklch(0.92 0.01 100)",
      card: "oklch(0.22 0.025 100)",
      cardForeground: "oklch(0.92 0.01 100)",
      popover: "oklch(0.22 0.025 100)",
      popoverForeground: "oklch(0.92 0.01 100)",
      primary: "oklch(0.65 0.12 145)",
      primaryForeground: "oklch(0.18 0.02 100)",
      secondary: "oklch(0.28 0.025 100)",
      secondaryForeground: "oklch(0.92 0.01 100)",
      muted: "oklch(0.28 0.02 100)",
      mutedForeground: "oklch(0.62 0.025 100)",
      accent: "oklch(0.6 0.08 80)",
      accentForeground: "oklch(0.92 0.01 100)",
      destructive: "oklch(0.6 0.2 25)",
      border: "oklch(1 0 0 / 12%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.65 0.12 145)",
      chart1: "oklch(0.65 0.12 145)",
      chart2: "oklch(0.6 0.12 180)",
      chart3: "oklch(0.65 0.1 80)",
      chart4: "oklch(0.55 0.15 200)",
      chart5: "oklch(0.5 0.12 120)",
      sidebar: "oklch(0.2 0.025 100)",
      sidebarForeground: "oklch(0.92 0.01 100)",
      sidebarPrimary: "oklch(0.65 0.12 145)",
      sidebarPrimaryForeground: "oklch(0.92 0.01 100)",
      sidebarAccent: "oklch(0.28 0.025 100)",
      sidebarAccentForeground: "oklch(0.92 0.01 100)",
      sidebarBorder: "oklch(1 0 0 / 10%)",
      sidebarRing: "oklch(0.65 0.12 145)",
    },
  },

  // Power - Bold, intense (Deep purple, hot pink accents)
  power: {
    name: "power",
    displayName: "Power",
    description: "Bold and intense",
    light: {
      background: "oklch(0.98 0.008 300)",
      foreground: "oklch(0.2 0.05 300)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.2 0.05 300)",
      popover: "oklch(1 0 0)",
      popoverForeground: "oklch(0.2 0.05 300)",
      primary: "oklch(0.45 0.25 300)", // Deep purple
      primaryForeground: "oklch(0.98 0.005 300)",
      secondary: "oklch(0.94 0.025 310)",
      secondaryForeground: "oklch(0.25 0.05 300)",
      muted: "oklch(0.94 0.015 300)",
      mutedForeground: "oklch(0.5 0.04 300)",
      accent: "oklch(0.65 0.25 340)", // Hot pink
      accentForeground: "oklch(0.98 0.005 300)",
      destructive: "oklch(0.55 0.25 25)",
      border: "oklch(0.9 0.02 300)",
      input: "oklch(0.9 0.02 300)",
      ring: "oklch(0.45 0.25 300)",
      chart1: "oklch(0.45 0.25 300)",
      chart2: "oklch(0.65 0.25 340)",
      chart3: "oklch(0.6 0.2 270)",
      chart4: "oklch(0.7 0.15 320)",
      chart5: "oklch(0.5 0.22 280)",
      sidebar: "oklch(0.96 0.015 300)",
      sidebarForeground: "oklch(0.2 0.05 300)",
      sidebarPrimary: "oklch(0.45 0.25 300)",
      sidebarPrimaryForeground: "oklch(0.98 0.005 300)",
      sidebarAccent: "oklch(0.92 0.025 310)",
      sidebarAccentForeground: "oklch(0.25 0.05 300)",
      sidebarBorder: "oklch(0.9 0.02 300)",
      sidebarRing: "oklch(0.45 0.25 300)",
    },
    dark: {
      background: "oklch(0.15 0.04 300)",
      foreground: "oklch(0.95 0.015 300)",
      card: "oklch(0.2 0.045 300)",
      cardForeground: "oklch(0.95 0.015 300)",
      popover: "oklch(0.2 0.045 300)",
      popoverForeground: "oklch(0.95 0.015 300)",
      primary: "oklch(0.6 0.25 300)",
      primaryForeground: "oklch(0.15 0.04 300)",
      secondary: "oklch(0.28 0.05 300)",
      secondaryForeground: "oklch(0.95 0.015 300)",
      muted: "oklch(0.28 0.04 300)",
      mutedForeground: "oklch(0.65 0.04 300)",
      accent: "oklch(0.7 0.25 340)",
      accentForeground: "oklch(0.98 0.005 300)",
      destructive: "oklch(0.65 0.22 25)",
      border: "oklch(1 0 0 / 12%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.6 0.25 300)",
      chart1: "oklch(0.6 0.25 300)",
      chart2: "oklch(0.7 0.25 340)",
      chart3: "oklch(0.55 0.22 270)",
      chart4: "oklch(0.65 0.18 320)",
      chart5: "oklch(0.5 0.25 280)",
      sidebar: "oklch(0.18 0.045 300)",
      sidebarForeground: "oklch(0.95 0.015 300)",
      sidebarPrimary: "oklch(0.6 0.25 300)",
      sidebarPrimaryForeground: "oklch(0.95 0.015 300)",
      sidebarAccent: "oklch(0.28 0.05 300)",
      sidebarAccentForeground: "oklch(0.95 0.015 300)",
      sidebarBorder: "oklch(1 0 0 / 10%)",
      sidebarRing: "oklch(0.6 0.25 300)",
    },
  },

  // Solar - Bright, optimistic (Golden yellow, warm amber)
  solar: {
    name: "solar",
    displayName: "Solar",
    description: "Bright and optimistic",
    light: {
      background: "oklch(0.99 0.008 85)",
      foreground: "oklch(0.25 0.05 60)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.25 0.05 60)",
      popover: "oklch(1 0 0)",
      popoverForeground: "oklch(0.25 0.05 60)",
      primary: "oklch(0.75 0.18 85)", // Golden yellow
      primaryForeground: "oklch(0.25 0.05 60)",
      secondary: "oklch(0.95 0.025 80)",
      secondaryForeground: "oklch(0.3 0.05 60)",
      muted: "oklch(0.95 0.015 80)",
      mutedForeground: "oklch(0.5 0.04 60)",
      accent: "oklch(0.7 0.16 55)", // Warm amber
      accentForeground: "oklch(0.25 0.05 60)",
      destructive: "oklch(0.55 0.25 25)",
      border: "oklch(0.9 0.02 80)",
      input: "oklch(0.9 0.02 80)",
      ring: "oklch(0.75 0.18 85)",
      chart1: "oklch(0.75 0.18 85)",
      chart2: "oklch(0.7 0.16 55)",
      chart3: "oklch(0.65 0.2 35)",
      chart4: "oklch(0.8 0.12 100)",
      chart5: "oklch(0.6 0.15 70)",
      sidebar: "oklch(0.97 0.015 85)",
      sidebarForeground: "oklch(0.25 0.05 60)",
      sidebarPrimary: "oklch(0.75 0.18 85)",
      sidebarPrimaryForeground: "oklch(0.25 0.05 60)",
      sidebarAccent: "oklch(0.93 0.025 80)",
      sidebarAccentForeground: "oklch(0.3 0.05 60)",
      sidebarBorder: "oklch(0.9 0.02 80)",
      sidebarRing: "oklch(0.75 0.18 85)",
    },
    dark: {
      background: "oklch(0.18 0.03 60)",
      foreground: "oklch(0.95 0.015 80)",
      card: "oklch(0.22 0.035 60)",
      cardForeground: "oklch(0.95 0.015 80)",
      popover: "oklch(0.22 0.035 60)",
      popoverForeground: "oklch(0.95 0.015 80)",
      primary: "oklch(0.8 0.18 85)",
      primaryForeground: "oklch(0.2 0.04 60)",
      secondary: "oklch(0.28 0.04 60)",
      secondaryForeground: "oklch(0.95 0.015 80)",
      muted: "oklch(0.28 0.03 60)",
      mutedForeground: "oklch(0.65 0.035 60)",
      accent: "oklch(0.72 0.18 55)",
      accentForeground: "oklch(0.95 0.015 80)",
      destructive: "oklch(0.65 0.22 25)",
      border: "oklch(1 0 0 / 12%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.8 0.18 85)",
      chart1: "oklch(0.8 0.18 85)",
      chart2: "oklch(0.72 0.18 55)",
      chart3: "oklch(0.65 0.22 35)",
      chart4: "oklch(0.75 0.14 100)",
      chart5: "oklch(0.6 0.18 70)",
      sidebar: "oklch(0.2 0.035 60)",
      sidebarForeground: "oklch(0.95 0.015 80)",
      sidebarPrimary: "oklch(0.8 0.18 85)",
      sidebarPrimaryForeground: "oklch(0.95 0.015 80)",
      sidebarAccent: "oklch(0.28 0.04 60)",
      sidebarAccentForeground: "oklch(0.95 0.015 80)",
      sidebarBorder: "oklch(1 0 0 / 10%)",
      sidebarRing: "oklch(0.8 0.18 85)",
    },
  },

  // Midnight - Sleek, modern (Cyan/teal, charcoal)
  midnight: {
    name: "midnight",
    displayName: "Midnight",
    description: "Sleek and modern",
    light: {
      background: "oklch(0.98 0.008 220)",
      foreground: "oklch(0.2 0.04 220)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.2 0.04 220)",
      popover: "oklch(1 0 0)",
      popoverForeground: "oklch(0.2 0.04 220)",
      primary: "oklch(0.6 0.15 195)", // Cyan/teal
      primaryForeground: "oklch(0.98 0.005 220)",
      secondary: "oklch(0.94 0.015 220)",
      secondaryForeground: "oklch(0.25 0.04 220)",
      muted: "oklch(0.94 0.01 220)",
      mutedForeground: "oklch(0.5 0.03 220)",
      accent: "oklch(0.65 0.12 240)", // Cool blue accent
      accentForeground: "oklch(0.98 0.005 220)",
      destructive: "oklch(0.55 0.25 25)",
      border: "oklch(0.9 0.015 220)",
      input: "oklch(0.9 0.015 220)",
      ring: "oklch(0.6 0.15 195)",
      chart1: "oklch(0.6 0.15 195)",
      chart2: "oklch(0.65 0.12 240)",
      chart3: "oklch(0.55 0.18 280)",
      chart4: "oklch(0.7 0.1 180)",
      chart5: "oklch(0.5 0.15 210)",
      sidebar: "oklch(0.96 0.01 220)",
      sidebarForeground: "oklch(0.2 0.04 220)",
      sidebarPrimary: "oklch(0.6 0.15 195)",
      sidebarPrimaryForeground: "oklch(0.98 0.005 220)",
      sidebarAccent: "oklch(0.92 0.015 220)",
      sidebarAccentForeground: "oklch(0.25 0.04 220)",
      sidebarBorder: "oklch(0.9 0.015 220)",
      sidebarRing: "oklch(0.6 0.15 195)",
    },
    dark: {
      background: "oklch(0.14 0.025 220)",
      foreground: "oklch(0.95 0.01 220)",
      card: "oklch(0.18 0.03 220)",
      cardForeground: "oklch(0.95 0.01 220)",
      popover: "oklch(0.18 0.03 220)",
      popoverForeground: "oklch(0.95 0.01 220)",
      primary: "oklch(0.7 0.15 195)",
      primaryForeground: "oklch(0.14 0.025 220)",
      secondary: "oklch(0.25 0.03 220)",
      secondaryForeground: "oklch(0.95 0.01 220)",
      muted: "oklch(0.25 0.025 220)",
      mutedForeground: "oklch(0.65 0.03 220)",
      accent: "oklch(0.65 0.15 240)",
      accentForeground: "oklch(0.98 0.005 220)",
      destructive: "oklch(0.65 0.22 25)",
      border: "oklch(1 0 0 / 12%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.7 0.15 195)",
      chart1: "oklch(0.7 0.15 195)",
      chart2: "oklch(0.65 0.15 240)",
      chart3: "oklch(0.55 0.2 280)",
      chart4: "oklch(0.65 0.12 180)",
      chart5: "oklch(0.5 0.18 210)",
      sidebar: "oklch(0.16 0.03 220)",
      sidebarForeground: "oklch(0.95 0.01 220)",
      sidebarPrimary: "oklch(0.7 0.15 195)",
      sidebarPrimaryForeground: "oklch(0.95 0.01 220)",
      sidebarAccent: "oklch(0.25 0.03 220)",
      sidebarAccentForeground: "oklch(0.95 0.01 220)",
      sidebarBorder: "oklch(1 0 0 / 10%)",
      sidebarRing: "oklch(0.7 0.15 195)",
    },
  },
};

export const themeNames = Object.keys(themes) as ThemeName[];
export const defaultTheme: ThemeName = "pulse";
export const defaultMode: ThemeMode = "light";

// Helper to get CSS variable mapping
export function getThemeCSSVariables(
  theme: ThemeColors,
): Record<string, string> {
  return {
    "--background": theme.background,
    "--foreground": theme.foreground,
    "--card": theme.card,
    "--card-foreground": theme.cardForeground,
    "--popover": theme.popover,
    "--popover-foreground": theme.popoverForeground,
    "--primary": theme.primary,
    "--primary-foreground": theme.primaryForeground,
    "--secondary": theme.secondary,
    "--secondary-foreground": theme.secondaryForeground,
    "--muted": theme.muted,
    "--muted-foreground": theme.mutedForeground,
    "--accent": theme.accent,
    "--accent-foreground": theme.accentForeground,
    "--destructive": theme.destructive,
    "--border": theme.border,
    "--input": theme.input,
    "--ring": theme.ring,
    "--chart-1": theme.chart1,
    "--chart-2": theme.chart2,
    "--chart-3": theme.chart3,
    "--chart-4": theme.chart4,
    "--chart-5": theme.chart5,
    "--sidebar": theme.sidebar,
    "--sidebar-foreground": theme.sidebarForeground,
    "--sidebar-primary": theme.sidebarPrimary,
    "--sidebar-primary-foreground": theme.sidebarPrimaryForeground,
    "--sidebar-accent": theme.sidebarAccent,
    "--sidebar-accent-foreground": theme.sidebarAccentForeground,
    "--sidebar-border": theme.sidebarBorder,
    "--sidebar-ring": theme.sidebarRing,
  };
}
