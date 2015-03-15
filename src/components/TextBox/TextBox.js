/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import './TextBox.less';

import React from 'react';

export default class TextBox extends React.Component {

  render() {
    return (
      <div className="TextBox">
        {this.props.maxLines > 1 ?
          <textarea {...this.props} className="TextBox-input" ref="input" key="input" rows={this.props.maxLines} /> :
          <input {...this.props} className="TextBox-input" ref="input" key="input" />}
      </div>
    );
  }

}

TextBox.propTypes = {
  maxLines: React.PropTypes.number
};

TextBox.defaultProps = {
  maxLines: 1
};
