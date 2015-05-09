/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import './App.less';
import React, { PropTypes } from 'react';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import Header from '../Header';
import ContentPage from '../ContentPage';
import ContactPage from '../ContactPage';
import LoginPage from '../LoginPage';
import RegisterPage from '../RegisterPage';
import NotFoundPage from '../NotFoundPage';
import Feedback from '../Feedback';
import Footer from '../Footer';

const pages = { ContentPage, ContactPage, LoginPage, RegisterPage, NotFoundPage };

class App {

  static propTypes = {
    path: PropTypes.string.isRequired,
    onSetTitle: PropTypes.func.isRequired,
    onSetMeta: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired
  };

  componentDidMount() {
    window.addEventListener('popstate', this.handlePopState);
    window.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);
    window.removeEventListener('click', this.handleClick);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.path !== nextProps.path;
  }

  render() {
    switch (this.props.path) {

      case '/contact':
        this.props.onSetTitle(ContactPage.title);
        this.component = <ContactPage />;
        break;

      case '/login':
        this.props.onSetTitle(LoginPage.title);
        this.component = <LoginPage />;
        break;

      case '/register':
        this.props.onSetTitle(RegisterPage.title);
        this.component = <RegisterPage />;
        break;

      default:
        let page = AppStore.getPage(this.props.path);
        if (page) {
          this.props.onSetTitle(page.title);
          this.component = React.createElement(pages[page.component], page);
        } else {
          this.props.onSetTitle(NotFoundPage.title);
          this.props.onPageNotFound();
          this.component = <NotFoundPage />;
        }
    }

    return (
      <div>
        <Header />
        {this.component}
        <Feedback />
        <Footer />
      </div>
    );
  }

  handlePopState(event) {
    AppActions.navigateTo(window.location.pathname, {replace: !!event.state});
  }

  handleClick(event) {
    if (event.button === 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.defaultPrevented) {
      return;
    }

    // Ensure link
    var el = event.target;
    while (el && el.nodeName !== 'A') {
      el = el.parentNode;
    }
    if (!el || el.nodeName !== 'A') {
      return;
    }

    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.getAttribute('download') || el.getAttribute('rel') === 'external') {
      return;
    }

    // Ensure non-hash for the same path
    var link = el.getAttribute('href');
    if (el.pathname === location.pathname && (el.hash || link === '#')) {
      return;
    }

    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) {
      return;
    }

    // Check target
    if (el.target) {
      return;
    }

    // X-origin
    var origin = window.location.protocol + '//' + window.location.hostname +
      (window.location.port ? ':' + window.location.port : '');
    if (!(el.href && el.href.indexOf(origin) === 0)) {
      return;
    }

    // Rebuild path
    var path = el.pathname + el.search + (el.hash || '');

    event.preventDefault();
    AppActions.navigateTo(path);
  }

}

export default App;
