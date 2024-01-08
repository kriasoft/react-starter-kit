/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import "express";
import { DecodedIdToken } from "./core/auth";

declare global {
  namespace Express {
    interface Request {
      token: DecodedIdToken | null;
    }
  }
}
