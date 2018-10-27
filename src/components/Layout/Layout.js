import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import bootstrap from 'bootstrap/dist/css/bootstrap.css';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import Header from '../Header';
import Footer from '../Footer';
import Link from '../Link';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  static contextTypes = {
    store: PropTypes.any.isRequired,
    pathname: PropTypes.any.isRequired,
  };

  static menuSecondOrder = ['unit', 'course'];

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderSecondMenu(name) {
    const { pathname } = this.context;
    const menu = this.props.secondMenu[name].map(item => ( // eslint-disable-line
      <li key={item.id} className={pathname === item.link ? s.active : null}>
        <Link to={item.link}>{item.title}</Link>
      </li>
    ));
    return (
      <ul key={name} className={`nav ${s['nav-sidebar']}`}>
        {menu}
      </ul>
    );
  }

  render() {
    const menuSecondList = [];
    for (let i = 0; i < Layout.menuSecondOrder.length; i += 1) {
      const name = Layout.menuSecondOrder[i];
      if (this.props.secondMenu[name] && this.props.secondMenu[name].length) { // eslint-disable-line
        menuSecondList.push(this.renderSecondMenu(name));
      }
    }
    return (
      <div>
        <Header />
        <div className="container-fluid">
          <div className="row">
            <div className={`col-sm-3 col-md-2 ${s.sidebar}`}>
              {menuSecondList}
            </div>
            <div
              className={`col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 ${
                s.main
              }`}
            >
              {this.props.children}
              <Footer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  secondMenu: state.secondMenu || [],
});

export default connect(mapStateToProps)(
  withStyles(normalizeCss, bootstrap, s)(Layout),
);
