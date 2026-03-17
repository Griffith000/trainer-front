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
