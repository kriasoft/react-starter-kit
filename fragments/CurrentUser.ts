/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { graphql } from "react-relay";

export const CurrentUser_me = graphql`
  fragment CurrentUser_me on User {
    id
    email
    name
    picture {
      url
    }
  }
`;
