/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Button, ButtonProps } from "@mui/material";
import { type UserCredential } from "firebase/auth";
import * as React from "react";
import { type LoginMethod } from "../core/auth.js";
import { AuthIcon } from "../icons/AuthIcon.js";

export function LoginButton(props: LoginButtonProps): JSX.Element {
  const { method, onClick, onLogin, ...other } = props;
  const handleClick = useHandleClick(method, onClick, onLogin);

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
        Continue with {method}
      </span>
    </Button>
  );
}

function useHandleClick(
  method: LoginMethod,
  onClick?: LoginButtonProps["onClick"],
  onLogin?: LoginButtonProps["onLogin"]
) {
  return React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (!onClick || !event.isDefaultPrevented()) {
        event.preventDefault();
        import("../core/firebase.js")
          .then((fb) => fb.signIn({ method: method }))
          .then(
            (user) => onLogin?.(null, user),
            (err) => onLogin?.(err, undefined)
          );
      }
    },
    [method, onClick, onLogin]
  );
}

export type LoginCallback = (
  event: React.MouseEvent,
  result: Promise<UserCredential>
) => void;

type LoginButtonProps = ButtonProps<
  "a",
  {
    method: LoginMethod;
    onLogin?: (err: Error | null, user: UserCredential | undefined) => void;
  }
>;
