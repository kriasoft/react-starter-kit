/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import history from '../../core/history';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Link extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node,
    onClick: PropTypes.func,
  };

  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();
    history.push({
      pathname: this.props.to,
      state: this.props.state ? this.props.state : undefined,
      search: this.props.query ? this.params(this.props.query) : undefined
    });
  };

  params = (arg) => {
    if (typeof arg === 'string') {
      return arg.startsWith('?') ? arg : `?${arg}`;
    } else if (arg === Object(arg) && Object.prototype.toString.call(arg) === '[object Object]' ) {
      return '?' + Object.keys(this.props.query).map((key) => (
        `${encodeURIComponent(key)}=${encodeURIComponent(this.props.query[key])}`
      )).join('&');
    }
  }

  render() {
    const { to, children, query, state, ...props } = this.props;
    return <a href={to} {...props} onClick={this.handleClick}>{children}</a>;
  }
}

export default Link;
