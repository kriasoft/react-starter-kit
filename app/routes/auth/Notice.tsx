/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Link, Typography, TypographyProps } from "@mui/material";
import { config } from "../../core/config.js";

export function Notice(props: NoticeProps): JSX.Element {
  const { sx, ...other } = props;

  return (
    <Typography
      sx={{
        color: "text.secondary",
        "& span": { opacity: 0.6 },
        "& a": { fontWeight: 500, opacity: 0.7 },
        "& a:hover": { opacity: 1 },
        ...sx,
      }}
      variant="body2"
      {...other}
    >
      <span>
        By clicking Continue above, your acknowledge that your have read and
        understood, and agree to {config.app.name}&apos;s
      </span>{" "}
      <Link color="inherit" href="/terms">
        Terms & Conditions
      </Link>
      <span> and </span>
      <Link color="inherit" href="/privacy">
        Privacy Policy
      </Link>
      <span>.</span>
    </Typography>
  );
}

type NoticeProps = Omit<TypographyProps, "children">;
