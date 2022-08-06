/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  SignInMethod,
  signInWithPopup,
  type Auth,
  type UserCredential,
} from "firebase/auth";

export const app = initializeApp({
  projectId: GOOGLE_CLOUD_PROJECT,
  appId: FIREBASE_APP_ID,
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
});

export const auth = getAuth(app);

export function signIn(options: LoginOptions): Promise<UserCredential> {
  if (options.method === SignInMethod.GOOGLE) {
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    return signInWithPopup(auth, provider);
  }

  if (options.method === SignInMethod.FACEBOOK) {
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

export const SignInMethods = [
  GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
  FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
  "anonymous",
] as const;

// #region TypeScript declarations

export type SignInMethod = typeof SignInMethods[number];

export type LoginOptions = {
  method: SignInMethod;
};

export type Firebase = {
  app: FirebaseApp;
  auth: Auth;
  signIn: typeof signIn;
};

// #endregion
