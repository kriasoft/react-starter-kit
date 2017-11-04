  /**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Feedback.css';

class Feedback extends React.Component {
  render() {
    return (
      <div className="ui segment center aligned">
        <div className="ui green message">
          <a href="https://gitter.im/kriasoft/react-starter-kit">
            Ask a question
          </a>
        </div>
        <div className="ui orange message">
          <a href="https://github.com/kriasoft/react-starter-kit/issues/new">
            Report an issue
          </a>
        </div>
        
      </div>
    );
  }
}

export default withStyles(s)(Feedback);
