import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import IntlProvider from './IntlProvider';

function Provide({ store, children }) {
  return (
    <Provider store={store}>
      <IntlProvider>
        {children}
      </IntlProvider>
    </Provider>
  );
}

Provide.propTypes = {
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.element.isRequired,
};

export default Provide;
