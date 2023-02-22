/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Button, ButtonProps } from "@mui/material";
import * as React from "react";
import { type SignInMethod } from "../../core/auth.js";
import { type ExistingAccount } from "../../core/firebase.js";
import { AuthIcon } from "../../icons/AuthIcon.js";

export function LoginButton(props: LoginButtonProps): JSX.Element {
  const { method, onClick, linkTo, ...other } = props;
  const handleClick = useHandleClick(method, onClick, linkTo);

  return (
    <Button
      variant="outlined"
      size="large"
      href="/login"
      startIcon={<AuthIcon variant={method} />}
      fullWidth
      {...other}
      onClick={handleClick}
    >
      <span style={{ flexGrow: 1, textAlign: "center" }}>
        {method === "google.com"
          ? "Continue with Google"
          : method === "facebook.com"
          ? "Continue with Facebook"
          : method === "anonymous"
          ? "Continue as Anonymous"
          : `Continue with ${method}`}
      </span>
    </Button>
  );
}

function useHandleClick(
  method: SignInMethod,
  onClick?: LoginButtonProps["onClick"],
  linkTo?: ExistingAccount,
) {
  return React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event, method, linkTo);
    },
    [method, onClick, linkTo],
  );
}

export type LoginButtonProps = ButtonProps<
  "a",
  {
    method: SignInMethod;
    linkTo?: ExistingAccount;
    onClick?: (
      event: React.MouseEvent<HTMLAnchorElement>,
      method: SignInMethod,
      linkTo?: ExistingAccount,
    ) => void;
  }
>;
