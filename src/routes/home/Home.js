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
import { NewsItem, NewsTitle, NewsDescription } from './styled';

export default function Home({ news }) {
  return (
    <Root>
      <Container>
        <h1>React.js News</h1>
        {news.map(item => (
          <NewsItem key={item.link}>
            <NewsTitle>
              <a href={item.link}>{item.title}</a>
            </NewsTitle>
            <NewsDescription
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </NewsItem>
        ))}
      </Container>
    </Root>
  );
}

Home.propTypes = {
  news: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      content: PropTypes.string,
    }),
  ).isRequired,
};
