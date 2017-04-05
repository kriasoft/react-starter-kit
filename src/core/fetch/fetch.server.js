/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Promise from 'bluebird';
import fetch, { Request, Headers, Response } from 'node-fetch';
import { host } from '../../config';

fetch.Promise = Promise;
Response.Promise = Promise;

/**
 * @param {string} url
 * @returns {string}
 */
function localUrl(url) {
  if (url.startsWith('//')) {
    return `https:${url}`;
  }

  if (url.startsWith('http')) {
    return url;
  }

  return `http://${host}${url}`;
}

/**
 * @param {Request} req
 * @returns {Request}
 */
function localRequest(req) {
  return new Request(localUrl(req.url), req);
}

/**
 * This method should handle both url+options and Request
 * @param {string|Request} urlOrReq
 * @param {Object} [options]
 * @returns {Promise}
 */
function localFetch(urlOrReq, options) {
  const isReq = urlOrReq instanceof Request;
  const params = isReq ? [localRequest(urlOrReq)] : [localUrl(urlOrReq), options];
  return fetch(...params);
}

export { localFetch as default, Request, Headers, Response };
