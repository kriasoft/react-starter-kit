/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import dispatcher from '../core/dispatcher';
import ActionTypes from '../constants/ActionTypes';

const location = {

  navigateTo(path, options) {
    if (canUseDOM) {
      if (options && options.replace) {
        window.history.replaceState({}, document.title, path);
      } else {
        window.history.pushState({}, document.title, path);
      }
    }

    dispatcher.dispatch({
      type: ActionTypes.CHANGE_LOCATION,
      path
    });
  }

};

export default location;
