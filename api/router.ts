/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { appRouter } from "./routers/app.js";
import { organizationRouter } from "./routers/organization.js";
import { userRouter } from "./routers/user.js";
import { router } from "./lib/trpc.js";

export const mainRouter = router({
  app: appRouter,
  user: userRouter,
  organization: organizationRouter,
});

export type AppRouter = typeof mainRouter;

// Export the router as default for easier imports
export { mainRouter as appRouter, mainRouter as router };
