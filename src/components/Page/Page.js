/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import { titleize } from 'lodash-inflection';
// This is necessary because some classes are interpolated, not unused
// eslint-disable-next-line css-modules/no-unused-class
import s from './Page.css';

class Page extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    html: PropTypes.string.isRequired,
    /* eslint-disable */
    leftColumnTitle: PropTypes.string,
    leftColumnHtml: PropTypes.string,
    rightColumnTitle: PropTypes.string,
    rightColumnHtml: PropTypes.string,
    /* eslint-enable */
  };
  static defaultProps = {
    leftColumnTitle: '',
    leftColumnHtml: '',
    rightColumnTitle: '',
    rightColumnHtml: '',
  };
  renderColumnTitle(side) {
    const titleKey = `${side}ColumnTitle`;
    if (!this.props[titleKey]) return '';
    return (
      <h2
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: this.props[titleKey] }}
      />
    );
  }
  renderColumnHtml(side) {
    const columnHtml = this.props[`${side}ColumnHtml`];
    if (!columnHtml) return '';
    return (
      <section className={s[`section${titleize(side)}Column`]}>
        {this.renderColumnTitle(side)}
        <article
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: columnHtml }}
        />
      </section>
    );
  }
  render() {
    const { title, html } = this.props;
    const hasAdjacentColumns =
      this.props.leftColumnHtml && this.props.rightColumnHtml;
    const hasOnlyLeftColumn = !hasAdjacentColumns && this.props.leftColumnHtml;
    const hasOnlyRightColumn =
      !hasAdjacentColumns && this.props.rightColumnHtml;
    return (
      <div className={s.root}>
        <div
          // The linter complains because these classes are nested
          /* eslint-disable css-modules/no-undef-class */
          className={classNames(s.container, {
            [s.multiColumn]: hasAdjacentColumns,
            [s.leftColumn]: hasOnlyLeftColumn,
            [s.rightColumn]: hasOnlyRightColumn,
          })}
          /* eslint-enable css-modules/no-undef-class */
        >
          {this.renderColumnHtml('left')}
          <section
            className={classNames({
              [s.sectionMainColumnNarrow]: hasAdjacentColumns,
              [s.sectionMainColumnWide]:
                hasOnlyRightColumn || hasOnlyLeftColumn,
            })}
          >
            <h1>{title}</h1>
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </section>
          {this.renderColumnHtml('right')}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Page);
