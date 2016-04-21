
import React from 'react';
import { Provider } from 'react-redux';

export default function provide(store, component) {
  // You can inject all providers here
  // const state = store.getState();
  return (
    <Provider store={store}>
      {component}
    </Provider>
  );
}
