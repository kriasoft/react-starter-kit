/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import React from 'react';

export default React.createClass({

  propTypes: {
    body: React.PropTypes.string.isRequired
  },

  render() {
    return <div className="ContentPage"
      dangerouslySetInnerHTML={{__html: this.props.body}} />;
  }

});
