/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';

const ContextType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: PropTypes.func.isRequired,
  // Universal HTTP client
  fetch: PropTypes.func.isRequired,
  // Integrate Redux
  // http://redux.js.org/docs/basics/UsageWithReact.html
  ...ReduxProvider.childContextTypes,
  // Apollo Client
  client: PropTypes.object.isRequired,
  // ReactIntl
  intl: IntlProvider.childContextTypes.intl,
};

/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   );
 */
class App extends React.PureComponent {
  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
  };

  static childContextTypes = ContextType;

  getChildContext() {
    return this.props.context;
  }

  // NOTE: This methods are not needed if you update URL by setLocale action.
  //
  //  componentDidMount() {
  //    const store = this.props.context && this.props.context.store;
  //    if (store) {
  //      this.lastLocale = store.getState().intl.locale;
  //      this.unsubscribe = store.subscribe(() => {
  //        const state = store.getState();
  //        const { newLocale, locale } = state.intl;
  //        if (!newLocale && this.lastLocale !== locale) {
  //          this.lastLocale = locale;
  //          this.forceUpdate();
  //        }
  //      });
  //    }
  //  }
  //
  //  componentWillUnmount() {
  //    if (this.unsubscribe) {
  //      this.unsubscribe();
  //      this.unsubscribe = null;
  //    }
  //  }

  render() {
    return React.Children.only(this.props.children);
  }
}

export default App;
