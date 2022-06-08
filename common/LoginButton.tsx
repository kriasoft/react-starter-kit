/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Button, ButtonProps } from "@mui/material";
import * as React from "react";
import { LoginMethod, useAuth, User } from "../core";
import { Apple, Facebook, Google } from "../icons";

const icons = {
  [LoginMethod.Apple]: <Apple />,
  [LoginMethod.Google]: <Google />,
  [LoginMethod.Facebook]: <Facebook />,
};

function LoginButton(props: LoginButtonProps): JSX.Element {
  const { method, onClick, ...other } = props;
  const { signIn } = useAuth();

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const promise = signIn({ method });
      onClick?.(event, promise);
    },
    [method, signIn, onClick]
  );

  return (
    <Button
      variant="outlined"
      size="large"
      href={`/auth/${method.toLowerCase()}`}
      startIcon={icons[method]}
      onClick={handleClick}
      fullWidth
      {...other}
    >
      <span style={{ flexGrow: 1, textAlign: "center" }}>
        Continue with {method}
      </span>
    </Button>
  );
}

type LoginButtonProps = Omit<
  ButtonProps<
    "a",
    {
      method: LoginMethod;
      onClick?: (
        event: React.MouseEvent<HTMLAnchorElement>,
        promise: Promise<User | null | void>
      ) => void;
    }
  >,
  "children"
>;

export { LoginButton };
