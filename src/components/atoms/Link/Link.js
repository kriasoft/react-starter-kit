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
import url from '../../../urls';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * Link component for interal linking with the router.
 */
class Link extends React.Component {
  static propTypes = {
    /** The internal link of the page where you linking to. */
    name: PropTypes.string.isRequired,
    params: PropTypes.shape(),
    /** The inner childs. */
    children: PropTypes.node.isRequired,
    /** Function that will be fired on click. */
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: null,
    params: null,
  };

  constructor(props) {
    super(props);
    const { name, params } = props;
    this.to = params ? url(name, params) : url(name);
  }

  handleClick = event => {
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
    history.push(this.to);
  };

  render() {
    const { children, name, params, ...props } = this.props;
    const { to } = this;
    return (
      <a href={to} {...props} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}

export default Link;
