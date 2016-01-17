/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import s from './ContentPage.scss';
import withStyles from '../../decorators/withStyles';

@withStyles(s)
class ContentPage extends Component {

  // static propTypes = {
  //   path: PropTypes.string.isRequired,
  //   content: PropTypes.string.isRequired,
  //   title: PropTypes.string,
  // };

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  render() {
    let { path, content, title, error } = this.props.route.props;

    let pageTitle = title || 'Not found';

    this.context.onSetTitle(pageTitle);
    return (
      <div className={s.root}>
        <div className={s.container}>
          {path === '/' ? null : <h1>{pageTitle}</h1>}
          <div dangerouslySetInnerHTML={{ __html: content || error }} />
        </div>
      </div>
    );
  }

}

export default ContentPage;
