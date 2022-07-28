import * as React from "react";
import { Button, ButtonProps } from "@mui/material";

export type ButtonOneProps = Omit<ButtonProps, "children">;

export function ButtonOne(props: ButtonOneProps): JSX.Element {
  const { sx, ...other } = props;

  return (
    <Button
      sx={{ fontWeight: 600, color: "blue", ...sx }}
      variant="outlined"
      size="large"
      children="One"
      {...other}
    />
  );
}
