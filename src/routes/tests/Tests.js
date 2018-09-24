import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Tests.css';

class Tests extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    const { title } = this.props;
    return (
      <div className={s.container}>
        <div className={s.root}>
          <h1>{title}</h1>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Tests);
