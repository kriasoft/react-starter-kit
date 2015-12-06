/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';
import s from './TextBox.scss';
import withStyles from '../../decorators/withStyles';

@withStyles(s)
class TextBox extends Component {

  static propTypes = {
    maxLines: PropTypes.number,
  };

  static defaultProps = {
    maxLines: 1,
  };

  render() {
    return (
      <div className={s.root}>
        {this.props.maxLines > 1 ?
          <textarea {...this.props} className={s.input} ref="input" key="input" rows={this.props.maxLines} /> :
          <input {...this.props} className={s.input} ref="input" key="input" />}
      </div>
    );
  }

}

export default TextBox;
