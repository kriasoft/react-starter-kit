/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { app } from "./core/app.js";
// Register `/api/login` route handler
import "./routes/login.js";
// Register `/api/*` middleware
import "./routes/swapi.js";

export default app;
