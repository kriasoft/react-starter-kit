/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { expect, test } from "vitest";
import app from "./index.js";

test("GET /echo", async () => {
  const req = new Request("https://localhost/echo");
  const res = await app.fetch(req, bindings);

  expect({ status: res.status, body: await res.json() }).toMatchInlineSnapshot(`
    {
      "body": {
        "headers": {},
      },
      "status": 200,
    }
  `);
});
