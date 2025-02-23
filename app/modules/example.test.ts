/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { expect, test } from "vitest";

test("example", () => {
  expect({ pass: true }).toMatchInlineSnapshot(`
    {
      "pass": true,
    }
  `);
});
