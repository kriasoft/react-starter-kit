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
import generateUrls from 'universal-router/generateUrls';
import history from '../../../history';
import router from '../../../router';

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
    to: PropTypes.shape({
      name: PropTypes.string.isRequired,
      params: PropTypes.shape(),
    }).isRequired,
    /** The inner childs. */
    children: PropTypes.node.isRequired,
    /** Function that will be fired on click. */
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: null,
  };

  constructor(props) {
    super(props);
    const { to } = props;
    const getUrl = generateUrls(router);

    this.url = to.params ? getUrl(to.name, to.params) : getUrl(to.name);
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
    history.push(this.url);
  };

  render() {
    const { to, children, ...props } = this.props;
    const { url } = this;

    return (
      <a href={url} {...props} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}

export default Link;
