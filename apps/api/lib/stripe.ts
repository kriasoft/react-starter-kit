import Stripe from "stripe";
import type { Env } from "./env";

// Only called when STRIPE_SECRET_KEY is verified present (see auth.ts conditional)
export function createStripeClient(env: Pick<Env, "STRIPE_SECRET_KEY">) {
  return new Stripe(env.STRIPE_SECRET_KEY!, {
    appInfo: { name: "React Starter Kit" },
  });
}
