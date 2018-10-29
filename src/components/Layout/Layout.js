import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import { Grid, Col, Row } from 'react-bootstrap';
// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

class Layout extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <Fragment>
        <Header />
        <Grid fluid>
          <Row>
            <Sidebar />
            <Col sm={9} smOffset={3} md={10} mdOffset={2} className={s.main}>
              {children}
              <Footer />
            </Col>
          </Row>
        </Grid>
      </Fragment>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withStyles(normalizeCss, bootstrap, s)(Layout);
