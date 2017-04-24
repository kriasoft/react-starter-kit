/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import isoFetch from 'isomorphic-fetch';

type FetchOptions = {
  baseUrl: string,
  cookie?: string,
};

function createFetch({ baseUrl, cookie }: FetchOptions) {
  return function fetch(url, options) {
    const { headers, ...other } = options || {};
    return url.startsWith('/') ? isoFetch(`${baseUrl}${url}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(typeof cookie === 'undefined' ? null : { cookie }),
        ...headers,
      },
      credentials: 'include',
      ...other,
    }) : isoFetch(url, options);
  };
}

export default createFetch;
