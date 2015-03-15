/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import React from 'react';

export default class ContentPage extends React.Component {

  render() {
    var { className, body, other } = this.props;

    return (
      <div className={'ContentPage ' + className}
        dangerouslySetInnerHTML={{__html: body}} {...other} />
    );
  }

}

ContentPage.propTypes = {
  body: React.PropTypes.string.isRequired
};
