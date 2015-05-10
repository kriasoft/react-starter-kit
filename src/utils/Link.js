/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import invariant from 'react/lib/invariant';
import AppActions from '../actions/AppActions';

function handleClick(event) {

  // If not left mouse click
  if (event.button !== 0) {
    return;
  }

  // If modified event
  if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
    return;
  }

  var el = event.target;

  invariant(el && el.nodeName === 'A', 'The target element must be a link.');

  // Rebuild path
  var path = el.pathname + el.search + (el.hash || '');

  event.preventDefault();
  AppActions.navigateTo(path);
}

export default { handleClick };
