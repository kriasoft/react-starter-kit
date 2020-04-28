/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Root from '../../components/Root';
import Container from '../../components/Container';

export default function NotFound({ title }) {
  return (
    <Root>
      <Container>
        <h1>{title}</h1>
        <p>Sorry, the page you were trying to view does not exist.</p>
      </Container>
    </Root>
  );
}

NotFound.propTypes = {
  title: PropTypes.string.isRequired,
};
