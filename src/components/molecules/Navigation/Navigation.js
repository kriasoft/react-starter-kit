import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Navigation.css';

import Link from '../../atoms/Link';

@withStyles(s)
class Navigation extends React.Component {
  render() {
    return (
      <div className={s.root} role="navigation">
        <Link className={s.link} to="/about">
          About
        </Link>
        <Link className={s.link} to="/contact">
          Contact
        </Link>
      </div>
    );
  }
}

export default Navigation;
