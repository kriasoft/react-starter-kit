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

function inputRenderAttrs(node, children, index) {
  const name = _.get(node, 'attribs.name');
  return {
    name,
    key: index,
    type: _.get(node, 'attribs.type'),
  };
}

const EXPR_CACHE = {};

function getCachedExpr(expr, template) {
  if (!EXPR_CACHE[expr])
    try {
      EXPR_CACHE[expr] = new Function('answers', template(expr)); // eslint-disable-line no-new-func
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
      EXPR_CACHE[expr] = _.noop;
    }
  return EXPR_CACHE[expr];
}

class StudyEntityView extends React.Component {
  static defaultProps = {
    value: null,
    onChange: null,
  };
  static propTypes = {
    body: PropTypes.string.isRequired,
    value: PropTypes.instanceOf(Object),
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      answers: props.value || {},
    };
  }

  componentWillMount() {
    this.initProcessingInstructions();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      answers: nextProps.value || {},
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
          const value = _.get(node, 'children[0].children[0].data', '').trim();
          const lang = _.get(node, 'children[0].attribs.class');
          return (
            <SyntaxHighlighter key={index} language={lang} style={github}>
              {value}
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
          const renderAttrs = {
            name,
            key: index,
            mode: _.get(node, 'attribs.language'),
          };
          const valueAttrs = {
            value:
              this.state.answers[name] || _.get(node, 'children[0].data', ''),
            onChange: this.updateAnswer.bind(this, name),
          };
          return <TextEditor {...renderAttrs} {...valueAttrs} />;
        },
      },
      /**
       * hides or show a piece of HTML
       * JS_EXPR - usual logical expression in JS which can access variable
       * answers which refers to this.state.answers
       * <if show="JS_EXPR"|hide="JS_EXPR">
       * ...
       * </if>
       */
      {
        shouldProcessNode: node => node.name === 'if',
        processNode: (node, children, index) => {
          let fn = _.noop;
          if (_.get(node, 'attribs.show'))
            fn = getCachedExpr(
              _.get(node, 'attribs.show'),
              expr => `return ${expr};`,
            );
          else if (_.get(node, 'attribs.hide'))
            fn = getCachedExpr(
              _.get(node, 'attribs.hide'),
              expr => `return !(${expr});`,
            );
          try {
            const show = fn(_.cloneDeep(this.state.answers));
            if (show) return <span key={index}>{children}</span>;
          } catch (e) {
            console.log(e); // eslint-disable-line no-console
            return false;
          }
          return false;
        },
      },
      /**
       * <input name="" type="text|color">
       */
      {
        shouldProcessNode: node =>
          node.name === 'input' &&
          _.get(node, 'attribs.name') &&
          ['text', 'color'].includes(_.get(node, 'attribs.type', 'text')),
        processNode: (node, children, index) => {
          const name = _.get(node, 'attribs.name');
          const renderAttrs = inputRenderAttrs(node, children, index);
          const valueAttrs = {
            value: this.state.answers[name] || _.get(node, 'attribs.value', ''),
            onChange: event => this.updateAnswer(name, event.target.value),
          };
          return <input {...renderAttrs} {...valueAttrs} />;
        },
      },
      /**
       * <input name="" type="checkbox">
       */
      {
        shouldProcessNode: node =>
          node.name === 'input' &&
          _.get(node, 'attribs.name') &&
          _.get(node, 'attribs.type') === 'checkbox',
        processNode: (node, children, index) => {
          const name = _.get(node, 'attribs.name');
          const renderAttrs = inputRenderAttrs(node, children, index);
          const valueAttrs = {
            checked:
              this.state.answers[name] || _.get(node, 'attribs.value', ''),
            onChange: event => this.updateAnswer(name, event.target.checked),
          };
          return <input {...renderAttrs} {...valueAttrs} />;
        },
      },
      /**
       * <input name="" type="radio" value="">
       */
      {
        shouldProcessNode: node =>
          node.name === 'input' &&
          _.get(node, 'attribs.name') &&
          _.get(node, 'attribs.value') &&
          _.get(node, 'attribs.type') === 'radio',
        processNode: (node, children, index) => {
          const name = _.get(node, 'attribs.name');
          const renderAttrs = inputRenderAttrs(node, children, index);
          const value = _.get(node, 'attribs.value');
          const valueAttrs = {
            value,
            checked: this.state.answers[name] === value,
            onChange: event => this.updateAnswer(name, event.target.value),
          };
          return <input {...renderAttrs} {...valueAttrs} />;
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
    return <div className={s.root}>{studyEntityElement}</div>;
  }
}

export default withStyles(s)(StudyEntityView);
