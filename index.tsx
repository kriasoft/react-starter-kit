/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import history from "history/browser";
import * as ReactDOM from "react-dom";
import { App } from "./common";

// Dehydrate the initial API response
// https://developer.mozilla.org/docs/Web/HTML/Element/script#embedding_data_in_html
const data = (document.getElementById("data") as HTMLScriptElement).text;

// TODO: Initialize local store (Relay, Apollo, Redux, etc.)
// const store = createRelay(data);

// Render the top-level React component
ReactDOM.render(<App history={history} />, document.getElementById("root"));
