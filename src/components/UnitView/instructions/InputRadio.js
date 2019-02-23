import _ from 'lodash';
import React from 'react';
import Base from './Base';

/**
 * <input name="" type="radio" value="">
 */
export default class InputRadio extends Base {
  constructor(root) {
    super(root, 'input', {
      name: { $exists: true },
      type: 'radio',
      value: { $exists: true },
    });
  }

  processNode(node, children, index) {
    const name = _.get(node, 'attribs.name');
    const value = _.get(node, 'attribs.value');
    const renderAttrs = Base.inputRenderAttrs(node, children, index);
    const valueAttrs = {
      value,
      checked: this.root.state.answers[name] === value,
      onChange: event => this.root.setAnswer(name, event.target.value),
    };
    return <input {...renderAttrs} {...valueAttrs} />;
  }
}
