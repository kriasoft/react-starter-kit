/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import configs from "../config";

// Get the name of the current environment from `<body data-env="...">`,
// which is being injected by the Cloudflare Worker script.
const envName = document.body.dataset.env || "local";
const config = configs[envName as unknown as keyof typeof configs];

if (!config) throw new Error();

export { config };
