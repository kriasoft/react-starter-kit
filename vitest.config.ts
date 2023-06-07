/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { defineConfig } from "vitest/config";

/**
 * Vitest configuration.
 *
 * @see https://vitest.dev/config/
 */
export default defineConfig({
  test: {
    cache: {
      dir: "./.cache/vitest",
    },
  },
});
