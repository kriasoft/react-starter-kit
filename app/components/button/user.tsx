/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { AccountCircle } from "@mui/icons-material";
import { IconButton, IconButtonProps, styled } from "@mui/material";
import { Fragment } from "react";
import { UserMenu, useToggleMenu } from "./user-menu";

const StyledIconButton = styled(IconButton)(() => ({
  padding: "2px",
}));

const StyledAccountCircle = styled(AccountCircle)(() => ({
  fontSize: "2.125rem",
}));

export function UserPictureButton(props: UserPictureButtonProps) {
  const { onClick, ...rest } = props;
  const toggleMenu = useToggleMenu(onClick);

  return (
    <Fragment>
      {/* User picture button */}
      <StyledIconButton onClick={toggleMenu} size="large" {...rest}>
        <StyledAccountCircle />
      </StyledIconButton>

      {/* User account menu (popup) */}
      <UserMenu />
    </Fragment>
  );
}

export type UserPictureButtonProps = IconButtonProps;
export { UserMenu };
