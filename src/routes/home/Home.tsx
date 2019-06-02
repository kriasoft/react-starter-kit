/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { ChildDataProps, graphql } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/withStyles';
import newsQuery from './news.graphql';
import s from './Home.css';
import { HomeNews } from './__generated__/HomeNews';

type ChildProps = ChildDataProps<{}, HomeNews>;
const withNews = graphql<{}, HomeNews, {}, ChildProps>(newsQuery);

const Home = withNews(props => {
  const {
    data: {
      loading,
      reactjsGetAllNews,
      networkStatus: { isConnected },
    },
  } = props;

  return (
    <div className={s.root}>
      <div className={s.container}>
        <p className={s.networkStatusMessage}>
          {isConnected ? 'Online' : 'Offline'}
        </p>
        <h1>React.js News</h1>
        {loading || !reactjsGetAllNews
          ? 'Loading...'
          : reactjsGetAllNews.map(item => (
              <article key={item.link} className={s.newsItem}>
                <h1 className={s.newsTitle}>
                  <a href={item.link}>{item.title}</a>
                </h1>
                <div
                  className={s.newsDesc}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </article>
            ))}
      </div>
    </div>
  );
});

export default withStyles(s)(Home);
