
import React from 'react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';

export default function provide(store, component) {
  // You can inject all providers here
  const state = store.getState();

  return (
    <Provider store={store}>
      <IntlProvider
        key={state.intl.locale}
        locale={state.intl.locale}
        initialNow={state.intl.initialNow}
        messages={state.intl.messages[state.intl.locale]}
      >
        {component}
      </IntlProvider>
    </Provider>
  );
}
