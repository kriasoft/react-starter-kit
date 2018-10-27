import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Navigation from '../Navigation';

const Header = () => (
  <div>
    <Navigation />
  </div>
);

export default withStyles(s)(Header);
