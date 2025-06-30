/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import type { OpenAIProvider } from "@ai-sdk/openai";
import { createOpenAI } from "@ai-sdk/openai";
import type { CloudflareEnv } from "@root/core/types";

let openAI: OpenAIProvider | undefined;

/**
 * Returns an OpenAI provider instance.
 */
export function getOpenAI(env: CloudflareEnv) {
  if (!openAI) {
    openAI = createOpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  return openAI;
}
