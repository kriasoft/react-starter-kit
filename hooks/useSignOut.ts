/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { graphql, useMutation } from "react-relay";
import { useSignOutMutation } from "./__generated__/useSignOutMutation.graphql";

const signOutMutation = graphql`
  mutation useSignOutMutation {
    signOut
  }
`;

export function useSignOut(): () => void {
  const [commit] = useMutation<useSignOutMutation>(signOutMutation);
  return React.useCallback(
    function () {
      commit({
        variables: {},
        onCompleted(_, errors) {
          if (errors) throw errors[0];
          window.location.reload();
        },
      });
    },
    [commit]
  );
}
