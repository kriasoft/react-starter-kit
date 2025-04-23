/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { OpenAI } from "openai";
import { env } from "./env";

/**
 * OpenAI API client.
 *
 * @see https://github.com/openai/openai-node#readme
 */
export const openai = new OpenAI({
  organization: env.OPENAI_ORGANIZATION,
  apiKey: env.OPENAI_API_KEY,
});
