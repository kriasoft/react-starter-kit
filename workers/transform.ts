/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { type Environment } from "relay-runtime";
import { type RouterResponse } from "../core/router";

/**
 * Injects HTML page metadata (title, description, etc.) as well as
 * the serialized Relay store.
 */
export function transform(
  res: Response,
  route: RouterResponse,
  relay: Environment
): Response {
  return new HTMLRewriter()
    .on("title:first-of-type", {
      // <title>...</title>
      element(el) {
        if (route.title) {
          el.setInnerContent(route.title);
        }
      },
    })
    .on('meta[name="description"]:first-of-type', {
      // <meta name="description" content="..." />
      element(el) {
        if (route.description) {
          el.setAttribute("content", route.description);
        }
      },
    })
    .on("script#data", {
      element(el) {
        // <script id="data" type="application/json"></script>
        // https://developer.mozilla.org/docs/Web/HTML/Element/script#embedding_data_in_html
        const data = relay.getStore().getSource().toJSON();
        const json = JSON.stringify(data).replace(
          /<\/script/g,
          "</\\u0073cript"
        );
        el.setInnerContent(json, { html: true });
      },
    })
    .on("script#env", {
      element(el) {
        // <script id="env"></script>
        // https://developer.mozilla.org/docs/Web/HTML/Element/script#embedding_data_in_html
        el.setInnerContent(
          [
            `Object.defineProperty(window,"env",{value:Object.freeze({`,
            `APP_ENV:${JSON.stringify(APP_ENV)},`,
            `APP_ORIGIN:${JSON.stringify(APP_ORIGIN)},`,
            `API_ORIGIN:${JSON.stringify(API_ORIGIN)},`,
            `GOOGLE_CLOUD_PROJECT:${JSON.stringify(GOOGLE_CLOUD_PROJECT)},`,
            `GOOGLE_CLOUD_REGION:${JSON.stringify(GOOGLE_CLOUD_REGION)},`,
            `FIREBASE_AUTH_KEY:${JSON.stringify(FIREBASE_AUTH_KEY)},`,
            `GA_MEASUREMENT_ID:${JSON.stringify(GA_MEASUREMENT_ID)}`,
            `})});`,
          ].join(""),
          { html: true }
        );
      },
    })
    .transform(res);
}
