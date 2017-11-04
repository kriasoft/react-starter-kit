/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Link from '../Link';
import Navigation from '../Navigation';
import logoUrl from './logo-small.png';
import logoUrl2x from './logo-small@2x.png';

class Header extends React.Component {
  render() {
    return (
      <div className="ui black inverted segment">
        <div className="ui grid">
          <div className="row">
            <div className="eight wide column">
              <Link className="image" to="/">
                <img
                  src={logoUrl}
                  srcSet={`${logoUrl2x} 2x`}
                  width="35"
                  height="35"
                  alt="React"
                />
              </Link>
              <i className="margin" />
              <span className="ui blue inverted header">Your Company</span>
            </div>
            <Navigation />
          </div>
        </div>
        <h2 className="ui center aligned blue inverted header">React</h2>
        <h5 className="ui center aligned white inverted header">
          Complex web apps made easy
        </h5>
      </div>
    );
  }
}

export default Header;
