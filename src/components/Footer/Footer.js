/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import './Footer.less';
import Link from '../../utils/Link';
import Css from '../../utils/Css';
import setViewport from '../decorators/setViewport'; // eslint-disable-line no-unused-vars

const css = new Css();

@setViewport
class Footer {

  static propTypes = {
    viewport: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }).isRequired
  };

  render() {
    // This is just an example how one can render CSS
    let { width, height } = this.props.viewport;
    css.set(`.Footer-viewport:after {content:' ${width}x${height}';}`);

    return (
      <div className="Footer">
        <div className="Footer-container">
          <span className="Footer-text">© Your Company</span>
          <span className="Footer-spacer">·</span>
          <a className="Footer-link" href="/" onClick={Link.handleClick}>Home</a>
          <span className="Footer-spacer">·</span>
          <a className="Footer-link" href="/privacy" onClick={Link.handleClick}>Privacy</a>
          <span className="Footer-spacer"> | </span>
          <span ref="viewport" className="Footer-viewport Footer-text Footer-text--muted">Viewport:</span>
        </div>
      </div>
    );
  }

}

export default Footer;
