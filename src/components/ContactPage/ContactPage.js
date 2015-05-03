/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react'; // eslint-disable-line no-unused-vars
import './ContactPage.less';

class ContactPage {

  static title = 'Contact Us';

  render() {
    return (
      <div className="ContactPage">
        <div className="ContactPage-container">
          <h1>{ContactPage.title}</h1>
          <p>...</p>
        </div>
      </div>
    );
  }

}

export default ContactPage;
