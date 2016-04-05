import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.scss';
import Navigation from '../Navigation';
import Logo from '../Logo/Logo';

class Header extends React.Component {
  render() {
    return (
      <header className={s.header}>
        <Logo />
        <Navigation />
      </header>
    )
  }
}

export default withStyles(Header, s);
