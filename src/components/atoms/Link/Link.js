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
import history from '../../../history';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * Link component for interal linking with the router.
 * If baseUrl is set (in config.js) all links are prefixed with the baseUrl
 */
class Link extends React.Component {
  static propTypes = {
    /** The internal link of the page where you linking to. */
    to: PropTypes.string.isRequired,
    /** The inner childs. */
    children: PropTypes.node.isRequired,
    /** Function that will be fired on click. */
    onClick: PropTypes.func,
  };

  static contextTypes = {
    baseUrl: PropTypes.string.isRequired,
  };

  static defaultProps = {
    onClick: null,
  };

  handleClick = event => {
    const { baseUrl } = this.context;
    const { to, onClick } = this.props;

    if (onClick) {
      onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();
    history.push(`${baseUrl}${to}`);
  };

  render() {
    const { baseUrl } = this.context;
    const { children, to, ...props } = this.props;

    return (
      <a href={`${baseUrl}${to}`} {...props} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}

export default Link;
