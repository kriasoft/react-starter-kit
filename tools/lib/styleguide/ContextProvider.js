import { Component } from 'react';
import PropTypes from 'prop-types';

const ContextType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: PropTypes.func.isRequired,
};

/* This is a fallback for the withStyles export */
class ContextProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    context: PropTypes.shape(ContextType).isRequired,
  };

  static contextTypes = {
    insertCss: PropTypes.func,
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
  };

  getChildContext() {
    return this.props.context;
  }

  render() {
    return this.props.children;
  }
}

export default ContextProvider;
