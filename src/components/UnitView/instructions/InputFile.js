/* eslint-disable react/jsx-no-bind */
import _ from 'lodash';
import globToRegexp from 'glob-to-regexp';
import React from 'react';
import { Alert } from 'react-bootstrap';
import Base from './Base';

/**
 * <input type=file name=...>
 */
export default class InputFile extends Base {
  constructor(root, className) {
    super(root, 'input', { name: { $exists: true }, type: 'file' });
    this.className = className;
  }

  onChange = (name, filter, event) => {
    if (filter) {
      const re = globToRegexp(filter);
      if (
        _.get(event, 'target.files[0]') &&
        !re.test(event.target.files[0].name)
      ) {
        this.root.setAnswerState(name, {
          error: `Wrong filename (use: ${filter})`,
        });
        return;
      }
    }
    this.root.setAnswer(name, event.target.files[0], {
      error: undefined,
    });
  };

  processNode(node, children, index) {
    const name = _.get(node, 'attribs.name');
    const filter = _.get(node, 'attribs.filter');
    const renderAttrs = Base.inputRenderAttrs(node, children, index);
    const { id, internalName } = this.root.state.answers[name] || {};
    const { error } = this.root.getAnswerState(name) || {};
    return (
      <div className={this.className}>
        <button onClick={() => this.ref.click()}>Upload File</button>
        {error && <Alert>{error}</Alert>}
        {id && <a href={`/api/get_file/${id}`}>{internalName || id}</a>}
        <input
          ref={ref => (this.ref = ref)}
          {...renderAttrs}
          onChange={this.onChange.bind(this, name, filter)}
        />
      </div>
    );
  }
}
