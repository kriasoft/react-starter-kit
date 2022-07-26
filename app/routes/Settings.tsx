/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import * as React from "react";

function Settings(): JSX.Element {
  // TODO: Get data from the API
  const [input, setInput] = React.useState({
    id: "",
    name: "",
    email: "",
  });

  const [errors, setErrors] = React.useState({
    id: undefined as string[] | undefined,
    name: undefined as string[] | undefined,
    email: undefined as string[] | undefined,
  });

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
    // TODO: Send data to the API
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ marginTop: (x) => x.spacing(3), marginBottom: (x) => x.spacing(3) }}
    >
      <Typography
        sx={{ marginBottom: (theme) => theme.spacing(2) }}
        children="Account Settings"
        variant="h2"
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
        component="form"
        onSubmit={handleSubmit}
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
      </Box>
    </Container>
  );
}

export default Settings;
export type Settings = typeof Settings;
