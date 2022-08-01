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
import { useAuthCallback, useCurrentUser } from "../core/auth.js";

export default function Settings(): JSX.Element {
  const [state, setState] = useState();
  const handleChange = useHandleChange(setState);
  const handleSubmit = useHandleSubmit(state, setState);

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
          required
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
          required
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
  const [state, setState] = React.useState({
    displayName: me?.displayName ?? "",
    email: me?.email ?? "",
    loading: me === undefined,
    error: undefined as string | undefined,
  });

  React.useEffect(() => {
    if (me) {
      setState((prev) => ({
        ...prev,
        displayName: me.displayName ?? "",
        email: me.email ?? "",
        loading: false,
      }));
    }
  }, [setState, me, me?.email, me?.displayName]);

  return [state, setState] as const;
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

function useHandleSubmit(state: State, setState: SetState) {
  const me = useCurrentUser();
  return useAuthCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setState((prev) => ({ ...prev, loading: true }));
      try {
        if (!me) throw new Error("Not authenticated.");
        await updateProfile(me, { displayName: state.displayName });
        await updateEmail(me, state.email);
        setState((prev) => ({ ...prev, loading: false, error: undefined }));
      } catch (err) {
        const code = (err as { code?: string })?.code;
        if (code === "permission-denied") throw err;
        if (code?.startsWith("auth/")) throw err;
        const error = (err as Error)?.message ?? "Failed.";
        setState((prev) => ({ ...prev, error }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [me, state.displayName, state.email]
  );
}

type State = ReturnType<typeof useState>[0];
type SetState = ReturnType<typeof useState>[1];
