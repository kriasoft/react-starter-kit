import * as React from "react";
import { Button, ButtonProps } from "@mui/material";

export type ButtonTwoProps = Omit<ButtonProps, "children">;

export function ButtonTwo(props: ButtonTwoProps): JSX.Element {
  const { sx, ...other } = props;

  return (
    <Button
      sx={{ fontWeight: 600, color: "green", ...sx }}
      variant="outlined"
      size="large"
      children="Two"
      {...other}
    />
  );
}
