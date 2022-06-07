/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";

export function useSignOut(): () => void {
  return React.useCallback(() => {
    // TODO: Sign out
  }, []);
}
