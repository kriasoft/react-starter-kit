/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { expect, test } from "vitest";
import { handler } from "./echo.js";

test("GET /echo", async () => {
  // Initialize an HTTP GET request object
  const env = getMiniflareBindings();
  const req = new Request(`https://${env.APP_HOSTNAME}/echo`);
  req.headers.set("Content-Type", "application/json");

  // Fetch the target URL and parse the response
  const res = await handler.fetch(req, env);
  const body = await res
    .json()
    .catch(() => res.text())
    .catch(() => undefined);

  // Compare the response with the expected result
  expect({ status: res.status, body }).toEqual({
    status: 200,
    body: {
      headers: {
        "content-type": "application/json",
      },
    },
  });
});
