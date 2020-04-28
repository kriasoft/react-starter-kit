/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Root, Container, Spacer, A } from './styled';

export default function Feedback() {
  return (
    <Root>
      <Container>
        <A href="https://gitter.im/kriasoft/react-starter-kit">
          Ask a question
        </A>
        <Spacer />
        <A href="https://github.com/kriasoft/react-starter-kit/issues/new">
          Report an issue
        </A>
      </Container>
    </Root>
  );
}
