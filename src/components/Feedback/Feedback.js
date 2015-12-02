/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component } from 'react';
import s from './Feedback.scss';
import withStyles from '../../decorators/withStyles';

@withStyles(s)
class Feedback extends Component {

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <a className={s.link} href="https://gitter.im/kriasoft/react-starter-kit">Ask a question</a>
          <span className={s.spacer}>|</span>
          <a className={s.link} href="https://github.com/kriasoft/react-starter-kit/issues/new">Report an issue</a>
        </div>
      </div>
    );
  }

}

export default Feedback;
