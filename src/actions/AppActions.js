/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import Dispatcher from '../core/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';
import http from 'superagent';

module.exports = {

  navigateTo(path) {
    if (ExecutionEnvironment.canUseDOM) {
      window.history.pushState({}, document.title, path);
    }

    Dispatcher.handleViewAction({
      actionType: ActionTypes.CHANGE_LOCATION, path: path
    });
  },

  loadPage(path, cb) {
    Dispatcher.handleViewAction({
      actionType: ActionTypes.LOAD_PAGE, path: path
    });

    http.get('/api/page' + path)
      .accept('application/json')
      .end((err, res) => {
        Dispatcher.handleServerAction({
          actionType: ActionTypes.LOAD_PAGE, path: path, err: err, page: res.body
        });
        if (cb) {
          cb();
        }
      });
  }

};
