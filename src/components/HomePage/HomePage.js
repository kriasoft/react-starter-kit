/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import './HomePage.less';
import React, { Component, PropTypes } from 'react';

class HomePage extends Component {

  render() {
    return (
      <div className="ContentPage"
        dangerouslySetInnerHTML={{__html: this.props.body}} />
    );
  }

}

HomePage.propTypes = {
  body: PropTypes.string.isRequired
};

export default HomePage;
