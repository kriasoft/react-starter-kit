/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as HtmlToReact from 'html-to-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import docco from 'react-syntax-highlighter/dist/styles/docco';
import s from './StudyEntityView.css';

const htmlToReactParser = new HtmlToReact.Parser();

class StudyEntityView extends React.Component {
  static propTypes = {
    body: PropTypes.string.isRequired,
  };

  componentWillMount() {
    this.initProcessingInstructions();
  }

  initProcessingInstructions() {
    const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(
      React,
    );
    this.processingInstructions = [
      /**
       * <pre></code class="javascript">
       * ...
       * </code></pre>
       */
      {
        shouldProcessNode: node =>
          node.name === 'pre' && _.get(node, 'children[0].name') === 'code',
        processNode: (node, children, index) => {
          const content = _.get(
            node,
            'children[0].children[0].data',
            '',
          ).trim();
          const lang = _.get(node, 'children[0].attribs.class');
          return (
            <SyntaxHighlighter key={index} language={lang} style={docco}>
              {content}
            </SyntaxHighlighter>
          );
        },
      },
      {
        shouldProcessNode: () => true,
        processNode: processNodeDefinitions.processDefaultNode,
      },
    ];
  }

  render() {
    function isValidNode(node) {
      return !!node;
    }
    const studyEntityElement = htmlToReactParser.parseWithInstructions(
      this.props.body,
      isValidNode,
      this.processingInstructions,
    );
    return (
      <div className={s.root}>
        {studyEntityElement}
      </div>
    );
  }
}

export default withStyles(s)(StudyEntityView);
