/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";

enum LoginMethod {
  Apple = "Apple",
  Google = "Google",
  Facebook = "Facebook",
}

const AuthContext = React.createContext<Auth>({
  me: undefined,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});

function useAuth(): Auth {
  return React.useContext(AuthContext);
}

/* -------------------------------------------------------------------------- */
/* TypeScript definitions                                                     */
/* -------------------------------------------------------------------------- */

type User = {
  name: string | null;
  email: string | null;
  picture?: {
    url: string | null;
  };
};

type SignInOptions = {
  method?: LoginMethod;
};

type Auth = {
  me: User | null | undefined;
  signIn: (options?: SignInOptions) => Promise<User | null | void>;
  signOut: () => Promise<void>;
};

export { AuthContext, useAuth, LoginMethod, type User, type Auth };
