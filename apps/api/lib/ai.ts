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

  const provider = createOpenAI({
    apiKey: ctx.env.OPENAI_API_KEY,
  });

  ctx.cache.set(OPENAI_PROVIDER, provider);

  return provider;
}
