/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { TypographyVariantsOptions } from "@mui/material/styles";

export const options: TypographyVariantsOptions = {
  fontFamily: [
    `-apple-system`,
    `"BlinkMacSystemFont"`,
    `"Segoe UI"`,
    `"Roboto"`,
    `"Oxygen"`,
    `"Ubuntu"`,
    `"Cantarell"`,
    `"Fira Sans"`,
    `"Droid Sans"`,
    `"Helvetica Neue"`,
    `sans-serif`,
  ].join(","),
};

export const overrides: TypographyVariantsOptions = {
  h1: { fontSize: "2em" },
  h2: { fontSize: "1.5em" },
  h3: { fontSize: "1.3em" },
  h4: { fontSize: "1em" },
  h5: { fontSize: "0.8em" },
  h6: { fontSize: "0.7em" },
  button: { textTransform: "none" },
};
