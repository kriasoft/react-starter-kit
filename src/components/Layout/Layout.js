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
    secondMenu: PropTypes.shape({
      unit: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          link: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
        }),
      ),
      course: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          link: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
        }),
      ),
    }),
  };
  static defaultProps = {
    secondMenu: {},
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
    const { secondMenu } = this.props;
    const menu = secondMenu[name].map(item => (
      <li
        key={item.id}
        className={pathname === item.link ? 'active' : undefined}
      >
        <Link to={item.link}>{item.title}</Link>
      </li>
    ));
    return (
      <ul key={name} className="nav nav-pills nav-stacked">
        {menu}
      </ul>
    );
  }

  render() {
    const menuSecondList = [];
    const { secondMenu } = this.props;

    for (let i = 0; i < Layout.menuSecondOrder.length; i += 1) {
      const name = Layout.menuSecondOrder[i];
      if (secondMenu[name] && secondMenu[name].length) {
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
