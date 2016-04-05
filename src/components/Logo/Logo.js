import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Logo.scss';
import Link from '../Link';
import ReactDOM from 'react-dom';
import companyData from './company-data';

class Header extends React.Component {
  render() {
    return (
      <Link className={s.logoLink} to="/">
        <img className={s.logoImage} src={require('./logo-web.svg')} alt={companyData.name} />
        <span className={s.logoText}>{companyData.name}</span>
      </Link>
    )
  }
}

export default withStyles(Header, s);
