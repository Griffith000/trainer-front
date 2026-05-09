export interface ChatSession {
  id: string;
  created_at: string;
  updated_at: string;
  title?: string;
}

export interface ChatMessage {
  id: string;
  session: string;
  role: "user" | "coach";
  content: string;
  parts?: any[];
  created_at: string;
}

export interface User {
  user_id: string;
  email: string;
  onboarding_completed: boolean;
}

export interface UserProfile {
  full_name: string;
  date_of_birth: string;
  gender: "male" | "female" | "other" | "prefer_not_to_say";
  current_weight_kg: string;
  height_cm: string;
  target_weight_kg: string;
  fitness_goal:
    | "lose_weight"
    | "build_muscle"
    | "improve_endurance"
    | "general_wellness";
  activity_level:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active";
  dietary_preferences: (
    | "vegetarian"
    | "vegan"
    | "gluten_free"
    | "no_restrictions"
  )[];
  dietary_other_text: string;
  health_notes: string;
  disclaimer_accepted_at: string;
  updated_at: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface DietPlan {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export type DayName =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface Routine {
  id: string;
  activity_name: string;
  activity_description: string;
  start_time: string; // HH:mm:ss
  end_time: string; // HH:mm:ss
  day_name: DayName;
  status: "done" | "not_done";
  last_status_update: string;
}
