/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import invariant from 'react/lib/invariant';
import Location from '../core/Location';

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
  Location.navigateTo(path);
}

export default { handleClick };
