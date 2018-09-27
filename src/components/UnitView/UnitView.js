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
import { github } from 'react-syntax-highlighter/dist/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';
import TextEditor from '../TextEditor';
import s from './UnitView.css';

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

class BaseProcessingInstruction {
  constructor(root, tag, filterAttrs) {
    this.tag = tag;
    this.filterAttrs = filterAttrs || {};
    this.root = root;
  }

  shouldProcessNode(node) {
    if (node.name !== this.tag || !_.get(node, 'attribs.name')) return false;
    return Object.keys(this.filterAttrs).every(
      k => _.get(node, `attribs.${k}`) === this.filterAttrs[k],
    );
  }
}

/**
 * <input type=file name=...>
 */
class InputFilePI extends BaseProcessingInstruction {
  constructor(root) {
    super(root, 'input', { type: 'file' });
  }

  processNode(node, children, index) {
    const name = _.get(node, 'attribs.name');
    const renderAttrs = inputRenderAttrs(node, children, index);
    return (
      <div className={s.inputFile}>
        {_.get(this.root.state.answers[name], 'id')}
        <button onClick={() => this.ref.click()}>upload new file</button>
        <input
          ref={ref => (this.ref = ref)}
          {...renderAttrs}
          onChange={event =>
            this.root.updateAnswer(name, event.target.files[0])
          }
        />
      </div>
    );
  }
}

class UnitView extends React.Component {
  static propTypes = {
    body: PropTypes.string.isRequired,
    value: PropTypes.instanceOf(Object),
    onChange: PropTypes.func,
    onHeadersChange: PropTypes.func,
  };
  static defaultProps = {
    value: null,
    onChange: null,
    onHeadersChange: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      answers: props.value || {},
    };
  }

  componentWillMount() {
    this.initProcessingInstructions();
    this.headers = [];
    this.domTree = htmlToReactParser.parseHtml(this.props.body);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ answers: nextProps.value || {} });
    if (this.props.body !== nextProps.body) {
      this.headers = [];
      this.domTree = htmlToReactParser.parseHtml(nextProps.body);
    }
  }

  updateAnswer(name, value) {
    const answers = { ...this.state.answers, [name]: value };
    this.setState({ answers });
    if (this.props.onChange) this.props.onChange(answers);
  }

  initProcessingInstructions() {
    const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(
      React,
    );
    this.processingInstructions = [
      /**
       * hide or show a tag
       * JS_EXPR - usual logical expression in JS which can access variable
       * answers which refers to this.state.answers
       * @if-show="JS_EXPR"
       */
      {
        shouldProcessNode: node => _.get(node, ['attribs', 'show']),
        processNode: (node, children, index) => {
          const fn = getCachedExpr(
            _.get(node, ['attribs', 'show']),
            expr => `return ${expr};`,
          );
          try {
            const show = fn(_.cloneDeep(this.state.answers));
            const CustomTag = node.name;
            return (
              <CustomTag
                style={show ? {} : { display: 'none' }}
                key={index}
                {...node.attribs}
              >
                {children}
              </CustomTag>
            );
          } catch (e) {
            console.log(e); // eslint-disable-line no-console
            return null;
          }
        },
      },
      /**
       * <pre><code class="javascript">
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
      new InputFilePI(this),
      /**
       * gathering info about H0..6 tags
       */
      {
        shouldProcessNode: node =>
          /^[hH]([1-6])$/.exec(node.name) && this.props.onHeadersChange,
        processNode: (node, children, index) => {
          const level = +/^[hH]([1-6])$/.exec(node.name)[1];
          const id =
            _.get(node, 'attribs.id') ||
            _.get(node, 'attribs.name') ||
            `header-${index}`;
          this.headers.push({
            level,
            id,
            title: node.children
              .filter(c => c.type === 'text')
              .map(c => c.data)
              .join(' '),
          });
          const renderAttrs = { id, key: index };
          const CustomTag = node.name;
          return <CustomTag {...renderAttrs}>{children}</CustomTag>;
        },
      },
      {
        shouldProcessNode: () => true,
        processNode: processNodeDefinitions.processDefaultNode,
      },
    ];
  }

  renderUnit() {
    if (!this.domTree) return null;
    const oldHeaders = this.headers;
    this.headers = [];
    const unitElement = htmlToReactParser.traverseDomToTree(
      this.domTree,
      node => !!node,
      this.processingInstructions,
    );
    if (this.props.onHeadersChange && !_.isEqual(oldHeaders, this.headers))
      setTimeout(() => this.props.onHeadersChange(this.headers), 0);
    return unitElement;
  }

  render() {
    return <div className={s.root}>{this.renderUnit()}</div>;
  }
}

export default withStyles(s)(UnitView);
