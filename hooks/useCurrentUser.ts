/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import {
  fetchQuery,
  graphql,
  useFragment,
  useRelayEnvironment,
} from "react-relay";
import { createOperationDescriptor, getRequest, Snapshot } from "relay-runtime";
import {
  CurrentUser_me,
  CurrentUser_me$data,
  CurrentUser_me$key,
} from "../fragments";
import type { useCurrentUserQuery as Query } from "./__generated__/useCurrentUserQuery.graphql";

const variables = {};
const query = graphql`
  query useCurrentUserQuery {
    me {
      ...CurrentUser_me
    }
  }
`;

const operation = createOperationDescriptor(getRequest(query), variables);

/**
 * Returns the currently logged in user object (`me`), `null` for anonymous
 * users, and `undefined` when the user status has not been resolved yet.
 */
export function useCurrentUser(forceFetch = false): User | null | undefined {
  const relay = useRelayEnvironment();

  // Attempt to read the current user record (me) from the local store.
  const [snap, setSnap] = React.useState<Snapshot>(() =>
    relay.lookup(operation.fragment)
  );

  // Subscribe to updates
  React.useEffect(() => {
    const subscription = relay.subscribe(snap, (x) => setSnap(x));
    return () => subscription.dispose();
  }, [relay]);

  // Once the component is mounted, attempt to load user record from the API.
  React.useEffect(() => {
    fetchQuery<Query>(relay, query, variables, {
      networkCacheConfig: { force: forceFetch || snap.isMissingData },
    }).toPromise();
  }, [relay, forceFetch]);

  return useFragment(CurrentUser_me, snap.data.me as CurrentUser_me$key);
}

export type User = CurrentUser_me$data | null;
