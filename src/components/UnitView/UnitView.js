import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as HtmlToReact from 'html-to-react';
import * as PI from './instructions';
import s from './UnitView.css';

const htmlToReactParser = new HtmlToReact.Parser();

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

  setAnswer(name, value, state) {
    const answers = { ...this.state.answers, [name]: value };
    if (this.props.onChange) this.props.onChange(answers);
    if (state) {
      const answerState = this.prefixedAnswerState(name, state);
      this.setState({ answers, ...answerState });
    } else {
      this.setState({ answers });
    }
  }

  setAnswerState(name, value) {
    const answerState = this.prefixedAnswerState(name, value);
    this.setState(answerState);
  }

  getAnswerState(name) {
    const answerState = {};
    Object.keys(this.state).forEach(k => {
      const key = `${name}_`;
      if (!k.startsWith(key)) return;
      answerState[k.replace(key, '')] = this.state[k];
    });
    return answerState;
  }

  // eslint-disable-next-line class-methods-use-this
  prefixedAnswerState(name, value) {
    const answerState = {};
    Object.keys(value).forEach(k => {
      answerState[`${name}_${k}`] = value[k];
    });
    return answerState;
  }

  initProcessingInstructions() {
    const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(
      React,
    );
    this.processingInstructions = [
      new PI.ShowAttr(this),
      new PI.PreCode(this),
      new PI.TextareaLanguage(this),
      new PI.InputText(this),
      new PI.InputCheckbox(this),
      new PI.InputRadio(this),
      new PI.InputFile(this, s.inputFile),
      new PI.Headers(this, this.props.onHeadersChange),
      new PI.ScriptGraphviz(this),
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
