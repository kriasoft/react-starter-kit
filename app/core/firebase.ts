/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { getAnalytics } from "firebase/analytics";
import { FirebaseError, initializeApp, type FirebaseApp } from "firebase/app";
import {
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  getAuth,
  GoogleAuthProvider,
  OAuthCredential,
  signInAnonymously,
  signInWithPopup,
  type Auth,
  type UserCredential,
} from "firebase/auth";
export { AuthErrorCodes, linkWithCredential } from "firebase/auth";
export { FirebaseError };

export const app = initializeApp({
  projectId: import.meta.env.VITE_GOOGLE_CLOUD_PROJECT,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
});

export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export function signIn(options: SignInOptions): Promise<UserCredential> {
  if (options.method === GoogleAuthProvider.PROVIDER_ID) {
    // https://developers.google.com/identity/protocols/oauth2/web-server
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    provider.setCustomParameters({
      ...(options.email && { login_hint: options.email }),
      prompt: "consent",
    });
    return signInWithPopup(auth, provider);
  }

  // https://developers.facebook.com/docs/facebook-login/web
  // https://developers.facebook.com/docs/permissions/reference/
  if (options.method === FacebookAuthProvider.PROVIDER_ID) {
    const provider = new FacebookAuthProvider();
    provider.addScope("public_profile");
    provider.addScope("email");
    return signInWithPopup(auth, provider);
  }

  if (options.method === "anonymous") {
    return signInAnonymously(auth);
  }

  throw new Error(`Not supported: ${options.method}`);
}

export async function getExistingAccountFromError(
  error: FirebaseError | Error | unknown,
  method: SignInMethod,
): Promise<ExistingAccount | undefined> {
  if (
    !(error instanceof FirebaseError) ||
    error.code !== "auth/account-exists-with-different-credential" ||
    !error.customData?.email
  ) {
    return undefined;
  }

  const email = error.customData?.email as string;
  const signInMethods = (await fetchSignInMethodsForEmail(
    auth,
    email,
  )) as SignInMethod[];

  if (signInMethods.length === 0) {
    return undefined;
  }

  let credential: OAuthCredential | null = null;

  if (method === GoogleAuthProvider.PROVIDER_ID) {
    credential = GoogleAuthProvider.credentialFromError(error);
  }

  if (method === FacebookAuthProvider.PROVIDER_ID) {
    credential = FacebookAuthProvider.credentialFromError(error);
  }

  return credential ? { email, credential, signInMethods } : undefined;
}

// #region TypeScript declarations

export type SignInMethod =
  | typeof GoogleAuthProvider.PROVIDER_ID
  | typeof FacebookAuthProvider.PROVIDER_ID
  | "apple.com"
  | "anonymous";

export type SignInOptions = {
  method: SignInMethod;
  email?: string;
};

export type Firebase = {
  app: FirebaseApp;
  auth: Auth;
  signIn: typeof signIn;
};

export type ExistingAccount = {
  email: string;
  signInMethods: SignInMethod[];
  credential: OAuthCredential;
};

// #endregion
