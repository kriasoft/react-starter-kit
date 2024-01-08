/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import supertest from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "./app";

describe("GET /trpc", () => {
  it("returns NOT_FOUND response for unknown requests", async () => {
    const res = await supertest(app).get("/trpc");

    expect({
      statusCode: res.statusCode,
      body: res.body,
    }).toEqual({
      statusCode: 404,
      body: {
        error: {
          code: -32004,
          data: {
            code: "NOT_FOUND",
            httpStatus: 404,
            path: "",
          },
          message: 'No "query"-procedure on path ""',
        },
      },
    });
  });
});
