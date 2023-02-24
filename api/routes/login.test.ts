/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { expect, test } from "vitest";
import { handler } from "./login.js";

test("POST /api/login", async () => {
  const req = new Request(`https://${bindings.APP_HOSTNAME}/api/login`, {
    method: "POST",
    body: JSON.stringify({
      email: "test@example.com",
    }),
  });

  const res = await handler.fetch(req, bindings);

  expect({ status: res.status }).toEqual({
    status: 200,
  });
});
