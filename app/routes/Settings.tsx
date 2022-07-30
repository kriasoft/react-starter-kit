/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { updateEmail, updateProfile } from "firebase/auth";
import * as React from "react";
import { useAuthCallback, useCurrentUser } from "../core/auth";

export default function Settings(): JSX.Element {
  const [state, setState] = useState();
  const handleChange = useHandleChange(setState);
  const handleSubmit = useHandleSubmit(setState);

  return (
    <Container sx={{ my: 4 }} maxWidth="sm">
      <Typography sx={{ mb: 4 }} variant="h2" children="Account Settings" />

      {state.error && (
        <Alert sx={{ mb: 3 }} severity={"error"} children={state.error} />
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          name="displayName"
          label="Display Name"
          value={state.displayName}
          helperText={" "}
          onChange={handleChange}
          disabled={state.loading}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          name="email"
          type="email"
          label="Email"
          value={state.email}
          helperText={" "}
          onChange={handleChange}
          disabled={state.loading}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <Button
          variant="contained"
          type="submit"
          children="Update Profile"
          disabled={state.loading}
        />
      </Box>
    </Container>
  );
}

function useState() {
  const me = useCurrentUser();
  const state = React.useState({
    displayName: me?.displayName ?? "",
    email: me?.email ?? "",
    loading: me === undefined,
    error: undefined as string | undefined,
  });

  React.useEffect(() => {
    if (me) {
      state[1 /* setState */]((prev) => ({
        ...prev,
        displayName: me.displayName ?? "",
        email: me.email ?? "",
        loading: false,
      }));
    }
  }, [me?.email, me?.displayName]);

  return state;
}

function useHandleChange(setState: SetState) {
  return React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setState((prev) => ({ ...prev, [name]: value }));
    },
    [setState]
  );
}

function useHandleSubmit(setState: SetState) {
  const me = useCurrentUser();
  return useAuthCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setState((prev) => ({ ...prev, loading: true }));
      try {
        if (!me) throw new Error("Not authenticated.");
        await new Promise((resolve, reject) => {
          setState((prev) => {
            updateProfile(me, { displayName: prev.displayName })
              .then(() => updateEmail(me, prev.email))
              .then(resolve, reject);
            return prev;
          });
        });
        setState((prev) => ({ ...prev, loading: false, error: undefined }));
      } catch (err) {
        const code = (err as { code?: string }).code;
        if (code?.startsWith?.("auth/")) throw err;
        if (code === "permission-denied") throw err;
        const error = (err as Error)?.message ?? err;
        setState((prev) => ({ ...prev, loading: false, error }));
      }
    },
    [me]
  );
}

type SetState = ReturnType<typeof useState>[1];
