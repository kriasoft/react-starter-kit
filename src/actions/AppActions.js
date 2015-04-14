/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Dispatcher from '../core/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';
import http from 'superagent';

export default {

  navigateTo(path, options) {
    if (ExecutionEnvironment.canUseDOM) {
      if (options && options.replace) {
        window.history.replaceState({}, document.title, path);
      } else {
        window.history.pushState({}, document.title, path);
      }
    }

    Dispatcher.handleViewAction({
      actionType: ActionTypes.CHANGE_LOCATION,
      path
    });
  },

  loadPage(path, cb) {
    Dispatcher.handleViewAction({
      actionType: ActionTypes.LOAD_PAGE,
      path
    });

    http.get('/api/page' + path)
      .accept('application/json')
      .end((err, res) => {
        Dispatcher.handleServerAction({
          actionType: ActionTypes.LOAD_PAGE,
          path,
          err,
          page: res.body
        });
        if (cb) {
          cb();
        }
      });
  }

};
