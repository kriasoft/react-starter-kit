/* @flow */

type Fetch = (apiUrl: string, url: string, options: ?any) => Promise<any>;

type Options = {
  apiUrl: string,
  baseUrl: string,
  cookie?: string,
};

/**
 * Creates a wrapper function around the HTML5 Fetch API that provides
 * default arguments to fetch(...) and is intended to reduce the amount
 * of boilerplate code in the application.
 * https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
 */
function createFetch(fetch: Fetch, { apiUrl, cookie }: Options) {
  // NOTE: Tweak the default options to suite your application needs
  const defaults = {
    method: 'POST', // handy with backends
    mode: apiUrl ? 'cors' : 'same-origin',
    credentials: apiUrl ? 'include' : 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : null),
    },
  };

  return async (url: string, options: any) =>
    url.startsWith('/api')
      ? fetch(`${apiUrl}${url.replace('/api', '')}`, {
          ...defaults,
          ...options,
          headers: {
            ...defaults.headers,
            ...(options && options.headers),
          },
        })
      : fetch(url, options);
}

export default createFetch;
