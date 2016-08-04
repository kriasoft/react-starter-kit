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
import GMap from '../../components/GMap';
import s from './Maps.css';

const title = 'React Starter Kit';

function Maps(props, context) {
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1 className={s.title}>Map demo</h1>
        <div style={{ height: 600 }}>
          <GMap />
        </div>
      </div>
    </div>
  );
}

Maps.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Maps);
