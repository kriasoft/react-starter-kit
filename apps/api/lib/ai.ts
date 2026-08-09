import type { OpenAIProvider } from "@ai-sdk/openai";
import { createOpenAI } from "@ai-sdk/openai";
import type { TRPCContext } from "./context";

type OpenAIContext = Pick<TRPCContext, "env" | "cache">;

// Request-scoped cache key for the provider instance.
const OPENAI_PROVIDER = Symbol("openaiProvider");

/**
 * Returns a request-scoped OpenAI provider instance.
 * Pass the tRPC context to reuse the provider within a single request.
 */
export function getOpenAI(ctx: OpenAIContext): OpenAIProvider {
  if (ctx.cache.has(OPENAI_PROVIDER)) {
    return ctx.cache.get(OPENAI_PROVIDER) as OpenAIProvider;
  }

  // Optional integration: fail here with the fix rather than letting the SDK
  // report an opaque auth error on the first completion.
  const apiKey = ctx.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set — AI features are unavailable");
  }

  const provider = createOpenAI({ apiKey });

  ctx.cache.set(OPENAI_PROVIDER, provider);

  return provider;
}
