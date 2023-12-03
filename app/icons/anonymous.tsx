/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { SvgIcon, SvgIconProps } from "@mui/joy";

export function AnonymousIcon(props: AnonymousIconProps): JSX.Element {
  return (
    <SvgIcon role="img" viewBox="0 0 32 32" {...props}>
      <title>Anonymous</title>
      <circle
        fill="none"
        stroke="#999"
        cx="16"
        cy="16"
        r="14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
      <circle
        fill="none"
        stroke="#999"
        cx="16"
        cy="13"
        r="5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
      <path
        fill="none"
        stroke="#999"
        d="M5.4 25.1c1.8-4.1 5.8-7 10.6-7s8.9 2.9 10.6 7"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
    </SvgIcon>
  );
}

export type AnonymousIconProps = Omit<SvgIconProps, "children">;
