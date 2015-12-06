/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component } from 'react';
import s from './Footer.scss';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';

@withStyles(s)
class Footer extends Component {

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <span className={s.text}>© Your Company</span>
          <span className={s.spacer}>·</span>
          <a className={s.link} href="/" onClick={Link.handleClick}>Home</a>
          <span className={s.spacer}>·</span>
          <a className={s.link} href="/privacy" onClick={Link.handleClick}>Privacy</a>
          <span className={s.spacer}>·</span>
          <a className={s.link} href="/not-found" onClick={Link.handleClick}>Not Found</a>
        </div>
      </div>
    );
  }

}

export default Footer;
