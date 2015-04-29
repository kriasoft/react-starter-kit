/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import './HomePage.less';
import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars

class HomePage {

  static propTypes = {
    body: PropTypes.string.isRequired
  };

  render() {
    return (
      <div className="ContentPage"
        dangerouslySetInnerHTML={{__html: this.props.body}} />
    );
  }

}

export default HomePage;
