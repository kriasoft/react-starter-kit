/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import history from "history/browser";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "./common";

const container = document.getElementById("root") as HTMLElement;
const data = (document.getElementById("data") as HTMLScriptElement).text;

// TODO: Initialize local store (Relay, Apollo, Redux, etc.)
// const store = createRelay({ data: JSON.parse(data) });

// Render the top-level React component
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App history={history} />
  </React.StrictMode>
);
