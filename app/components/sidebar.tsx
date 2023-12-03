/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Sheet, SheetProps } from "@mui/joy";
import { Navigation } from "./navigation";

const width = 260;

export function Sidebar(props: SidebarProps): JSX.Element {
  const { sx, ...other } = props;

  return (
    <Sheet
      sx={{
        pt: "60px",
        px: 2,
        borderRight: ({ palette }) => `1px solid ${palette.divider}`,
        overflow: "auto",
        width,
        ...sx,
      }}
      aria-label="Sidebar"
      {...other}
    >
      <Navigation />
    </Sheet>
  );
}

export type SidebarProps = Omit<SheetProps, "children">;
