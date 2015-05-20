/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react'; // eslint-disable-line no-unused-vars
import styles from './Feedback.less'; // eslint-disable-line no-unused-vars
import withStyles from '../decorators/withStyles'; // eslint-disable-line no-unused-vars

@withStyles(styles)
class Feedback {

  render() {
    return (
      <div className="Feedback">
        <div className="Feedback-container">
          <a className="Feedback-link" href="https://gitter.im/kriasoft/react-starter-kit">Ask a question</a>
          <span className="Feedback-spacer">|</span>
          <a className="Feedback-link" href="https://github.com/kriasoft/react-starter-kit/issues/new">Report an issue</a>
        </div>
      </div>
    );
  }

}

export default Feedback;
