/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.css';

class Login extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.title}
          </h1>
          <p className={s.lead}>
            Log in with your username or company email address.
          </p>
          <div className="ui form">
             <div className="fluid ui buttons">
                
                    <button className="ui facebook button">
                        <i className="facebook icon"></i>
                        <a href="/login/facebook" style={{color: "white"}}>
                        Facebook
                        </a>
                      </button>
                
              
              <div className="or"></div>
              
                  <button className="ui twitter button">
                    <i className="twitter icon"></i>
                    <a href="/login/twitter" style={{color: "white"}}>
                    Twitter
                     </a>
                  </button>
             
              <div className="or"></div>
              
                <button className="ui google plus button">
                    <i className="google plus icon"></i>
                    <a href="/login/google" style={{color: "white"}}>
                    Google
                    </a>
                  </button>
              
              
            </div> 
          </div>
          
          
          
          <strong className={s.lineThrough}>OR</strong>
          <form method="post" className="ui form">
            <div className="field">

            

              <label htmlFor="usernameOrEmail">
                Username or email address:
              </label>
              <input
                className="ui input"
                id="usernameOrEmail"
                type="text"
                name="usernameOrEmail"
                autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              />
            </div>
            <div className="field">
              <label htmlFor="password">
                Password:
              </label>
              <input
                className={s.input}
                id="password"
                type="password"
                name="password"
              />
            </div>
            
              <button className="ui fluid basic green button" type="submit">
                Log in
              </button>
            
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Login);
