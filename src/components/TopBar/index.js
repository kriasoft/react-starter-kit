import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './index.css';
import logo from './cart.png';

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: 0,
    };
  }
  render() {
    return (
      <div className={s.topbar}>
        <ul>
          <li className={s.logo}>Kayantor</li>
          <li className={s.right}>
            <div className={s.content}>
              <img className={s.logo} src={logo} alt="" />
              <span>{this.state.items}</span>
            </div>​
          </li>
          <li className={s.right}>
            <a href="/home">Contact</a>
          </li>
          <li className={s.right}>
            <a href="/home">About</a>
          </li>
          <li className={s.right}>
            <a href="/home">Shop</a>
          </li>
          <li className={s.right}>
            <a href="/home">Home</a>
          </li>
        </ul>
      </div>
    );
  }
}

export default withStyles(s)(TopBar);
