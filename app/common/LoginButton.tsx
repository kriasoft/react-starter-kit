/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Button, ButtonProps } from "@mui/material";
import * as React from "react";
import { type LoginMethod, type UserCredential } from "../core/auth.js";
import { AuthIcon } from "../icons/AuthIcon.js";

export function LoginButton(props: LoginButtonProps): JSX.Element {
  const { method, onClick, ...other } = props;
  const handleClick = useHandleClick(method, onClick);

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

function useHandleClick(method: LoginMethod, onClick?: LoginCallback) {
  return React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      onClick?.(
        event,
        import("../core/firebase.js").then((fb) =>
          fb.signIn({ method: method })
        )
      );
    },
    [method, onClick]
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
    onClick?: LoginCallback;
  }
>;
