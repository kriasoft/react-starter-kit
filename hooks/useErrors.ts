/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { PayloadError } from "relay-runtime";

declare module "relay-runtime" {
  interface PayloadError {
    errors?: {
      [key: string]: string[];
    };
  }
}

type Input = {
  [key: string]: string | number | null;
};

type Errors<T extends Input> = {
  [key in keyof T | "_"]?: string[];
};

const empty: Errors<Input> = {};

/**
 * Returns an object containing validation errors and a function to update it.
 *
 * @example
 *   const [errors, setErrors] = useErrors();
 *   const [updateUser] = useMutation<UserMutation>(updateUserMutation);
 *
 *   updateUser({
 *     variables: { input: ..., dryRun: true },
 *     onCompleted({ updateUser: data }, errors) {
 *       setErrors(errors?.[0]);
 *     }
 *   })
 */
export function useErrors<T extends Input>(): [
  Errors<T>,
  (payloadError?: PayloadError | ((prev: Errors<T>) => Errors<T>)) => void
] {
  const [errors, set] = React.useState<Errors<T>>(empty);

  const setErrors = React.useCallback(
    function setErrors(err?: PayloadError | ((prev: Errors<T>) => Errors<T>)) {
      if (typeof err === "function") {
        set(err);
      } else {
        set(err?.errors || (err && { _: [err.message] }) || empty);
      }
    },
    [set]
  );

  return [errors, setErrors];
}
