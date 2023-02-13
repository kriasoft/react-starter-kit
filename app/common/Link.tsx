/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref): JSX.Element {
    const { href, ...other } = props;
    return <RouterLink ref={ref} to={href} {...other} />;
  },
);

export type LinkProps = Omit<RouterLinkProps, "to"> & {
  href: RouterLinkProps["to"];
};
