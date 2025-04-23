/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { customAlphabet, urlAlphabet } from "nanoid";

const shortIdAlphabet = urlAlphabet.replace(/[-_]/g, "");

/**
 * Generates secure unique ID using URL friendly characters.
 *
 * @see https://github.com/ai/nanoid#readme
 */
export const newId = customAlphabet(shortIdAlphabet, 10);
