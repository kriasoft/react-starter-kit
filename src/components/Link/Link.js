/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import Location from '../../core/Location';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Link extends Component {

  static propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    state: PropTypes.object,
    onClick: PropTypes.func,
  };

  static handleClick(event) {
    let allowTransition = true;
    let clickResult;

    if (this.props && this.props.onClick) {
      clickResult = this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (clickResult === false || event.defaultPrevented === true) {
      allowTransition = false;
    }

    event.preventDefault();

    if (allowTransition) {
      const link = event.currentTarget;
      Location.pushState(
        this.props && this.props.state || null,
        this.props && this.props.to || (link.pathname + link.search));
    }
  }

  render() {
    const { to, children, ...props } = this.props;
    return <a onClick={Link.handleClick.bind(this)} {...props}>{children}</a>;
  }

}

export default Link;
