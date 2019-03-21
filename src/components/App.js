/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// @flow

import React from 'react';
import type { Node } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import AppContext from '../context';

// Since the current React Starter Kit uses older React Context API that cannot be typed,
// here we declare duplicate type information.

type ContextType = {|
  pathname: string,
  query: Object,
|};

type Props = {|
  insertCss: Function,
  client: Object,
  context: ContextType,
  children: Node,
|};

const ContextRuntimeType = {
  // Universal HTTP client
  pathname: PropTypes.string.isRequired,
  query: PropTypes.object,
};

const PropTypesRuntimeType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: PropTypes.func.isRequired,
  // Apollo Client
  client: PropTypes.object.isRequired,
  context: PropTypes.shape(ContextRuntimeType).isRequired,
  children: PropTypes.element.isRequired,
};

class App extends React.PureComponent<Props> {
  static propTypes = PropTypesRuntimeType;

  static childContextTypes = ContextRuntimeType;

  render() {
    // Here, we are at universe level, sure? ;-)
    const { client, insertCss, context } = this.props;
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    return (
      <ApolloProvider client={client}>
        <AppContext.Provider value={context}>
          <StyleContext.Provider value={{ insertCss }}>
            {this.props.children}
          </StyleContext.Provider>
        </AppContext.Provider>
      </ApolloProvider>
    );
  }
}

export default App;
