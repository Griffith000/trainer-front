import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const MODELS = {
  trinity_large: "arcee-ai/trinity-large-preview:free",
  mistral_small: "mistralai/mistral-small-3.1-24b-instruct:free",
  gemma_3_12b_it: "google/gemma-3-12b-it:free",
  gpt_20b_oss: "openai/gpt-oss-20b:free",
} as const;

export type ModelKey = keyof typeof MODELS;

export function getModel(key: ModelKey) {
  return openrouter(MODELS[key]);
}

export const DEFAULT_MODEL: ModelKey = "gpt_20b_oss";
