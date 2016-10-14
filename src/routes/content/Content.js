/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import s from './Content.css';
import { getLocaleContent } from '../../actions/content';

class Content extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    data: PropTypes.shape({
      content: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    getLocaleContent: PropTypes.func.isRequired,
  };
  componentDidUpdate(prevProp) {
    // client-side fetching when language changes
    const { path, locale } = this.props;
    if (prevProp.locale !== locale) {
      this.props.getLocaleContent(path, locale);
    }
  }
  render() {
    const { path, data } = this.props;
    return (
      <Layout>
        <div className={s.root}>
          <div className={s.container}>
            {data.title && path !== '/' && <h1>{data.title}</h1>}
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
          </div>
        </div>
      </Layout>
    );
  }
}

const mapState = (state) => ({
  locale: state.intl.locale,
  data: state.content.data,
});

const mapDispatch = {
  getLocaleContent,
};

const EnhancedContent = connect(mapState, mapDispatch)(Content);

export default withStyles(s)(EnhancedContent);
