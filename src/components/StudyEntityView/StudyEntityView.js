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
import github from 'react-syntax-highlighter/dist/styles/github';
import SyntaxHighlighter from 'react-syntax-highlighter';
import TextEditor from '../TextEditor';
import s from './StudyEntityView.css';

const htmlToReactParser = new HtmlToReact.Parser();

class StudyEntityView extends React.Component {
  static defaultProps = {
    answerId: null,
    value: null,
    onChange: null,
  };
  static propTypes = {
    body: PropTypes.string.isRequired,
    answerId: PropTypes.string,
    value: PropTypes.instanceOf(Object),
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      answers: props.value || {},
      answerId: props.answerId,
    };
  }

  componentWillMount() {
    this.initProcessingInstructions();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      answers: nextProps.value || {},
      answerId: nextProps.answerId,
    });
  }

  updateAnswer(name, value) {
    this.state.answers[name] = value;
    if (this.props.onChange) this.props.onChange(this.state.answers);
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
            <SyntaxHighlighter key={index} language={lang} style={github}>
              {content}
            </SyntaxHighlighter>
          );
        },
      },
      /**
       * <textarea name="" language="javascript">
       * ...
       * </textarea>
       */
      {
        shouldProcessNode: node =>
          node.name === 'textarea' &&
          _.get(node, 'attribs.language') &&
          _.get(node, 'attribs.name'),
        processNode: (node, children, index) => {
          const name = _.get(node, 'attribs.name');
          const content =
            this.state.answers[name] || _.get(node, 'children[0].data') || '';
          const mode = _.get(node, 'attribs.language');
          const changeHandler = this.updateAnswer.bind(this, name);
          return (
            <TextEditor
              key={index}
              value={content}
              mode={mode}
              onChange={changeHandler}
            />
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
