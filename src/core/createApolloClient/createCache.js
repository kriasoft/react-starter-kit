// @flow

import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';

function dataIdFromObject(obj) {
  switch (obj.__typename) {
    case 'NewsItem':
      return obj.link ? `NewsItem:${obj.link}` : defaultDataIdFromObject(obj);
    default:
      return defaultDataIdFromObject(obj);
  }
}

export default function createCache() {
  // https://www.apollographql.com/docs/react/basics/caching.html#configuration
  return new InMemoryCache({
    dataIdFromObject,
  });
}
