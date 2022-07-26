import * as React from "react";
import {
  AuthContext,
  UserContext,
  type LoginOptions,
  type User,
  type UserCredential,
} from "../core/auth.js";
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
          const fb = await importFirebase();
          return await fb.signIn(options);
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
      async signOut() {
        const fb = await importFirebase();
        return await fb.auth.signOut();
      },
    }),
    []
  );

  React.useEffect(() => {
    const promise = importFirebase().then((fb) =>
      fb.auth.onAuthStateChanged((value) => {
        setUser(value);
      })
    );

    return () => {
      promise.then((unsubscribe) => unsubscribe());
    };
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

function importFirebase() {
  return import("../core/firebase.js");
}
