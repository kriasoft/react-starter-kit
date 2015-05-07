/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import { canUseDOM } from 'react/lib/ExecutionEnvironment';

class Css {

  set(css) {
    if (!canUseDOM) {
      return;
    }

    let elem;

    if (!this.styleElement) {
      elem = this.styleElement = document.createElement('style');
      elem.setAttribute('type', 'text/css');

      if ('textContent' in elem) {
        elem.textContent = css;
      } else {
        elem.styleSheet.cssText = css;
      }

      this.lastCss = css;
      document.getElementsByTagName('head')[0].appendChild(elem);

    } else if (this.lastCss !== css) {

      elem = this.styleElement;

      if ('textContent' in elem) {
        elem.textContent = css;
      } else {
        elem.styleSheet.cssText = css;
      }

    }
  }

}

export default Css;
