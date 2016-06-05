/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Content.css';
import Helmet from 'react-helmet';

function Content(props) {
  return (
    <div className={s.root}>
      <Helmet title={props.title} />
      <div className={s.container}>
        {props.path === '/' ? null : <h1>{props.title}</h1>}
        <div dangerouslySetInnerHTML={{ __html: props.content || '' }} />
      </div>
    </div>
  );
}

Content.propTypes = {
  path: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default withStyles(s)(Content);
