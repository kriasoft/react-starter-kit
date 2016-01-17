/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import s from './App.scss';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';

class App extends Component {

  static propTypes = {
    // context: PropTypes.shape({
    //   insertCss: PropTypes.func,
    //   onSetTitle: PropTypes.func,
    //   onSetMeta: PropTypes.func,
    //   onPageNotFound: PropTypes.func,
    // }),
    // children: PropTypes.element.isRequired,
    // error: PropTypes.object
  };

  static contextTypes = {
    insertCss: PropTypes.func.isRequired,
    onSetTitle: PropTypes.func.isRequired,
    onSetMeta: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired
  };

  // static childContextTypes = {
  //   insertCss: PropTypes.func.isRequired,
  //   onSetTitle: PropTypes.func.isRequired,
  //   onSetMeta: PropTypes.func.isRequired,
  //   onPageNotFound: PropTypes.func.isRequired
  // };

  // getChildContext() {
  //   console.log("---- getChildContext", this.context);
  //   const context = this.context;
  //   return {
  //     insertCss: context.insertCss || emptyFunction,
  //     onSetTitle: context.onSetTitle || emptyFunction,
  //     onSetMeta: context.onSetMeta || emptyFunction,
  //     onPageNotFound: context.onPageNotFound || emptyFunction,
  //   };
  // }

  componentWillMount() {
    // console.log("-- props", this.props);
    // console.log("-- real context", this.context);

    this.removeCss = this.context.insertCss(s);
  }

  componentWillUnmount() {
    this.removeCss();
  }

  render() {
    return !this.props.error ? (
      <div>
        <Header />
        {this.props.children}
        <Feedback />
        <Footer />
      </div>
    ) : this.props.children;
  }

}

export default App;
