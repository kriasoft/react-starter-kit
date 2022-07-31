/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { type User, type UserCredential } from "firebase/auth";
import * as React from "react";
import { AuthContext, UserContext, type LoginOptions } from "../core/auth.js";
import * as fb from "../core/firebase.js";
import { LoginDialog, type LoginDialogProps } from "../dialogs/LoginDialog.js";

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider(props: AuthProviderProps): JSX.Element {
  const [user, setUser] = React.useState<User | null | undefined>();
  const [login, setLogin] = React.useState<LoginDialogProps>({ open: false });

  const auth = React.useMemo(
    () => ({
      async signIn(options?: LoginOptions): Promise<UserCredential> {
        if (options) {
          return fb.signIn(options);
        } else {
          return new Promise((resolve, reject) => {
            setLogin({
              open: true,
              onClose(user: UserCredential | null) {
                setLogin({ open: false });
                if (user) {
                  resolve(user);
                } else {
                  reject();
                }
              },
            });
          });
        }
      },
      signOut() {
        return fb.auth.signOut();
      },
    }),
    []
  );

  React.useEffect(() => {
    return fb.auth.onAuthStateChanged((value) => {
      setUser(value);
    });
  }, []);

  return (
    <UserContext.Provider value={user}>
      <AuthContext.Provider value={auth}>
        {props.children}
        <LoginDialog {...login} />
      </AuthContext.Provider>
    </UserContext.Provider>
  );
}
