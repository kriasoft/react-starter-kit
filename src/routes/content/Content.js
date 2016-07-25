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
import s from './Content.css';

class Content extends Component {

  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    location: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = { path: '', content: '', title: '' };
  }

  componentDidMount() {
    const currentPath = this.props.location.pathname;
    this.loadContent(currentPath);
  }

  componentWillReceiveProps(nextProps) {
    const nextPath = nextProps.location.pathname;
    this.loadContent(nextPath);
  }

  loadContent(path) {
    return fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{content(path:"${path}"){path,title,content,component}}`,
      }),
      credentials: 'include',
    })
    .then((resp) => {
      if (resp.status !== 200) throw new Error(resp.statusText);
      return resp.json();
    })
    .then((json) => {
      const { data } = json;
      if (!data || !data.content) throw new Error('Invalid data object');
      this.setState({ ...data.content });
      this.context.setTitle(this.state.title);
    })
    .catch((err) =>
      console.error(`Failed to load content: ${err}`) // eslint-disable-line no-console
    );
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          {this.state.path === '/' ? null : <h1>{this.state.title}</h1>}
          <div dangerouslySetInnerHTML={{ __html: this.state.content || '' }} />
        </div>
      </div>
    );
  }

}

export default withStyles(s)(Content);
