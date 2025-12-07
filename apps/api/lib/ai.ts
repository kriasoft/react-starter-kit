import type { OpenAIProvider } from "@ai-sdk/openai";
import { createOpenAI } from "@ai-sdk/openai";
import type { Env } from "./env";

// Request-scoped cache key
const OPENAI_CACHE_KEY = Symbol("openai");

/**
 * Returns an OpenAI provider instance with request-scoped caching.
 * Uses the tRPC context cache to avoid recreating the provider multiple times
 * within the same request while ensuring environment isolation.
 */
export function getOpenAI(env: Env, cache?: Map<string | symbol, unknown>) {
  // Use request-scoped cache if available (from tRPC context)
  if (cache?.has(OPENAI_CACHE_KEY)) {
    return cache.get(OPENAI_CACHE_KEY) as OpenAIProvider;
  }

  const provider = createOpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  // Cache for this request only
  cache?.set(OPENAI_CACHE_KEY, provider);

  return provider;
}
