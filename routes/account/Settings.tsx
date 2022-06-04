/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { css } from "@emotion/react";
import { Button, Container, TextField, Typography } from "@mui/material";
import * as React from "react";
import { graphql, useMutation } from "react-relay";
import { useErrors } from "../../hooks";
import type { accountSettingsQuery$data as Props } from "../../queries/accountSettingsQuery.graphql";
import type { SettingsUpdateMutation } from "../../queries/SettingsUpdateMutation.graphql";

const updateUserMutation = graphql`
  mutation SettingsUpdateMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        email
        name
      }
    }
  }
`;

export default function Settings(props: Props): JSX.Element {
  const { me } = props;
  const [input, setInput] = React.useState({
    id: me?.id || "",
    name: me?.name || "",
    email: me?.email || "",
  });

  const [updateUser] = useMutation<SettingsUpdateMutation>(updateUserMutation);
  const [errors, setErrors] = useErrors();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((x) => ({ ...x, [name]: value }));
  }

  const fields: { key: keyof typeof input; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
  ];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!me) return;
    updateUser({
      variables: { input },
      onCompleted(_, errors) {
        setErrors(errors?.[0]);
      },
    });
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ marginTop: (x) => x.spacing(3), marginBottom: (x) => x.spacing(3) }}
    >
      <Typography
        sx={{ marginBottom: (theme) => theme.spacing(2) }}
        variant="h2"
      >
        Account Settings
      </Typography>
      <form
        onSubmit={handleSubmit}
        css={css`
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        `}
      >
        {fields.map((x) => (
          <TextField
            sx={{ marginBottom: (theme) => theme.spacing(2) }}
            key={x.key}
            name={x.key}
            type={x.key === "email" ? "email" : "text"}
            label={x.label}
            value={input[x.key]}
            error={Boolean(errors[x.key])}
            helperText={errors[x.key]?.join(" ")}
            onChange={handleChange}
            fullWidth
          />
        ))}

        <Button variant="contained" type="submit">
          Save
        </Button>
      </form>
    </Container>
  );
}
