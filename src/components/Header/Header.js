/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Navigation from '../Navigation';

import {
  Root,
  Container,
  Banner,
  BannerTitle,
  BannerDescription,
  BrandText,
  BrandLink,
  Logo,
} from './styled';

export default function Header() {
  return (
    <Root>
      <Container>
        <Navigation />
        <BrandLink to="/">
          <Logo />
          <BrandText>Your Company</BrandText>
        </BrandLink>
        <Banner>
          <BannerTitle>React</BannerTitle>
          <BannerDescription>Complex web apps made easy</BannerDescription>
        </Banner>
      </Container>
    </Root>
  );
}
