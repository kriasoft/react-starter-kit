import { configuredSocialProviders } from "../lib/auth.js";
import { publicProcedure, router } from "../lib/trpc.js";

export const configRouter = router({
  // Which social sign-in buttons the SPA should render. Optional integrations
  // are configured server-side, so the client cannot know at build time which
  // of them this deployment enabled.
  socialProviders: publicProcedure.query(({ ctx }) =>
    configuredSocialProviders(ctx.env),
  ),
});
