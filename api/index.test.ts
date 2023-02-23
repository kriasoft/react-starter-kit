/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { expect, test } from "vitest";
import app from "./index.js";

test("GET /api/people/1", async () => {
  const req = new Request("http://0.0.0.0/api/people/1");
  const res = await app.fetch(req, bindings);
  const body = await res.json();

  expect({ status: res.status, body }).toEqual({
    status: 200,
    body: expect.objectContaining({
      name: "Luke Skywalker",
      url: "https://swapi.dev/api/people/1/",
    }),
  });
});
