/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import { canUseDOM } from 'react/lib/ExecutionEnvironment';
import Dispatcher from '../core/Dispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {

  navigateTo(path, options) {
    if (canUseDOM) {
      if (options && options.replace) {
        window.history.replaceState({}, document.title, path);
      } else {
        window.history.pushState({}, document.title, path);
      }
    }

    Dispatcher.dispatch({
      type: ActionTypes.CHANGE_LOCATION,
      path
    });
  }

};
