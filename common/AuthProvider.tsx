/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { AuthContext, LoginMethod, type Auth, type User } from "../core";
import { LoginDialog } from "../dialogs/LoginDialog";
import { LoginWindow } from "./LoginWindow";

function AuthProvider(props: AuthProviderProps): JSX.Element {
  const [me, setMe] = React.useState<User | null | undefined>();
  const [state, setState] = React.useState<State>({ open: false });

  React.useEffect(() => {
    fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "query { me { id name email picture { url } } }",
      }),
    })
      .then((res) => res.json<{ data?: { me?: User | null } }>())
      .then((res) => setMe(res.data?.me));
  }, []);

  const signIn = React.useCallback<SignIn>((options) => {
    return new Promise<User | null>((onSuccess, onError) => {
      setState({ open: true, method: options?.method, onSuccess, onError });
    }).then((user) => {
      setMe(user);
      return user;
    });
  }, []);

  const signOut = React.useCallback<SignOut>(() => {
    return fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "mutation { signOut }",
      }),
    })
      .then((res) => res.json<{ errors?: [{ message: string }] }>())
      .then((res) => {
        if (!res.errors) setMe(null);
      });
  }, []);

  const closeLogin = React.useCallback(() => {
    setState({ open: false });
  }, []);

  const auth = React.useMemo(() => ({ me, signIn, signOut }), [me]);

  return (
    <AuthContext.Provider value={auth}>
      {props.children}
      <LoginDialog open={state.open} onClose={closeLogin} />
      <LoginWindow
        open={state.open}
        method={state.method}
        onSuccess={state.onSuccess}
        onError={state.onError}
      />
    </AuthContext.Provider>
  );
}

type State = {
  open: boolean;
  method?: LoginMethod;
  onSuccess?: (user: User | null) => void;
  onError?: (err: Error | string) => void;
};

type AuthProviderProps = {
  children?: React.ReactNode;
};

type SignIn = Auth["signIn"];
type SignOut = Auth["signOut"];

export { AuthProvider };
