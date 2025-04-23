/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { cleanEnv, str } from "envalid";

/**
 * Environment variables that has been validated and sanitized.
 *
 * @see https://github.com/ilyakaznacheev/cleanenv#readme
 */
export const env = cleanEnv(process.env, {
  VERSION: str({ default: "latest" }),

  APP_STORAGE_BUCKET: str(),

  GOOGLE_CLOUD_PROJECT: str(),
  GOOGLE_CLOUD_DATABASE: str(),

  OPENAI_ORGANIZATION: str(),
  OPENAI_API_KEY: str(),
});
