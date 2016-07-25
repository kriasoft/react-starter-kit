/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';

const title = 'Home Page';

class Home extends Component {
  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { news: [] };
  }

  componentWillMount() {
    this.context.setTitle(title);
  }

  componentDidMount() {
    this.loadNews();
  }

  loadNews() {
    return fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{news{title,link,contentSnippet}}',
      }),
      credentials: 'include',
    })
    .then((resp) => {
      if (resp.status !== 200) throw new Error(resp.statusText);
      return resp.json();
    })
    .then((json) => {
      const { data } = json;
      if (!data || !data.news) throw new Error('Invalid data object');
      this.setState({ news: data.news });
    })
    .catch((err) =>
      console.error(`Failed to load content: ${err}`) // eslint-disable-line no-console
    );
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>React.js News</h1>
          <ul className={s.news}>
            {this.state.news.map((item, index) => (
              <li key={index} className={s.newsItem}>
                <a href={item.link} className={s.newsTitle}>{item.title}</a>
                <span
                  className={s.newsDesc}
                  dangerouslySetInnerHTML={{ __html: item.contentSnippet }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
