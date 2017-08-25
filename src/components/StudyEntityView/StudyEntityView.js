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
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import hljs from 'highlight.js';
import s from './StudyEntityView.css';

class StudyEntityView extends React.Component {
  static propTypes = {
    body: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.mountBlock = this.mountBlock.bind(this);
  }

  mountBlock(content) {
    this.content = content;
    if (!content) return;
    const codes = content.querySelectorAll('pre code');
    for (let i = 0; i < codes.length; i += 1) {
      hljs.highlightBlock(codes[i]);
    }
  }

  render() {
    return (
      <div
        className={s.root}
        ref={this.mountBlock}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: this.props.body }}
      />
    );
  }
}

export default withStyles(s)(StudyEntityView);
