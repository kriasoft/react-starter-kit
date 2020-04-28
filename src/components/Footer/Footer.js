/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Root, Container, Text, Spacer, Link } from './styled';

export default function Footer() {
  return (
    <Root>
      <Container>
        <Text>© Your Company</Text>
        <Spacer />
        <Link to="/">Home</Link>
        <Spacer />
        <Link to="/admin">Admin</Link>
        <Spacer />
        <Link to="/privacy">Privacy</Link>
        <Spacer />
        <Link to="/not-found">Not Found</Link>
      </Container>
    </Root>
  );
}
