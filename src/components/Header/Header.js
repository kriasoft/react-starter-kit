/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component } from 'react';
import s from './Header.scss';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import Navigation from '../Navigation';

@withStyles(s)
class Header extends Component {

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Navigation className={s.nav} />
          <a className={s.brand} href="/" onClick={Link.handleClick}>
            <img src={require('./logo-small.png')} width="38" height="38" alt="React" />
            <span className={s.brandTxt}>Your Company</span>
          </a>
          <div className={s.banner}>
            <h1 className={s.bannerTitle}>React</h1>
            <p className={s.bannerDesc}>Complex web apps made easy</p>
          </div>
        </div>
      </div>
    );
  }

}

export default Header;
