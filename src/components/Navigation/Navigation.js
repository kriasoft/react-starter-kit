/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Root, Link, Spacer } from './styled';

export default function Navigation() {
  return (
    <Root role="navigation">
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      <Spacer> | </Spacer>
      <Link to="/login">Log in</Link>
      <Spacer>or</Spacer>
      <Link highlight to="/register">
        Sign up
      </Link>
    </Root>
  );
}
