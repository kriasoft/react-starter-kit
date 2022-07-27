/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./common/App.js";

const container = document.getElementById("root") as HTMLElement;
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const data = (document.getElementById("data") as HTMLScriptElement).text;

// TODO: Initialize local store (Relay, Apollo, Redux, etc.)
// const store = createRelay({ data: JSON.parse(data) });

// Render the top-level React component
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
