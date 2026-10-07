/**
 * Abuse guardrails for the generate endpoint: input validation, prompt
 * blocklist, Turnstile server-side verification, and a KV rate limiter.
 *
 * Each piece degrades explicitly rather than silently: an unset Turnstile
 * secret disables the captcha gate (dev only – production sets the secret),
 * and a missing KV binding disables rate limiting rather than erroring every
 * request.
 */

import { z } from "zod";

export const generateInputSchema = z.object({
  prompt: z.string().trim().min(1).max(2048),
  steps: z.int().min(1).max(8).default(4),
  turnstileToken: z.string().min(1).optional(),
  /**
   * Client retry key. A network retry replays it and receives the original
   * outcome instead of a second charge.
   */
  idempotencyKey: z
    .string()
    .min(8)
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional(),
});

export type GenerateInput = z.infer<typeof generateInputSchema>;

/** Credits per generation: 1 base, doubled above 4 steps. */
export function creditCost(steps: number): number {
  return steps > 4 ? 2 : 1;
}

/**
 * Coarse prompt blocklist for the highest-harm categories. This is a
 * first-pass filter, not moderation: it exists so a brand-new site is not a
 * free CSAM/gore printer on day one. Match is case-insensitive on word
 * fragments; expand per-site in the site layer later.
 */
const BLOCKED_PATTERNS: readonly RegExp[] = [
  /\bchild(?:ren)?\s+(?:porn|nude|naked|sex)/i,
  /\bcsam\b/i,
  /\bloli(?:con)?\s+(?:porn|nude|naked|sex|hentai)?/i,
  /\bshota(?:con)?\s+(?:porn|nude|naked|sex|hentai)?/i,
  /\bbeastiality\b/i,
  /\brape\s+(?:scene|victim)/i,
  /\bgore\s+(?:porn|sex)/i,
];

/** Returns the matched pattern source when the prompt must be rejected. */
export function findBlockedPrompt(prompt: string): string | null {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(prompt)) return pattern.source;
  }
  return null;
}

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verify a Turnstile token server-side. `secret` absent means the gate is
 * disabled (local development) and every token passes.
 */
export async function verifyTurnstile(
  secret: string | undefined,
  token: string | undefined,
  remoteIp?: string,
): Promise<boolean> {
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body,
    });
    if (!response.ok) return false;
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // Network failure verifying the captcha: fail closed. A transient error
    // inconveniences one request; an open gate serves abusers.
    return false;
  }
}

/** The subset of KV the limiter needs; satisfied by the binding and mocks. */
export type RateLimitStore = Pick<KVNamespace, "get" | "put">;

export type RateLimitDecision = {
  allowed: boolean;
  /** Attempts left in the current window (0 when blocked). */
  remaining: number;
};

/**
 * Fixed-window limiter. Deliberately best-effort: the get-then-put race can
 * undercount by one under bursts, which is fine for an abuse brake (the
 * wallet still enforces the real money constraint).
 */
export async function consumeRateLimit(
  store: RateLimitStore | undefined,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitDecision> {
  if (!store) return { allowed: true, remaining: limit };

  const windowStart = Math.floor(Date.now() / 1000 / windowSeconds);
  const windowKey = `rl:${key}:${windowStart}`;
  const count = Number((await store.get(windowKey)) ?? "0");

  if (count >= limit) return { allowed: false, remaining: 0 };

  await store.put(windowKey, String(count + 1), {
    expirationTtl: windowSeconds * 2,
  });
  return { allowed: true, remaining: limit - count - 1 };
}
