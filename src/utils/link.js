/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import invariant from 'fbjs/lib/invariant';
import location from '../core/location';

function handleClick(event) {

  // If not left mouse click
  if (event.button !== 0) {
    return;
  }

  // If modified event
  if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
    return;
  }

  var el = event.currentTarget;

  invariant(el && el.nodeName === 'A', 'The target element must be a link.');

  // Rebuild path
  var path = el.pathname + el.search + (el.hash || '');

  event.preventDefault();
  location.navigateTo(path);
}

export default { handleClick };
