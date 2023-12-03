/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { ExpandMoreRounded, NotificationsRounded } from "@mui/icons-material";
import { Box, BoxProps, Button, IconButton } from "@mui/joy";
import { Fragment, Suspense } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../core/auth";
import { ColorSchemeButton } from "./button-color-scheme";
import { UserAvatarButton } from "./button-user-avatar";

export function Toolbar(props: ToolbarProps): JSX.Element {
  const { sx, ...other } = props;

  return (
    <Box
      sx={{
        alignItems: "center",
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        gap: 1,
        px: 2,
        ...sx,
      }}
      component="header"
      {...other}
    >
      <Button
        color="neutral"
        variant="plain"
        endDecorator={<ExpandMoreRounded />}
        children="Project Name"
      />

      <Box sx={{ flexGrow: 1 }} component="span" />

      <Suspense>
        <ActionButtons />
      </Suspense>
    </Box>
  );
}

function ActionButtons(): JSX.Element {
  const user = useCurrentUser();

  return (
    <Fragment>
      <ColorSchemeButton variant="soft" size="sm" />

      <IconButton variant="soft" size="sm">
        <NotificationsRounded />
      </IconButton>

      {user ? (
        <UserAvatarButton variant="soft" />
      ) : (
        <Button component={Link} size="sm" to="/login">
          Sign In
        </Button>
      )}
    </Fragment>
  );
}

type ToolbarProps = Omit<BoxProps<"header">, "children">;
