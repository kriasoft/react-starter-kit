/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import './Footer.less';

class Footer {

  static propTypes = {
    viewport: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="Footer">
        <div className="Footer-container">
          <span className="Footer-text">© Your Company</span>
          <a className="Footer-link" href="/">Home</a>
          <a className="Footer-link" href="/privacy">Privacy</a>
          <span className="Footer-text Footer-text--muted">|&nbsp; {'Viewport: ' + this.props.viewport.width + 'x' + this.props.viewport.height}</span>
        </div>
      </div>
    );
  }

}

export default Footer;
